goog.provide('pstj.material.HeaderPanel');

goog.require('goog.ui.Component.State');
goog.require('pstj.material.Element');
goog.require('pstj.material.EventMap');
goog.require('pstj.material.HeaderPanelRenderer');
goog.require('pstj.material.State');


goog.scope(function() {
var Base = pstj.material.Element;
var State = goog.ui.Component.State;
var EventMap = pstj.material.EventMap;


/**
 * Implementation for the header panel material element
 */
pstj.material.HeaderPanel = goog.defineClass(Base, {
  /**
   * The header panel implementation for material element.
   * @constructor
   * @struct
   * @extends {Base}
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    Base.call(this, opt_content, opt_renderer, opt_domHelper);
    // Enable tall and shadow mode so we can set them is needed
    this.setSupportedState(State.TALL, true);
    this.setSupportedState(State.SHADOW, true);
    this.setSupportedState(State.TRANSITIONING, true);
    // Enable SCROLL as auto event so we can always listen for scrolls.
    this.setAutoEventsInternal(EventMap.EventFlag.SCROLL);
  },


  /**
   * Easier header element retrieval.
   * @return {Base}
   */
  getHeader: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(0), Base);
  },


  /**
   * Getter for the main element of the header panel.
   * @return {Base}
   */
  getMain: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(1), Base);
  },


  /**
   * Adds a new component to the header of the header panel.
   * @param {goog.ui.Component} child
   * @param {boolean=} opt_render
   */
  addToHeader: function(child, opt_render) {
    this.getHeader().addChild(child, opt_render);
  },


  /**
   * Adds a new component to the main section of the header panel.
   * @param {goog.ui.Component} child
   * @param {boolean=} opt_render
   */
  addToMain: function(child, opt_render) {
    this.getMain().addChild(child, opt_render);
  },


  /** @override */
  getScrollElement: function() {
    if (this.isOuterScroll()) {
      return this.querySelector('.' + goog.getCssName(
          this.getRenderer().getCssClass(), 'outer-container'));
    } else {
      return this.querySelector('.' + goog.getCssName(
          this.getRenderer().getCssClass(), 'main-container'));
    }
  },


  /** @override */
  onScroll: function() {
    var atTop = this.getScrollElement().scrollTop == 0;
    this.setState(State.SHADOW,
        (this.hasState(State.STANDARD) ||
        (this.isShadow() && !atTop)));
    this.setState(State.TALL, (this.isTall() && atTop));
  },


  setState: function(state, enable) {
    if (state == State.TALL) {
      var oldTall = this.hasState(State.TALL);
    }
    goog.base(this, 'setState', state, enable);
    if (state == State.TALL) {
      if (oldTall && !this.isTall()) {
        this.getHandler().listenOnce(this.getHeader().getElement(),
            goog.events.EventType.TRANSITIONEND, function() {
              this.setState(State.TRANSITIONING, false);
            });
      } else {
        this.setState(State.TRANSITIONING, true);
      }
    }
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.onScroll();
  },


  isShadow: function() {
    return !!(this.getState() & pstj.material.HeaderPanel.SHADOW_MODE);
  },


  isTall: function() {
    return !!(this.getState() & pstj.material.HeaderPanel.TALL_MODE);
  },


  isOuterScroll: function() {
    return !!(this.getState() & pstj.material.HeaderPanel.OUTERSCROLL_MODE);
  },


  statics: {


    /**
     * Combination of modes in each of them we need the shadow.
     * @type {number}
     * @final
     */
    SHADOW_MODE: (State.WATERFALL | State.WATERFALL_TALL | State.STANDARD),


    /**
     * Combination of modes in wach of those we need to have tall mode.
     * @type {number}
     * @final
     */
    TALL_MODE: (State.WATERFALL_TALL),


    /**
     * Combination of modes in each of whose we need to use the outer scroll
     * container.
     * @type {number}
     * @final
     */
    OUTERSCROLL_MODE: (State.SCROLL)
  }

});

goog.ui.registry.setDefaultRenderer(pstj.material.HeaderPanel,
    pstj.material.HeaderPanelRenderer);


goog.ui.registry.setDecoratorByClassName(
    pstj.material.HeaderPanelRenderer.CSS_CLASS, function() {
      return new pstj.material.HeaderPanel(null);
    });
});  // goog.scope

