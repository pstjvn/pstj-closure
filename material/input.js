/**
 * @fileoverview Implementation for the material design input of type text
 * or password. Note that the implementation is inspured and influences by the
 * paper implementation of the design pattern.
 *
 * The implementation is complex and deserves some explanation.
 *
 * First and foremost we have the input body: the input body is constructed
 * in such a way as to delegate the model getters / setters to the
 * parent element so it basically uses directly the instance that created it.
 * In the case that there is no model set up on the Input instance the
 * error checking is still triggered because in that case the CHANGE UI event
 * is fired from the InputBody instance (by handling the keyboard and only if
 * the key is not ENTER i.e. submit) and the listener on the Input instance
 * calls the checking. Otherwise (if there is a model) the CHANGE event on the
 * model is triggering the check.
 * When the ENTER key is pressed the ACTION event is fired and propagated to
 * the Input instance. You can handle it there or let the controller handle it.
 *
 * The Input instance also have some UI elements that are again controlled by
 * the element state.
 *
 * TODO: Check if it is possible to NOT use transitioning state which means
 * that the label will always have the transition for transform.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.Input');
goog.provide('pstj.material.InputRenderer');

goog.require('goog.format.EmailAddress');
goog.require('goog.string');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('goog.userAgent');
goog.require('pstj.agent.Pointer.EventType');
goog.require('pstj.ds.ListItem');
goog.require('pstj.ds.ListItem.EventType');
goog.require('pstj.lab.style.css');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.FloatingLabel');
goog.require('pstj.material.InputBody');
goog.require('pstj.material.InputError');
goog.require('pstj.material.InputUnderline');
goog.require('pstj.material.State');
goog.require('pstj.material.template');



/**
 * Provides implementation for the material design inspred input.
 * @constructor
 * @extends {pstj.material.Element}
 * @struct
 * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
 *     to display as the content of the control (if any).
 * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
 *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 */
pstj.material.Input = function(opt_content, opt_renderer, opt_domHelper) {
  pstj.material.Element.call(this, opt_content, opt_renderer, opt_domHelper);
  /**
   * Reference to the floating label if used.
   * @type {pstj.material.FloatingLabel}
   * @private
   */
  this.floatingLabel_ = null;
  /**
   * Reference to the material underline if used.
   * @type {pstj.material.InputUnderline}
   * @private
   */
  this.underline_ = null;
  /**
   * The error part of the input.
   * @type {pstj.material.InputError}
   * @private
   */
  this.error_ = null;
  /**
   * The actual input body.
   * @type {pstj.material.InputBody}
   * @private
   */
  this.inputBody_ = null;
  /**
   * @type {string}
   */
  this.name = '';
  /**
   * @type {string}
   */
  this.type = '';
  /**
   * @type {string}
   */
  this.label = '';
  /** @type {boolean} */
  this.required = false;
  /**
   * @type {string}
   * @private
   */
  this.tmpValue_ = '';
  /**
   * The RegExp pattern used for validation. It is a normal JS re.
   * @type {RegExp}
   * @private
   */
  this.pattern_ = null;
  /**
   * The error message we will use in case of invalid input.
   * @type {string}
   * @private
   */
  this.errorText_ = '';
  /**
   * Cache for the label transformation to apply.
   * @type {string}
   * @private
   */
  this.labelCachedTranform_ = '';
  /**
   * Reference to the label element that we want to transform.
   * @type {Element}
   * @private
   */
  this.labelTextElement_ = null;
  // ENable the states we need in this component.
  // NOte that by default actionInternal will be called if the
  // enter key is pressed (as focused elements with keyboard handlers do that).
  // The main form element can listen to the ACTION event to trigger submit.
  this.setSupportedState(goog.ui.Component.State.DISABLED, true);
  this.setSupportedState(goog.ui.Component.State.INVALID, true);
  this.setSupportedState(goog.ui.Component.State.INVISIBLE, true);
  this.setSupportedState(goog.ui.Component.State.EMPTY, true);
  this.setSupportedState(goog.ui.Component.State.FOCUSED, true);
  this.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);
};
goog.inherits(pstj.material.Input, pstj.material.Element);


/**
 * Here we want to add all the blows and wistles to the base element,
 * which means the floating label, the body, the underline and the error
 * part.
 * @override
 */
pstj.material.Input.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  this.getProperties();
  // Generate the children element and add them to the main component.
  this.floatingLabel_ = new pstj.material.FloatingLabel(this.label);
  this.inputBody_ = new pstj.material.InputBody();
  if (this.tmpValue_ != '') {
    this.inputBody_.setValue(this.tmpValue_);
  }
  this.tmpValue_ = '';
  // set up the parameters for the input in case someone wants to use the
  // native input directly. Those will be reflected on the DOM of the inputbody
  // by the input body template.
  this.inputBody_.name = this.name;
  // Do not allow auto type check on the native input...?
  // TODO: fix this?
  // this.inputBody_.type = (this.type == 'password') ? this.type : 'text';
  this.inputBody_.type = this.type;
  this.inputBody_.label = this.label;
  this.underline_ = new pstj.material.InputUnderline(null);
  this.error_ = new pstj.material.InputError(this.errorText_);

  this.addChild(this.floatingLabel_, true);
  this.addChild(this.inputBody_, true);
  this.addChild(this.underline_, true);
  this.addChild(this.error_, true);
};


/**
 * Real all relevant properties from the dom node we are decorating if they have
 * not been configured yet. Use some sane defaults in case those were neither
 * imperatively or declaratively provided.
 * @protected
 */
pstj.material.Input.prototype.getProperties = function() {
  var el = this.getElement();
  if (!this.name) this.name = el.getAttribute('name') || '';
  if (!this.type) this.type = el.getAttribute('type') || 'text';
  if (!this.errorText_) this.errorText_ = el.getAttribute(
      'error') || 'Invalid input';
  if (!this.label) this.label = el.getAttribute('label') || '';
  // Set up check patterns, we use either the user provided pattern of the
  // default patterns for tel, email and number. User supplied pattern has
  // precedance.
  if (goog.isNull(this.pattern_)) {
    var pattern = el.getAttribute('pattern');
    if (!goog.isNull(pattern)) {
      this.setPattern(pattern);
    } else if (this.type == 'tel') {
      this.pattern_ = /^\+?\d{3,12}$/;
    }
  }
};


/** @override */
pstj.material.Input.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  // listen to the events from the inputbody
  this.getHandler().listen(this, [
    goog.ui.Component.EventType.FOCUS,
    goog.ui.Component.EventType.BLUR], this.handleFocus);
  // This is dispatched by the input body to simulate changes only when there is
  // no model set and does not reflect the input's native CHANGE event!
  this.getHandler().listen(this, goog.ui.Component.EventType.CHANGE,
      this.onChange).listen(this, pstj.agent.Pointer.EventType.PRESS,
      this.onPress);
  // sets the floating label visibility to match the input state.
  this.floatingLabel_.setVisible(this.getValue().length != 0);

  // we need to calculate this here as the children are not rendered before that
  this.labelTextElement_ = this.querySelector('.' +
      goog.getCssName(this.getRenderer().getCssClass(), 'body-label-text'));
  // finally we perform a check of the validity as we are actually
  // not sure at this point if it matches the value.
  this.checkValidity();
};


/**
 * We should insist that the model be ListItem instance!
 * If the model updates and it is not null we want to listen for the update
 * event and perform our check on each update.
 * @override
 */
pstj.material.Input.prototype.setModel = function(model) {
  if (this.getModel()) {
    this.getHandler().unlisten(this.getModel(),
        pstj.ds.ListItem.EventType.UPDATE, this.onModelUpdate);
  }
  goog.base(this, 'setModel', model);
  if (this.getModel()) {
    this.getHandler().listen(this.getModel(),
        pstj.ds.ListItem.EventType.UPDATE, this.onModelUpdate);
  }
};


/**
 * We want to override how we return the model, only ListItem is allowed.
 * @override
 * @return {pstj.ds.ListItem}
 */
pstj.material.Input.prototype.getModel = function() {
  var model = goog.base(this, 'getModel');
  if (model) {
    return goog.asserts.assertInstanceof(model, pstj.ds.ListItem);
  } else {
    return null;
  }
};


/**
 * Returns the transform we want to apply. This is calculated as a difference
 * between the bounding rectangles of the floating label and the input body
 * label and is cashed for reuse. In the original code this is done each time
 * but we assume more stable environment as we tend to not change the labels
 * in the lifetime of the input. If you feel you need to recalculate this
 * simpkly override the method.
 * @protected
 * @return {string}
 */
pstj.material.Input.prototype.getLabelCachedTransform = function() {
  if (!this.labelCachedTranform_) {
    // this code should probbaly go in style.css
    var toRect = goog.style.getBounds(goog.dom.getElementByClass(
        goog.getCssName(
            this.floatingLabel_.getRenderer().getCssClass(), 'text'),
        this.getElement()));
    var fromRect = goog.style.getBounds(goog.dom.getElementByClass(
        goog.getCssName(this.inputBody_.getRenderer().getCssClass(),
            'label-text'), this.getElement()));
    var sy = toRect.height / fromRect.height;
    this.labelCachedTranform_ =
        'scale3d(' + (toRect.width / fromRect.width) + ',' + sy + ',1) ' +
        'translate3d(0,' + (toRect.top - fromRect.top) / sy + 'px,0)';
  }
  return this.labelCachedTranform_;
};


/**
 * Sets the pattern for the regular expression to match the input.
 * This is a helper method to use when the input is constructed imperatively
 * so that the pattern can actually be set from the construction code.
 * @param {string} pattern
 */
pstj.material.Input.prototype.setPattern = function(pattern) {
  this.pattern_ = new RegExp(pattern);
};


/**
 * Handles the model update event on the input.
 * @param {goog.events.Event} e
 * @protected
 */
pstj.material.Input.prototype.onModelUpdate = function(e) {
  this.checkValidity();
};


/**
 * Handles the change event gcoming from the input body simulating model update
 * when there is no model.
 * @param {goog.events.Event} e
 * @protected
 */
pstj.material.Input.prototype.onChange = function(e) {
  this.checkValidity();
};


/**
 * Expose nice value getter/API.
 * @return {string}
 */
pstj.material.Input.prototype.getValue = function() {
  return this.inputBody_.getValue();
};


/**
 * Expose nice value API.
 * @param {string} val
 */
pstj.material.Input.prototype.setValue = function(val) {
  if (this.inputBody_) this.inputBody_.setValue(val);
  else this.tmpValue_ = val;
};


/**
 * Checks the validity of the current value. The value is returned either
 * from the model or the native input, but this method does not care as
 * abstraction for this is used in the inputBody.
 * @protected
 */
pstj.material.Input.prototype.checkValidity = function() {
  // tel is handled by the regexp.
  var value = this.getValue();
  var valid = true;
  var emptystr = goog.string.isEmptyString(goog.string.trim(value));

  if (this.required && emptystr) {
    valid = false;
  } else {
    // it is not required so it is okay to be empty
    if (!emptystr) {
      if (!goog.isNull(this.pattern_) && !this.pattern_.test(value)) {
        valid = false;
      } else {
        switch (this.type) {
          case 'number':
            valid = goog.string.isNumeric(value);
            break;
          case 'email':
            valid = goog.format.EmailAddress.isValidAddrSpec(value);
            break;
        }
      }
    }
  }
  this.setValid(valid);
  // here we also check if the value is empty one to set the empty state.
  this.setEmpty((value.length == 0));
};


/**
 * Override this as we need to check is the empty state really will be changed.
 * If it changes we need to perform some additional actions after the empty
 * state changes (as the animations depend on that state in the css).
 * @override
 */
pstj.material.Input.prototype.setState = function(state, enable) {
  var c = false;
  if (this.isInDocument() && state == goog.ui.Component.State.EMPTY &&
      this.isEmpty() != enable) {
    c = true;
  }
  goog.base(this, 'setState', state, enable);
  if (c) {
    this.transitionLabel(!enable);
  }
};


/**
 * Instructs the input to perform the label animation. This is done only when
 * the input changes from empty state.
 * @protected
 * @param {boolean} up If the animation should lift the label ot slide it down.
 */
pstj.material.Input.prototype.transitionLabel = function(up) {
  this.setTransitioning(true);
  if (up) {
    pstj.lab.style.css.setTranslationText(this.labelTextElement_,
        this.getLabelCachedTransform());
    // we need to remove the transitioing state so that the
    // label text becomes invisible. Visibility is forced while transitioning.
    // ON the other direction movement we do not need to remove it
    // because it is visible either ways.
    // NOte that this does not hold true for the cursor!
    this.getHandler().listenOnce(this.labelTextElement_,
        goog.events.EventType.TRANSITIONEND,
        this.onLabelUpEnd);
  } else {
    this.floatingLabel_.setVisible(false);
    pstj.lab.style.css.setTranslationText(this.labelTextElement_, '');
  }
};


/**
 * Handles the end of the label transition.
 * @protected
 */
pstj.material.Input.prototype.onLabelUpEnd = function() {
  this.setTransitioning(false);
  this.floatingLabel_.setVisible(true);
};


/** @override */
pstj.material.Input.prototype.setEnabled = function(enable) {
  goog.base(this, 'setEnabled', enable);
  this.underline_.setEnabled(enable);
};


/**
 * Handles the focus event coming form the inputbody element. Reflect the focus
 * state on the main node.
 * @param {goog.events.Event} e
 * @protected
 */
pstj.material.Input.prototype.handleFocus = function(e) {
  console.log('Handle focus');
  // revert the value as it is added after the event is emited
  this.setFocused(!this.inputBody_.isFocused());
  if (this.isEmpty() && this.isFocused()) {
    this.inputBody_.getCursor().setTransitioning(true);
  }
  // if we are on Android we need a workaround for its virtual keyboard
  if (goog.userAgent.ANDROID) {
    if (this.isFocused()) {
      this.inputBody_.enableInputMonitoring(true);
    } else {
      this.inputBody_.enableInputMonitoring(false);
    }
  }
};


/** @override */
pstj.material.Input.prototype.onPress = function(e) {
  this.underline_.setFocusTransformation(
      e.getPoint().x - goog.style.getBounds(
          this.underline_.getElement()).left);
  if (goog.userAgent.ANDROID) {
    console.log('fake the focus event');
    this.inputBody_.getKeyEventTarget().focus();
  }
};


/**
 * Allow for imperative setup of the error message.
 * @param {string} text The error message to display in case of invalid input.
 */
pstj.material.Input.prototype.setErrorMessage = function(text) {
  if (this.isInDocument()) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.errorText_ = text;
};


/**
 * Constructs a new input imperatively from a JSON settings object.
 * @param {MaterialInputConfig} config
 * @return {pstj.material.Input}
 */
pstj.material.Input.fromJSON = function(config) {
  var input = new pstj.material.Input();
  input.type = config.type;
  input.name = config.name;
  input.label = config.label;
  input.setPattern(config.pattern);
  input.setValue(config.value);
  input.setErrorMessage(config.errorText);
  input.required = config.required || false;
  return input;
};



/**
 * Provides the implementation for the renderer for the material input.
 * @constructor
 * @extends {pstj.material.ElementRenderer}
 * @struct
 */
pstj.material.InputRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.InputRenderer, pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.InputRenderer);


/**
 * Flag to signify if the placeholder attribute is supported in the browser.
 * @type {boolean}
 */
pstj.material.InputRenderer.PlaceholderSupported = (
    'placeholder' in document.createElement('input'));


/**
 * @type {string}
 * @final
 */
pstj.material.InputRenderer.CSS_CLASS = goog.getCssName('material-input');


/** @override */
pstj.material.InputRenderer.prototype.getCssClass = function() {
  return pstj.material.InputRenderer.CSS_CLASS;
};


/** @override */
pstj.material.InputRenderer.prototype.getTemplate = function(model) {
  return pstj.material.template.Input(model);
};


/** @override */
pstj.material.InputRenderer.prototype.decorate = function(control, element) {
  var el = goog.base(this, 'decorate', control, element);
  var type = el.getAttribute('type');
  var name = el.getAttribute('name');
  var label = el.getAttribute('label');
  if (type) control.type = type;
  if (name) control.name = name;
  if (label) control.label = label;
  return el;
};


/** @override */
pstj.material.InputRenderer.prototype.generateTemplateData = function(control) {
  return null;
};


// Register the default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.Input,
    pstj.material.InputRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.InputRenderer.CSS_CLASS, function() {
      return new pstj.material.Input(null);
    });
