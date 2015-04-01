goog.provide('pstj.material.InputElement');
goog.provide('pstj.material.InputElementRenderer');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('pstj.ds.ListItem');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.EventMap');
goog.require('pstj.material.template');

goog.scope(function() {
var E = pstj.material.Element;
var ER = pstj.material.ElementRenderer;


/**
 * Implementation of the actual input body.
 */
// keypress, change, focus, blur
pstj.material.InputElement = goog.defineClass(E, {
  /**
   * Provides implementation for the material design inspred input.
   * @constructor
   * @extends {E}
   * @struct
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
     * The name to use on the input element. This is useful for form elements
     * mostly.
     * @type {string}
     */
    this.name = '';
    /**
     * The type of the input element. CUrrently could be only password or
     * text. It could also be number or money or anything else, but the
     * DOM element will still be assumed to be type text and the custom
     * validity will be enforced from the javascript and not from the DOM
     * implementation. This allows to have very customizable inputs without
     * repying on browser support.
     * @type {string}
     */
    this.type = '';
    /**
     * Optional label to use. Note that it will be used as placeholder and
     * any actual placeholder on the input will be discarted. This is done to
     * unify how the input works on supporting and older browsers.
     * @type {string}
     */
    this.label = '';
    /**
     * Holds the currently visible value of the input. This is different from
     * the actual value only by its access from outside.
     * @type {string}
     */
    this.value = '';
    /**
     * Flag - true if a value is required to be non empty space.
     * @type {boolean}
     */
    this.required = false;
    /**
     * The pattern that should validate the value. If the pattern does not match
     * the item is considered invalid.
     * @type {RegExp}
     */
    this.pattern = null;
    /**
     * Cached checkvalue callback. We do this to lower the heap fluctuation.
     * This is self calling every 200 ms so we need to stop it when we start it
     * otherwise you can end up with multiple running checkers and this can
     * potentially slow down performance.
     * @type {goog.async.Delay}
     * @private
     */
    this.delay_ = new goog.async.Delay(this.populateValueAndroid_, 200, this);
    this.registerDisposable(this.delay_);


    // Allow the focus auto events to process.
    this.setSupportedState(goog.ui.Component.State.FOCUSED, true);
    this.setSupportedState(goog.ui.Component.State.INVALID, true);
    this.setSupportedState(goog.ui.Component.State.EMPTY, true);
    this.setSupportedState(goog.ui.Component.State.DISABLED, true);
    this.setAutoStates(goog.ui.Component.State.FOCUSED |
        goog.ui.Component.State.DISABLED, true);
    this.setDispatchTransitionEvents(goog.ui.Component.State.FOCUSED |
        goog.ui.Component.State.DISABLED, true);
    // Force automatic registration for dispatching event handler events.
    // Note that the parrent should subscribe to the event in order to
    // receive it!
    this.setAutoEventsInternal(pstj.material.EventMap.EventFlag.PRESS);
  },


  /** @inheritDoc */
  decorateInternal: function(el) {
    goog.base(this, 'decorateInternal', el);
    // determine the properties from the dom.
    var input = this.getInputElement();
    this.name = input.getAttribute('name') || '';
    this.type = input.getAttribute('type') || '';
    var pattern = input.getAttribute('pattern');
    if (!goog.isNull(pattern) && !goog.string.isEmptyOrWhitespace(pattern)) {
      this.setPatternInternal(pattern);
    }

    this.value = input.value;
    this.label = input.getAttribute('placeholder') || '';

    // Finally reset the type of the input in the DOM.
    if (this.type != 'password' && this.type != 'text') {
      input.type = 'text';
    }
    this.updateStateFromValue();
  },

  /**
   * Sets the pattern for the regular expression to match the input.
   * This is a helper method to use when the input is constructed imperatively
   * so that the pattern can actually be set from the construction code.
   * @param {string} pattern
   */
  setPatternInternal: function(pattern) {
    this.pattern = new RegExp(pattern);
  },


  /**
   * Updates the required flag.
   * @param {boolean} required
   */
  setRequired: function(required) {
    this.required = required;
    this.updateStateFromValue();
  },

  /**
   * Updates the validation pattern.
   * @param {RegExp} pattern The new pattern to use.
   */
  setPattern: function(pattern) {
    this.pattern = pattern;
    this.updateStateFromValue();
  },


  /**
   * Getter for the DOM input element.
   * @return {HTMLInputELement}
   */
  getInputElement: function() {
    return this.getRenderer().getInputElement();
  },


  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    var cursor = this.getCursor();
    if (cursor) {
      this.getHandler().listen(cursor.getElement(),
          goog.events.EventType.TRANSITIONEND, this.onTransitionEnd);
    }
    this.updateStateFromValue();
  },


  /** @inheritDoc */
  handleFocus: function(e) {
    goog.base(this, 'handleFocus', e);
    if (goog.userAgent.ANDROID) {
      this.delay_.start();
    }
  },


  /** @inheritDoc */
  handleBlur: function(e) {
    goog.base(this, 'handleBlur', e);
    if (goog.userAgent.ANDROID) {
      this.delay_.stop();
    }
  },


  /**
   * @protected
   */
  onTransitionEnd: function() {
    this.getCursor().setTransitioning(false);
  },


  /**
   * We need to override this as we need the element to support transitioning
   * state.
   * @override
   */
  addChild: function(child, opt_render) {
    goog.base(this, 'addChild', child, opt_render);
    child.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);
  },


  /**
   * Enables/disables the monitoring of the input.
   * This is workaround for Android auto complete.
   * @param {boolean} enable
   */
  enableInputMonitoring: function(enable) {
    if (enable) {
      this.delay_.start();
    } else {
      this.delay_.stop();
    }
  },


  /**
   * Getter for the cursor element.
   * @return {pstj.material.Element}
   */
  getCursor: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(0),
        pstj.material.Element);
  },


  /**
   * This is called when the component is visible and enabled. The key handler
   * is attached to the element only when there is a keyEventTarget in
   * the enterDocument stage.
   *
   * NOTE: keypressed in the input is not reliable on Android while the
   * virtual keyboard is working.
   * @override
   */
  handleKeyEventInternal: function(e) {
    var result = goog.base(this, 'handleKeyEventInternal', e);
    if (!result) {
      if (!this.getRaf().isActive()) {
        this.getRaf().start();
      }
    }
    return result;
  },


  /**
   * We want to check the input after the raf so we can get the real value.
   * @override
   */
  onRaf: function(ts) {
    this.populateValue();
  },


  /**
   * Protected method to populate the value from the DOM element to the
   * component system. The method is extracted as older versions of
   * android have a bug in the virtual keyboard that prevents the key events
   * from hitting the target and thus we remain unaware of the user keys.
   * @protected
   */
  populateValue: function() {
    var value = this.getValueInternal();
    if (this.value != value) {
      this.value = value;
      this.updateStateFromValue();
      this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
    }
  },


  /**
   * Helper method that self calls again after 200 ms to perform the
   * same operation over again. Should be stopped by the blur listener.
   * @private
   */
  populateValueAndroid_: function() {
    this.populateValue();
    this.delay_.start();
  },


  /**
   * Getter method for the value, even thou it is public, for the sake of the
   * API consistency we provide this as well.
   * @return {!string}
   */
  getValue: function() {
    return this.value;
  },


  /**
   * Gets the value from the DOM node.
   * @protected
   * @return {!string}
   */
  getValueInternal: function() {
    return this.getRenderer().getValue(this);
  },


  /**
   * Sets the value to the desired one.
   * @param {!string} value
   */
  setValue: function(value) {
    this.value = value;
    this.setValueInternal();
    this.updateStateFromValue();
  },

  /**
   * Applies the component value to the DOM structure.
   * @protected
   */
  setValueInternal: function() {
    this.getRenderer().setValue(this);
  },


  /**
   * Attempts to determine validity of the current value and updates the state
   * of the component accordingly.
   * @protected
   */
  updateStateFromValue: function() {
    var valid = true;
    var value = this.value;
    var isEmpty = goog.string.isEmptyOrWhitespace(value);

    if (isEmpty && this.required) valid = false;
    else if (!isEmpty) {
      if (!goog.isNull(this.pattern)) {
        if (!this.pattern.test(value)) {
          valid = false;
        }
      } else {
        if (this.type == 'number') {
          valid = goog.string.isNumeric(value);
        } else if (this.type == 'email') {
          valid = goog.format.EmailAddress.isValidAddrSpec(value);
        } else if (this.type == 'tel') {
          valid = pstj.material.InputElement.Pattern.Tel.test(value);
        }
      }
    }
    this.setValid(valid);
    this.setEmpty(isEmpty);
  },

  statics: {
    /**
     * Provides some default patterns.
     * @type {!Object<string, RegExp>}
     */
    Pattern: {
      Tel: /^\+?\d{3,12}$/
    }
  }
});


/** Igmplementation */
pstj.material.InputElementRenderer = goog.defineClass(ER, {
  /**
   * @constructor
   * @extends {pstj.material.ElementRenderer}
   * @struct
   */
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },


  /**
   * Overriden to return the container for the touch abstraction (
   * PRESS/RELEASE action).
   * @override
   */
  getContentElement: function(element) {
    return goog.dom.getElementByClass(
        goog.getCssName(this.getCssClass(), 'container'), element);
  },


  /** @override */
  getCssClass: function() {
    return pstj.material.InputElementRenderer.CSS_CLASS;
  },


  /** @override */
  getTemplate: function(model) {
    return pstj.material.template.InputElement(model);
  },


  /** @override */
  generateTemplateData: function(control) {
    goog.asserts.assertInstanceof(control, pstj.material.InputElement);
    return {
      name: control.name,
      type: control.type,
      value: control.value,
      label: control.label
    };
  },


  /** @inheritDoc */
  getKeyEventTarget: function(control) {
    return this.getInputElement(control);
  },


  /**
   * Abstracts the input element look-up to the DOM construct.
   * @param {pstj.material.InputElement} control
   * @return {HTMLInputELement}
   */
  getInputElement: function(control) {
    return /** @type {HTMLInputElement} */(control.querySelector('input'));
  },


  /**
   * Getter for the value from the DOM node.
   * @param {pstj.material.InputElement} control
   * @return {!string}
   */
  getValue: function(control) {
    var input = this.getInputElement(control);
    if (goog.isNull(input)) return '';
    return input.value;
  },


  /**
   * Updates the value of the control in the DOM.
   * @param {pstj.material.InputElement} control
   * @param {!string} value
   */
  setValue: function(control) {
    var input = this.getInputElement(control);
    if (!goog.isNull(input)) {
      input.value = control.value;
    }
  },


  statics: {
    /**
     * @type {string}
     * @final
     */
    CSS_CLASS: goog.getCssName('material-input-body')
  }
});
goog.addSingletonGetter(pstj.material.InputElementRenderer);


// Register the default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.InputElement,
    pstj.material.InputElementRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.InputElementRenderer.CSS_CLASS, function() {
      return new pstj.material.InputElement(null);
    });
});  // goog.scope
