goog.provide('pstj.material.InputBase');
goog.provide('pstj.material.InputBaseRenderer');

goog.require('goog.asserts');
goog.require('goog.async.AnimationDelay');
goog.require('goog.async.Delay');
goog.require('goog.async.nextTick');
goog.require('goog.format.EmailAddress');
goog.require('goog.labs.userAgent.platform');
goog.require('goog.string');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('goog.userAgent');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.EventMap');
goog.require('pstj.material.template');

goog.scope(function() {
var E = pstj.material.Element;
var ER = pstj.material.ElementRenderer;
var state = goog.ui.Component.State;


/** @extends {E} */
pstj.material.InputBase = goog.defineClass(E, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    E.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * The name of the input, used in forms.
     * @type {string}
     */
    this.name = '';
    /**
     * The type of the input.
     * @type {string}
     */
    this.type = '';
    /**
     * The value of the input, represented as string.
     * @type {string}
     * @protected
     */
    this.value = '';
    /**
     * The label of the input - should be a descriptive string for the
     * meaning of the value expected.
     * @type {string}
     */
    this.label = '';
    /**
     * The error message to display to the user.
     * @type {string}
     */
    this.errorMessage = '';
    /**
     * A cache for the value of the input.
     * @type {string}
     * @private
     */
    this.cachedValue_ = '';
    /**
     * The pattern used to validate the input.
     * @type {RegExp}
     * @private
     */
    this.validityPattern_ = null;
    /**
     * If a value is required, this is only useful in form validity context.
     * @type {boolean}
     * @private
     */
    this.required_ = false;
    /**
     * Reference the actual input element for the component.
     * @type {HTMLInputElement}
     * @protected
     */
    this.inputElement = null;
    /**
     * Value checker that is put to delay after the last input from the
     * user in the native element.
     * @type {!goog.async.Delay<!pstj.material.InputBase>}
     * @private
     */
    this.checkValueDelayed_ =
        new goog.async.Delay(this.valueCheckWorkaround_, 200, this);
    this.iosDelay_ = new goog.async.AnimationDelay(
        this.propagateChange_, this.getDomHelper().getWindow(), this);
    // Register auto-dispose of the delay binding.
    this.registerDisposable(this.checkValueDelayed_);

    // Configure the supported states of the component.
    this.setSupportedState(state.EMPTY, true);
    this.setSupportedState(state.INVALID, true);
    this.setSupportedState(state.DISABLED, true);
    this.setSupportedState(state.FOCUSED, true);

    // Automatically handle the FOCUSED/DISABLED states
    this.setAutoStates(state.FOCUSED | state.DISABLED, true);

    // Dispatch events for focus/disable/enable/blur.
    this.setDispatchTransitionEvents(state.FOCUSED | state.DISABLED, true);

    // By default we want to use the tap.
    this.setUsePointerAgent(true);
    this.setAutoEventsInternal(pstj.material.EventMap.EventFlag.PRESS);
  },

  /**
   * Set the input to be a required one.
   * @param {boolean} required
   */
  setIsRequired: function(required) { this.required_ = required; },

  /**
   * Gets if the input is configured as required one.
   * @return {boolean}
   */
  getIsRequired: function() { return this.required_; },

  /**
   * Allows access to the cached value of the input.
   *
   * The cached value represents the value that the user wants to be put
   * in the input. If the client code prevents the CHANGE event the intrinsic
   * value of the input will not be updated to match the input value and
   * it should be reverted to the intrinsic value.
   *
   * @return {string}
   */
  getCachedValue: function() { return this.cachedValue_; },

  /**
   * Allows for programatically setting a new value on the input.
   * @param {string} new_value The new value to set.
   */
  setValue: function(new_value) {
    if (this.value != new_value) {
      this.inputElement.value = new_value;
      goog.async.nextTick(this.propagateChange_, this);
    }
  },

  /**
   * Allow for external access to the current intrinsic value of the input.
   * @return {string}
   */
  getValue: function() { return this.value; },

  /**
   * Checks the current input value against the rules for the input validity.
   * @package
   */
  valueCheckWorkaround_: function() {
    if (this.inputElement.value != this.cachedValue_) {
      this.propagateChange_();
    }
    // Repeat this forever until it is stopped.
    this.checkValueDelayed_.start();
  },

  /**
   * Called when a change in the input is detected, either by the timer
   * or when the user uses the keyboard.
   *
   * Becasue it is called from the handler for key events the control instance
   * needs to know if the event was stopped so we return the value of the
   * change handler.
   *
   * @return {boolean}
   */
  propagateChange_: function() {
    this.cachedValue_ = this.inputElement.value;
    var stopped = !this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
    if (!stopped) {
      this.value = this.inputElement.value;
    } else {
      this.inputElement.value = this.value;
    }
    return stopped;
  },

  /**
   * This method is derived to be used as a work around for the android
   * auto-input mechnizm in Chrome mobile - the native input element
   * does not fire the key events because those are types on a
   * virtual keyboard and thus we cannot monitor the input for changes. This
   * workaround starts a timer that checks the input's value every 200 ms
   * and updates the internal representation. It is automatically started when
   * then input is focused.
   *
   * NOTE: Do not use directly!
   *
   * @package
   * @param {boolean} enable If true, starts the timer for repeated checks.
   */
  enableInputMonitoring: function(enable) {
    if (enable && !this.checkValueDelayed_.isActive()) {
      this.checkValueDelayed_.start();
    } else {
      this.checkValueDelayed_.stop();
    }
  },

  /**
   * Configures the validity pattern for the input element.
   *
   * @param {string} pattern A valid RegExp string.
   */
  setValidityPattern: function(pattern) {
    this.validityPattern_ = new RegExp(pattern);
  },

  /**
   * Handles the change events from the base class (same instance).
   *
   * By the time this event hits us the DOM input value is changed and then
   * read into the cached value of the instance. If we prevent this event
   * the value will be reverted to the intrinsic value of the input so the
   * DOM input value will change back.
   *
   * @protected
   * @param {goog.events.Event} e The event from the same instance.
   */
  handleChangeEvent: function(e) {
    this.setValid(this.stringIsValidValue(this.getCachedValue()));
    this.setEmpty(this.getCachedValue().length == 0);
  },

  /**
   * Checks the validity of a string against the current validity pattern.
   *
   * @param {string} value The string to check.
   * @return {boolean} True if the value is valid/matching the pattern.
   */
  stringIsValidValue: function(value) {
    var valid = true;
    var is_empty_string = goog.string.isEmptyString(goog.string.trim(value));

    if (this.required_ && is_empty_string) {
      if (this.isFocused()) {
        valid = false;
      }
    } else {
      // Make more checks if the value is not an empty string
      if (!is_empty_string) {
        if (!goog.isNull(this.validityPattern_)) {
          if (!this.validityPattern_.test(value)) {
            valid = false;
          }
        } else {
          // we have no configured pattern, fall back to some sane defaults.
          if (this.type == 'number') {
            valid = goog.string.isNumeric(value);
          } else if (this.type == 'email') {
            valid = goog.format.EmailAddress.isValidAddrSpec(value);
          }
        }
      }
    }
    return valid;
  },

  /** @override */
  decorateInternal: function(element) {
    goog.base(this, 'decorateInternal', element);
    var input = this.inputElement;

    var name = input.getAttribute('name');
    if (goog.isNull(name)) name = element.getAttribute('name');
    if (!goog.isNull(name)) this.name = name.toString();

    var type = input.getAttribute('type');
    if (goog.isNull(type)) type = element.getAttribute('type');
    if (!goog.isNull(type)) this.type = type;

    this.value = input.value;

    // We currently do not support dynamic setter on the value,
    // either set it programatically and render or the value from the
    // decoration will not be used.

    // at this point the name type and value should be extracted if any,
    // use them to setup the pattern.
    if (goog.isNull(this.validityPattern_)) {
      var pattern = element.getAttribute('pattern');
      if (!goog.isNull(pattern)) {
        this.setValidityPattern(pattern);
      } else {
        if (this.type == 'tel') {
          this.validityPattern_ = pstj.material.InputBase.RegExps.TEL;
        }
        if (this.type == 'email') {
          this.validityPattern_ = pstj.material.InputBase.RegExps.EMAIL;
        }
      }
    }

    var isreq = element.getAttribute('required');
    if (!goog.isNull(isreq)) {
      this.required_ = true;
    }
  },

  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    this.inputElement =
        this.getRenderer().getInputElement(this.getElementStrict());
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this, goog.ui.Component.EventType.CHANGE,
                             this.handleChangeEvent);
    // On desktop the number type input does not trigger any input so we need
    // to listen for change
    if (!goog.userAgent.MOBILE && this.type == 'number') {
      this.getHandler().listen(this.inputElement, goog.events.EventType.CHANGE,
                               this.propagateChange_);
    }
    // When pasting we do not receive input either
    this.getHandler().listen(this.inputElement, goog.events.EventType.PASTE,
                             function(e) { this.iosDelay_.start(); });
  },

  /** @override */
  disposeInternal: function() {
    goog.base(this, 'disposeInternal');
    this.inputElement = null;
  },

  /**
   * Overrides the handling of the key events from Control.
   * @override
   */
  handleKeyEventInternal: function(e) {
    // The inherited behavior is to simply fire the ACTION event on ENTER
    // key and if it is not stopped / handled we should proceed further.
    var handled = goog.base(this, 'handleKeyEventInternal', e);
    if (!handled) {
      // delay this work until stack empties so the input will have the
      // correct value. iOS is slower somehow so we need larger delay.
      if (goog.labs.userAgent.platform.isIos) {
        this.iosDelay_.start();
      } else {
        goog.async.nextTick(this.propagateChange_, this);
      }
    }
    return handled;
  },

  /**
   * @override
   * @return {pstj.material.InputBaseRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
                                         pstj.material.InputBaseRenderer);
  },

  /**
   * Disable the input as well.
   * @override
   */
  setEnabled: function(enable) {
    goog.base(this, 'setEnabled', enable);
    this.inputElement.disabled = (enable ? false : true);
  },

  /**
   * Overrides the Control method so that the actual input element is
   * returned.
   *
   * For the Input instances we need to have automatic  state handling.
   * @override
   */
  getKeyEventTarget: function() { return this.inputElement; },

  statics: {
    /**
     * Provides the RE for inputs of known types.
     * @enum {!RegExp}
     */
    RegExps: {
      TEL: /^\+?\d{3,12}$/,
      EMAIL: new RegExp(
          '^[+a-zA-Z0-9_.!#$%&\'*\\/=?^`{|}~-]+@([a-zA-Z0-9-]+\\.)+' +
          '[a-zA-Z0-9]{2,63}$')
    }
  }
});


/** @extends {ER} */
pstj.material.InputBaseRenderer = goog.defineClass(ER, {
  constructor: function() { ER.call(this); },

  /**
   * Getter for the actual input element in the dom tree.
   * @param {Element} root The root of the component's DOM tree.
   * @return {HTMLInputElement}
   */
  getInputElement: function(root) {
    var input = root.querySelector('input');
    return /**@type {HTMLInputElement} */ (input);
  },

  /** @override */
  getTemplate: function(model) {
    return pstj.material.template.InputBase(model);
  },

  /** @override */
  generateTemplateData: function(instance) {
    goog.asserts.assertInstanceof(instance, pstj.material.InputBase);
    var type = instance.type;
    if (type != 'text' && type != 'password') type = 'text';
    return {
      name: instance.name,
      type: type,
      value: instance.value,
      label: instance.label,
      error: instance.errorMessage
    };
  },

  /** @override */
  getCssClass: function() { return pstj.material.InputBaseRenderer.CSS_CLASS; },

  statics: {
    /**
     * @type {string}
     * @const
     */
    CSS_CLASS: goog.getCssName('material-base-input')
  }
});
goog.addSingletonGetter(pstj.material.InputBaseRenderer);

// Register the default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.InputBase,
                                    pstj.material.InputBaseRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.InputBaseRenderer.CSS_CLASS,
    function() { return new pstj.material.InputBase(null); });

});  // goog.scope
