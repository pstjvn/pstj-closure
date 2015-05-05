/**
 * @fileoverview Provides mobile friendly swipe-enabled gallery-like UI
 * component.
 *
 * This is port of the original swiper from longa.com.
 */

goog.provide('pstj.widget.Swiper');

goog.require('goog.async.Delay');
goog.require('goog.async.nextTick');
goog.require('goog.log');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('pstj.agent.Pointer');
goog.require('pstj.ds.dto.SwipetileList');
goog.require('pstj.lab.style.css');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.State');
goog.require('pstj.templates');
goog.require('pstj.widget.Swipetile');

goog.scope(function() {
var css = pstj.lab.style.css;
var E = pstj.material.Element;
var ER = pstj.material.ElementRenderer;
var state = goog.ui.Component.State;


/** @extends {E} */
pstj.widget.Swiper = goog.defineClass(E, {
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
     * The index of the currently selected / visible / active element.
     * @type {number}
     * @protected
     */
    this.selectedIndex = 0;
    /**
     * The width of the client viewport - we use this to calculate the
     * X transformation when swiping.
     * @type {number}
     * @private
     */
    this.clientWidth_ = 0;
    /**
     * Delayed job for moving on to the next item in the view. Default is
     * to change every 5 seconds.
     *
     * @type {!goog.async.Delay}
     * @private
     */
    this.goToNextDelayed_ = new goog.async.Delay(this.goToNext, 5000, this);
    /**
     * @private
     * @type {goog.log.Logger}
     */
    this.logger_ = goog.log.getLogger('pstj.widget.Swiper');

    // Configure needed options
    this.setSupportedState(state.TRANSITIONING, true);
    this.setUsePointerAgent(true);

    // Housekeeping.
    this.registerDisposable(this.goToNextDelayed_);
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.resetView_();
    this.goToNextDelayed_.start();
    goog.async.nextTick(function() {
      this.setTransitioning(true);
    }, this);
  },

  /** @override */
  disposeInternal: function() {
    goog.base(this, 'disposeInternal');
    this.logger_ = null;
  },

  /** @override */
  onPress: function(e) {
    this.setTransitioning(false);
    this.goToNextDelayed_.stop();
    // Measure the current width as we only need it now!
    this.clientWidth_ = goog.style.getBounds(this.getElementStrict()).width;
  },

  /** @override */
  onMove: function(e) {
    var distance = e.getDistance(pstj.agent.Pointer.Direction.X) * -1;
    this.forEachChild(function(child, index) {
      var pdiff = index - this.selectedIndex; // 1 0 -1
      // we are not indeterested in items that are out of the view anyway
      if (pdiff < -1 || pdiff > 1) return;

      var xtransform = 0;
      if (pdiff == -1) {
        xtransform = this.clientWidth_ * -1 + distance;
      } else if (pdiff == 0) {
        xtransform = distance;
      } else if (pdiff == 1) {
        xtransform = this.clientWidth_ + distance;
      }

      css.setTranslation(child.getElementStrict(), xtransform, 0);
    }, this);
  },

  /** @override */
  onRelease: function(e) {
    this.setTransitioning(true);
    // Here we need to decide if the user performed a flip and
    // we need to increade/descrease the selected index.

    // Give time so the browser can apply the style and only then the
    // new transform so the application would be animated.
    goog.async.nextTick(this.resetView_, this);
  },

  /** @override */
  onSwipe: function(e) {
    if (e.getSwipe().isLeft()) {
      if (this.selectedIndex < this.getChildCount() - 1) {
        this.setSelectedIndex(this.selectedIndex + 1);
      }
    } else if (e.getSwipe().isRight()) {
      if (this.selectedIndex > 0) {
        this.setSelectedIndex(this.selectedIndex - 1);
      }
    }
  },

  /**
   * Resets the transformations on all elements to a position where
   * only one element is visible and that would be the selected index element.
   *
   * @private
   */
  settleDown_: function() {
    this.forEachChild(function(child, index) {
      css.setTranslation(child.getElementStrict(),
          (index == this.selectedIndex ? 0 : (this.selectedIndex > index ?
              -100 : 100)), 0, '%');
    }, this);
  },

  /**
   * Allows the developer to programatically select the index to navigate to.
   *
   * If the selected index is out of range nothing will be done. In debug
   * mode an error will be displayed using the Logger interface.
   *
   * TODO: finish this functionality
   *
   * @param {number} index The index to make active in the view.
   */
  selectIndex: function(index) {
    if (index < 0 || index >= this.getChildCount()) {
      goog.log.error(this.logger_,
          'Attempting to set selection index out of range');
    } else {

    }
  },

  /**
   * Setter for the selected index
   * @param {number} idx The index to set as selected
   * @protected
   */
  setSelectedIndex: function(idx) {
    this.selectedIndex = idx;
    this.dispatchEvent(goog.ui.Component.EventType.SELECT);
  },

  /**
   * Public accessor for the selected index.
   * @return {number}
   */
  getSelectedIndex: function() {
    return this.selectedIndex;
  },

  /**
   * Selected the next index in children so we can anmate the story.
   */
  goToNext: function() {
    if (this.selectedIndex + 1 < this.getChildCount()) {
      this.setSelectedIndex(this.selectedIndex + 1);
    } else {
      this.setSelectedIndex(0);
    }
    this.resetView_();
    this.goToNextDelayed_.start();
  },

  /**
   * Resets the view by applying the transformation so that the
   * currently selected index will be only visible.
   * @private
   */
  resetView_: function() {
    this.settleDown_();
  }
});


/** @extends {ER} */
pstj.widget.SwiperRenderer = goog.defineClass(ER, {
  constructor: function() {
    ER.call(this);
  },

  /** @override */
  getCssClass: function() {
    return pstj.widget.SwiperRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return pstj.templates.Swiper(model);
  },

  /** @override */
  generateTemplateData: function(instance) {
    var model = instance.getModel();
    if (!goog.isNull(model)) {
      goog.asserts.assertInstanceof(model, pstj.ds.dto.SwipetileList);
      return {
        items: model.tiles
      };
    } else {
      return {
        items: []
      };
    }
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('pstj-swiper')
  }
});
goog.addSingletonGetter(pstj.widget.SwiperRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.widget.Swiper,
    pstj.widget.SwiperRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.widget.SwiperRenderer.CSS_CLASS, function() {
      return new pstj.widget.Swiper(null);
    });

});  // goog.scope
