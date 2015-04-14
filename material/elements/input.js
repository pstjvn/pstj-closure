/**
 * @fileoverview Provides the material design input implementation for web.
 *
 * This version gets rid of the cursor animation and simplified the code.
 */

goog.provide('pstj.material.Input');
goog.provide('pstj.material.InputRenderer');

goog.require('goog.format.EmailAddress');
goog.require('goog.string');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.lab.style.css');
goog.require('pstj.material.IconContainer');
goog.require('pstj.material.InputBase');
goog.require('pstj.material.InputBaseRenderer');
goog.require('pstj.material.State');

goog.scope(function() {
var IB = pstj.material.InputBase;
var IBR = pstj.material.InputBaseRenderer;
var state = goog.ui.Component.State;


/** @extends {IB} */
pstj.material.Input = goog.defineClass(IB, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    IB.call(this, opt_content, opt_renderer, opt_domHelper);

    /**
     * We need to efectively store references to our internal elements
     * and access them quichly.
     * @type {Object<string, Element>}
     * @private
     */
    this.elementCache_ = {};
    /**
     * Cached transformation string.
     *
     * The calculation for the transformation is expensive and because inputs
     * rarely change it is safe to use a cached variant. The cache is calculated
     * the first time it is used.
     * @type {string}
     * @private
     */
    this.transformationCache_ = '';

    // Enable additional states used by the material design.
    this.setSupportedState(state.INVISIBLE, true);
    this.setSupportedState(state.TRANSITIONING, true);
  },


  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    var baseclass = this.getRenderer().getCssClass();
    var root = this.getElement();

    goog.object.set(this.elementCache_, pstj.material.Input.Name.UNDERLINE,
        goog.dom.getElementByClass(
            goog.getCssName(baseclass, 'underline'), root));

    goog.object.set(this.elementCache_,
        pstj.material.Input.Name.FOCUSED_UNDERLINE,
        goog.dom.getElementByClass(
            goog.getCssName(baseclass, 'focused-underline'), root));

    goog.object.set(this.elementCache_,
        pstj.material.Input.Name.BODY_LABEL_TEXT,
        goog.dom.getElementByClass(
            goog.getCssName(baseclass, 'body-label-text'), root));

    goog.object.set(this.elementCache_,
        pstj.material.Input.Name.FLOATED_LABEL,
        goog.dom.getElementByClass(
            goog.getCssName(baseclass, 'floated-label'), root));

    goog.object.set(this.elementCache_,
        pstj.material.Input.Name.FLOATED_LABEL_TEXT,
        goog.dom.getElementByClass(
            goog.getCssName(baseclass, 'floated-label-text'), root));
  },

  /**
   * Calculates the cached transforms to apply to the
   * label.
   * @return {string}
   */
  getCachedTrasnform: function() {
    if (!this.transformationCache_) {

      var toRect = goog.style.getBounds(
          this.getNamedElement(pstj.material.Input.Name.FLOATED_LABEL_TEXT));

      var fromRect = goog.style.getBounds(
          this.getNamedElement(pstj.material.Input.Name.BODY_LABEL_TEXT));

      var sy = toRect.height / fromRect.height;
      this.transformationCache_ =
          'scale3d(' + (toRect.width / fromRect.width) + ',' + sy + ',1) ' +
          'translate3d(0,' + (toRect.top - fromRect.top) / sy + 'px,0)';
    }
    return this.transformationCache_;
  },

  /**
   * Accessor for the named element.
   * @param {pstj.material.Input.Name} name
   * @return {Element}
   */
  getNamedElement: function(name) {
    return goog.object.get(this.elementCache_, name);
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    // Check if the current value is empty and update state.
    if (this.value.length == 0) {
      this.setEmpty(true);
    }
  },

  /** @override */
  setState: function(state, enable, opt_calledFrom) {
    var c = false;
    if (this.isInDocument() && state == goog.ui.Component.State.EMPTY &&
        this.isEmpty() != enable) {
      c = true;
    }
    goog.base(this, 'setState', state, enable, opt_calledFrom);
    if (c) {
      this.getRenderer().enableFloatinglabel(this, !enable);
      this.getHandler().listenOnce(this.getNamedElement(
          pstj.material.Input.Name.BODY_LABEL_TEXT),
          goog.events.EventType.TRANSITIONEND,
          this.handleTransitionEnd);
    }
  },

  /**
   * Handles the end of label transition.
   * We expose this method so it can be listened to from the renderer.
   * @param {goog.events.Event} e The wrapped browser event.
   */
  handleTransitionEnd: function(e) {
    e.stopPropagation();
    this.getRenderer().handleTransitionEnd(this);
  },

  /** @override */
  onPress: function(e) {
    goog.base(this, 'onPress', e);
    this.getRenderer().setUnderlineTransformationOrigin(this, e.getPoint().x);
  },

  /**
   * @override
   * @return {pstj.material.InputRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        pstj.material.InputRenderer);
  },

  statics: {
    /**
     * Enumeration for the element names we will use in the cache.
     * @enum {string}
     * @final
     */
    Name: {
      UNDERLINE: 'underline',
      FOCUSED_UNDERLINE: 'focusedUnderline',
      BODY_LABEL_TEXT: 'bodyLabelText',
      FLOATED_LABEL: 'floatedLabel',
      FLOATED_LABEL_TEXT: 'floatedLabelText'
    }
  }
});


/** @extends {IBR} */
pstj.material.InputRenderer = goog.defineClass(IBR, {
  constructor: function() {
    IBR.call(this);
  },

  /** @override */
  getCssClass: function() {
    return pstj.material.InputRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return pstj.material.template.Input(model);
  },

  /**
   * Switches between the regular and floated labels.
   * @param {pstj.material.Input} instance The input instance.
   * @param {boolean} enable If true the floating label is enabled.
   */
  enableFloatinglabel: function(instance, enable) {
    goog.asserts.assertInstanceof(instance, pstj.material.Input);

    instance.setTransitioning(true);
    var el = instance.getNamedElement(pstj.material.Input.Name.BODY_LABEL_TEXT);
    goog.style.setStyle(el, 'visibility', 'visible');
    if (enable) {
      pstj.lab.style.css.setTranslationText(el, instance.getCachedTrasnform());
    } else {
      goog.style.setStyle(instance.getNamedElement(
          pstj.material.Input.Name.FLOATED_LABEL), 'visibility', 'hidden');
      pstj.lab.style.css.setTranslationText(el, '');
    }
  },

  /**
   * Handle the end of transition for floating label.
   * @param {pstj.material.Input} input The input instance that finished
   * transition.
   */
  handleTransitionEnd: function(input) {
    input.setTransitioning(false);
    var empty = input.isEmpty();
    goog.style.setStyle(input.getNamedElement(
        pstj.material.Input.Name.BODY_LABEL_TEXT), 'visibility',
        (!empty ? 'hidden' : 'visible'));

    goog.style.setStyle(input.getNamedElement(
        pstj.material.Input.Name.FLOATED_LABEL), 'visibility',
        (!empty ? 'visible' : 'hidden'));
  },

  /**
   * Updates the transformation origin on the element to simulate reaction
   * to user click/press.
   * @param {pstj.material.Input} input The instance of the input element.
   * @param {number} x The X ordinate of the raw input event.
   */
  setUnderlineTransformationOrigin: function(input, x) {
    goog.style.setStyle(input.getNamedElement(
        pstj.material.Input.Name.FOCUSED_UNDERLINE),
        'transformOriginX', (x - goog.style.getBounds(
            input.getNamedElement(pstj.material.Input.Name.UNDERLINE)).left) +
            'px');
  },

  statics: {
    /**
    * @type {string}
    * @const
    */
    CSS_CLASS: goog.getCssName('material-input')
  }
});
goog.addSingletonGetter(pstj.material.InputRenderer);

// Register the default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.Input,
    pstj.material.InputRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.InputRenderer.CSS_CLASS, function() {
      return new pstj.material.Input(null);
    });

});  // goog.scope
