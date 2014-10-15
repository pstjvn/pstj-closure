goog.provide('pstj.material.InputBody');
goog.provide('pstj.material.InputBodyRenderer');

goog.require('goog.asserts');
goog.require('pstj.ds.ListItem');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.template');


/**
 * Implementation of the actual input body.
 */
// keypress, change, focus, blur
pstj.material.InputBody = goog.defineClass(pstj.material.Element, {
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
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.material.Element.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * @type {Element}
     */
    this.input = null;
    /** @type {string} */
    this.name;
    /** @type {string} */
    this.type;
    /** @type {string} */
    this.label;
    // enable press and release
    // those should be delegated to the main Input element.
    this.setAutoEventsInternal(pstj.material.EventMap.EventFlag.PRESS |
        pstj.material.EventMap.EventFlag.RELEASE);
  },


  /** @override */
  disposeInternal: function() {
    goog.base(this, 'disposeInternal');
    this.input = null;
  },


  /** @override */
  decorateInternal: function(el) {
    goog.base(this, 'decorateInternal', el);
    this.input = this.querySelector('input');
  },


  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this.input, [
      goog.events.EventType.FOCUS,
      goog.events.EventType.BLUR,
      goog.events.EventType.CHANGE,
      goog.events.EventType.KEYDOWN
    ], this.handleInputEvents);
  },


  /**
   * We share the model with the paren node because it is actually one and
   * same element, only partitioned for better control.
   * @override
   * @return {pstj.ds.ListItem}
   */
  getModel: function() {
    return goog.asserts.assertInstanceof(
        this.getParent().getModel(), pstj.ds.ListItem);
  },


  /**
   * We are directly retrieving the value from the model. Syncing back to
   * model is done elsewhere in the component.
   * @return {string}
   */
  getValue: function() {
    return goog.asserts.assertString(this.getModel().getProp(this.getName()));
  },


  /**
   * Handles all events from the native input element.
   * @type {goog.events.Event}
   * @protected
   */
  handleInputEvents: function(e) {
    if (e.type == goog.events.EventType.FOCUS) {
      this.setFocused(true);
    } else if (e.type == goog.events.EventType.BLUR) {
      this.setFocused(false);
    } else if (e.type == goog.events.EventType.CHANGE) {
      this.checkValue();
    } else if (e.type == goog.events.EventType.KEYDOWN) {
      console.log(e);
      debugger;
    }
  }
});


/** Implementation */
pstj.material.InputBodyRenderer = goog.defineClass(
    pstj.material.ElementRenderer, {
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
        return this.querySelector(element, goog.getCssName(this.getCssClass(),
            'container'));
      },


      /** @override */
      getTemplate: function(model) {
        return pstj.material.template.InputBody(model);
      },


      /** @override */
      generateTemplateData: function(control) {
        goog.asserts.assertInstanceof(control, pstj.material.InputBody);
        return {
          name: control.name,
          type: control.type,
          value: control.getValue(),
          label: control.label
        };
      }
    });
goog.addSingletonGetter(pstj.material.InputBodyRenderer);


/**
 * @type {string}
 * @final
 */
pstj.material.InputBodyRenderer.CSS_CLASS = goog.getCssName('input-body');


// Register the default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.InputBody,
    pstj.material.InputBodyRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.InputBodyRenderer.CSS_CLASS, function() {
      return new pstj.material.InputBody(null);
    });
