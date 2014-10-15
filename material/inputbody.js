goog.provide('pstj.material.InputBody');
goog.provide('pstj.material.InputBodyRenderer');

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
    /** @type {Element} */
    this.input = null;
    /** @type {string} */
    this.name;
    /** @type {string} */
    this.type;
    /** @type {string} */
    this.label;
    /**
     * @type {goog.async.Delay}
     * @private
     */
    this.delay_ = new goog.async.Delay(this.checkValue, 200, this);
    this.registerDisposable(this.delay_);
    /**
     * @type {string}
     * @private
     */
    this.cacheValue_ = '';
    // Allow the focus auto events to process.
    this.setSupportedState(goog.ui.Component.State.FOCUSED, true);
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
    var cursor = this.getCursor();
    if (cursor) {
      this.getHandler().listen(cursor.getElement(),
          goog.events.EventType.TRANSITIONEND, this.onTransitionEnd);
    }
  },

  /**
   * @protected
   */
  onTransitionEnd: function() {
    this.getCursor().setTransitioning(false);
  },


  /** @override */
  addChild: function(child, opt_render) {
    goog.base(this, 'addChild', child, opt_render);
    child.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);
  },


  /**
   * Enables/disables the monitoring of the input.
   * This is workaround for Android auto comple.
   * @param {boolean} enable
   */
  enableInputMonitoring: function(enable) {
    if (enable) {
      this.delay_.start();
    } else {
      this.delay_.stop();
    }
  },


  checkValue: function(ts) {
    var value = this.input.value;
    if (value != this.cacheValue_) {
      this.cacheValue_ = value;
      if (this.getModel()) {
        this.getModel().mutate(this.name, value);
      } else {
        this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
      }
    }
    this.delay_.start();
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
   * We share the model with the paren node because it is actually one and
   * same element, only partitioned for better control.
   * @override
   * @return {pstj.ds.ListItem}
   */
  getModel: function() {
    var model = this.getParent().getModel();
    if (model) {
      return goog.asserts.assertInstanceof(
          this.getParent().getModel(), pstj.ds.ListItem);
    } else {
      return null;
    }
  },


  /**
   * We want to check the input after the raf so we can get the real value.
   * @override
   */
  onRaf: function(ts) {
    this.updateModel();
  },


  /**
   * We are directly retrieving the value from the model. Syncing back to
   * model is done elsewhere in the component.
   * @return {string}
   */
  getValue: function() {
    var model = this.getModel();
    if (model) {
      return goog.asserts.assertString(model.getProp(this.name));
    } else if (this.input) {
      return this.input.value;
    } else {
      return '';
    }
  },


  /**
   * Sets the value to the desired one.
   * @param {string} value
   */
  setValue: function(value) {
    this.cacheValue_ = value;
    if (this.getModel()) {
      this.getModel().mutate(this.name, value);
    }
    if (this.input) {
      this.input.value = value;
    }
  },


  updateModel: function() {
    var model = this.getModel();
    var val = this.input.value;
    if (model) {
      if (model.getProp(this.name) != val) {
        model.mutate(this.name, val);
      }
    } else {
      // we do not have a model to sync to, so basically we need to check
      // the value against the rules but skipping the model sync.
      // we will simulate the CHANGE for this.
      this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
    }
  },


  /**
   * We override this as we already have reference to the native input
   * element and there is no point to delegate it to the renderer.
   * The key target will be used to handle key events and set tabindex.
   * @override
   */
  getKeyEventTarget: function() {
    return this.input;
  }
});


/** Igmplementation */
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
        return goog.dom.getElementByClass(
            goog.getCssName(this.getCssClass(), 'container'), element);
      },


      /** @override */
      getCssClass: function() {
        return pstj.material.InputBodyRenderer.CSS_CLASS;
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
pstj.material.InputBodyRenderer.CSS_CLASS = goog.getCssName(
    'material-input-body');


// Register the default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.InputBody,
    pstj.material.InputBodyRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.InputBodyRenderer.CSS_CLASS, function() {
      return new pstj.material.InputBody(null);
    });
