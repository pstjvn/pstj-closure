/**
 * @fileoverview Provides class for scroll areas that can react to size
 * changes.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.CustomScrollArea');

goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Slider');
goog.require('pstj.style.css');
goog.require('pstj.ui.Sizeable');
goog.require('pstj.ui.Sizeable.EventType');



/**
 * @constructor
 * @extends {pstj.ui.Sizeable}
 * @param {goog.dom.DomHelper=} opt_dh Optional dom helper.
 */
pstj.ui.CustomScrollArea = function(opt_dh) {
  goog.base(this, opt_dh);
  /**
   * @type {goog.ui.Slider}
   * @private
   */
  this.scrollBar_ = new goog.ui.Slider();
  /**
   * @type {Element}
   * @private
   */
  this.scrollDiv_ = null;
  /**
   * @type {Element}
   * @private
   */
  this.scrollContainer_ = null;
  /**
   * How many milliseconds to wait before restoring the scroll event reads.
   * @type {number}
   * @private
   */
  this.restoreSuppersedScrollTimeout_ = 500;
  /**
   * Sets the transitions direction. By default the transition will be applied
   * to right. However in some situations an unwanted scroll bar appears to
   * accommodate the widget view created to fit the transitioned elements. It is
   * only created when the element is translated to a positive value (i.e. to
   * right), thus we allow the same animation / transition to the left to cover
   * those cases where CSS cannot resolve the visual glitches.
   * @type {boolean}
   * @private
   */
  this.transitionToLeft_ = false;
  /**
   * If currently the native scroll event processing should be suppressed.
   * @type {boolean}
   * @private
   */
  this.suppresNativeScrollReads_ = false;
  /**
   * If currently the slider scroll event processing should be suppressed.
   * @type {boolean}
   * @private
   */
  this.suppresSliderScrollReads_ = false;
  /**
   * Cached width of the slider. It should be checked on every document enter.
   * @type {number}
   * @private
   */
  this.sliderWidth_ = 0;
  /**
   * Flag to signify if the scroll slider will be taking place of the viewport
   * of the scroll area.
   * @type {boolean}
   * @private
   */
  this.scrollIsInside_ = true;
  /**
   * Flag if the transitions should be used when displaying / hiding the scroll
   * view.
   * @type {!boolean}
   * @private
   */
  this.transitionsEnabled_ = false;

  this.scrollBar_.setOrientation(goog.ui.Slider.Orientation.VERTICAL);
  // Make the scrolled act as native one.
  this.scrollBar_.setMoveToPointEnabled(true);
  this.restoreSliderReadsDelayed_ = new goog.async.Delay(
      this.restoreSliderReads_, this.restoreSuppersedScrollTimeout_, this);

  this.restoreNaviteScrollReadsDelayed_ = new goog.async.Delay(
      this.restoreNativeScrollReads_, this.restoreSuppersedScrollTimeout_,
      this);

  // Delayed version of the method to use on resize.
  this.handleNativeScrollDelayed_ = new goog.async.Delay(
      this.handleNativeScroll_, 100, this);

};
goog.inherits(pstj.ui.CustomScrollArea, pstj.ui.Sizeable);


/**
 * Configure the transition to use left hand disappearing to cover some UI
 * glitches.
 *
 * @param {!boolean} enable True if the left transition should be used instead
 * of right one.
 */
pstj.ui.CustomScrollArea.prototype.setTransitionToLeft = function(enable) {
  this.transitionToLeft_ = enable;
};


/**
 * Customizable function that calculates the nominal width of the actial scroll
 * area of the custom scroll area.
 * @return {number} The calculated width.
 * @protected
 */
pstj.ui.CustomScrollArea.prototype.calculateScrollNominalWidth = function() {
  var offset;
  if (this.scrollIsInside_) {
    offset = this.sliderWidth_;
  } else {
    offset = 0;
  }
  return this.getWidth() - offset;
};


/**
 * Returns the width (in pixels) that should be set directly on the scroll area
 * of the composite widget.
 * @protected
 * @return {number} The width in pixels.
 */
pstj.ui.CustomScrollArea.prototype.calculateScrollAreaWidth = function() {
  return this.calculateScrollNominalWidth();
};


/**
 * Sets the scroll position relative to the widget container.
 * If the scroll is drawn inside the widget, the scroll area is
 * shrunk to accommodate view port for it, if not, the scroll div
 * is set with the side of the widget.
 * @param {boolean} enable True if the scroll to be drawn inside of the widget,
 * this is the default. False if the scroll will be drawn outside of it or
 * as an overlay, i.e. not visible all the time.
 */
pstj.ui.CustomScrollArea.prototype.setScrollInsideTheWidget = function(enable) {
  this.scrollIsInside_ = enable;
};


/**
 * Handle the resize event. The main element's size has been set, so just
 * handle other elements.
 * Override this if you want to apply custom logic on resizing the actual
 * scroll faces as the browser will display them.
 * @protected
 */
pstj.ui.CustomScrollArea.prototype.onResize = function() {
  var containerWidth = this.calculateScrollAreaWidth();
  goog.style.setWidth(this.scrollContainer_, containerWidth);
  goog.style.setWidth(this.scrollDiv_, (
      pstj.ui.CustomScrollArea.nativeScrollWidth_ + containerWidth));
  this.handleNativeScrollDelayed_.start();
  // probably store the height of the SCROLL_DIV
  // probably also store the scrollContainerHeight - true for % sizeables.
};


/** @inheritDoc */
pstj.ui.CustomScrollArea.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  delete this.sliderWidth_;
  delete this.restoreNaviteScrollReadsDelayed_;
  delete this.suppresNativeScrollReads_;
  delete this.suppresSliderScrollReads_;
  delete this.scrollContainer_;
  delete this.scrollDiv_;
  goog.dispose(this.restoreSliderReadsDelayed_);
  goog.dispose(this.restoreNaviteScrollReadsDelayed_);
  goog.dispose(this.scrollBar_);
  goog.dispose(this.handleNativeScrollDelayed_);
  delete this.handleNativeScrollDelayed_;
  delete this.scrollBar_;
  delete this.restoreNaviteScrollReadsDelayed_;
  delete this.restoreSliderReadsDelayed_;
};


/**
 * Override the getContentElement method to allow the children to be added in
 * the right place.
 * @inheritDoc
 */
pstj.ui.CustomScrollArea.prototype.getContentElement = function() {
  return this.scrollDiv_;
};


/**
 * Override the method as we are using template for the DOM.
 * @inheritDoc
 */
pstj.ui.CustomScrollArea.prototype.createDom = function() {
  var tmp = goog.dom.createDom('div', goog.getCssName('custom-scroll-area'),
      // scroll-internal
      goog.dom.createDom('div', {
        'class': goog.getCssName('custom-scroll-internal'),
        'style': 'position:relative;float:left;overflow:hidden;height:100%'
      }, goog.dom.createDom('div', {
        'class': goog.getCssName('custom-scroll-div'),
        'style': 'overflow-x:hidden;overflow-y:scroll;height:100%'
      })
      ), goog.dom.createDom('div', {
        'class': goog.getCssName('custom-scroll-bar') + ' ' +
            goog.getCssName('goog-slider'),
        'style': 'outline:0;position:absolute;right:0;'
      }, goog.dom.createDom('div', goog.getCssName('custom-scroll-bar-line')),
      goog.dom.createDom('div', {
        'class': goog.getCssName('goog-slider-thumb') + ' ' +
            goog.getCssName('custom-scroll-bar-thumb'),
        'style': 'left:0;position:absolute;overflow:hidden;'
      })));

  this.decorateInternal(tmp);
};


/**
 * Enable / disable transitions. These should be OFF by default, as in some
 * cases the translate3d is not working properly in some environments and thus
 * those should be especially allowed in order to work.
 * NOTE: the translation also requires a transition to be set up:
 * Example:
 *
  .custom-scroll-area {
    position: absolute;
    top: 0;
    left: 0;
    transition: transform 0.5s;
    -moz-transition: -moz-transform 0.5s;
    -webkit-transition: -webkit-transform 0.5s;
    -ms-transition: -ms-transform 0.5s;
  }
 *
 * @param {!boolean} enable True if the animations should be used.
 *
 */
pstj.ui.CustomScrollArea.prototype.enableTransitions = function(enable) {
  this.transitionsEnabled_ = enable;
};


/**
 * @inheritDoc
 */
pstj.ui.CustomScrollArea.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);
  this.scrollDiv_ = goog.dom.getElementByClass(
      pstj.ui.CustomScrollArea.Classes.SCROLL_DIV, this.getElement());

  this.scrollContainer_ = goog.dom.getElementByClass(
      pstj.ui.CustomScrollArea.Classes.SCROLL_CONTAINER, this.getElement());

  var scrollEl = goog.dom.getElementByClass(
      pstj.ui.CustomScrollArea.Classes.SCROLL_BAR, this.getElement());

  this.scrollBar_.decorate(scrollEl);
  this.scrollBar_.setValue(100);
  if (this.transitionsEnabled_ && pstj.style.css.canUseTransform) {
    this.getElement().style.cssText = pstj.style.css.getTranslation(
        ((this.transitionToLeft_) ? -100 : 100), 0, '%');
  } else {
    this.getElement().style.display = 'none';
  }
};


/**
 * @inheritDoc
 */
pstj.ui.CustomScrollArea.prototype.enterDocument = function() {
  this.sliderWidth_ = goog.style.getSize(this.scrollBar_.getElement()).width;
  // Attach this before calling the base as the resize event will be fired in it
  // and we need to have listener ready.
  this.getHandler().listen(this, pstj.ui.Sizeable.EventType.RESIZE,
      this.onResize);
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.scrollBar_, goog.ui.Component.EventType.CHANGE,
      this.handleSliderScroll_);

  this.getHandler().listen(this.scrollDiv_, goog.events.EventType.SCROLL,
      this.handleNativeScroll_);

  if (this.transitionsEnabled_ && pstj.style.css.canUseTransform) {
    var el = this.getElement();
    var style = pstj.style.css.getTranslation(0, 0);
    setTimeout(function() {
      el.style.cssText = style;
    }, 50);
  } else {
    this.getElement().style.display = 'block';
  }
};


/**
 * Override this to clear the listener for the native scroll event set when the
 * component entered the dom.
 * @inheritDoc
 */
pstj.ui.CustomScrollArea.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  this.getHandler().unlisten(this.scrollDiv_,
      goog.events.EventType.SCROLL, this.handleNativeScroll_);

  if (this.transitionsEnabled_ && pstj.style.css.canUseTransform) {
    this.getElement().style.cssText = pstj.style.css.getTranslation(
        ((this.transitionToLeft_) ? -120 : 120), 0, '%');
  } else {
    this.getElement().style.display = 'none';
  }
};


/**
 * Handler for the native scroll event.
 * @private
 */
pstj.ui.CustomScrollArea.prototype.handleNativeScroll_ = function() {

  if (this.suppresNativeScrollReads_) return;
  this.suppresSliderScrollReads_ = true;
  this.restoreSliderReadsDelayed_.start();
  // calculate where we are now and update the slider position.

  var scrollNow = this.scrollDiv_.scrollTop;
  var maxScroll = this.scrollDiv_.scrollHeight -
      this.getScrollContainerHeight_();

  var percent = ((scrollNow / maxScroll) * 100) >> 0;

  this.scrollBar_.setValue(100 - percent);
};


/**
 * Return cached version of the scroll cotnainer height
 * @private
 * @return {number} The container height.
 */
pstj.ui.CustomScrollArea.prototype.getScrollContainerHeight_ = function() {
  return goog.style.getSize(this.scrollContainer_).height;
};


/**
 * Handler for the slider scroll updates event.
 * @private
 */
pstj.ui.CustomScrollArea.prototype.handleSliderScroll_ = function() {
  if (this.suppresSliderScrollReads_) return;

  this.suppresNativeScrollReads_ = true;
  this.restoreNaviteScrollReadsDelayed_.start();

  // calculate new position based on slider and scroll the div to it.
  var sliderValue = this.scrollBar_.getValue();

  var scrollAreaHeight = this.scrollDiv_.scrollHeight;
  //var currentScroll = this.scrollDiv_.scrollTop;

  // this should be kept in cache per the "Sizeable" interface.
  var containerHeight = this.getScrollContainerHeight_();

  var scrollPercent = (100 - sliderValue);
  var scrollMax = scrollAreaHeight - containerHeight;
  var newScroll = (scrollPercent / 100) * scrollMax;

  this.scrollDiv_.scrollTop = newScroll >> 0;
};


/**
 * Restore the read-ability of the slider change events.
 * @private
 */
pstj.ui.CustomScrollArea.prototype.restoreSliderReads_ = function() {
  this.suppresSliderScrollReads_ = false;
};


/**
 * Restore the native scroll events read coming from the scroll div.
 * @private
 */
pstj.ui.CustomScrollArea.prototype.restoreNativeScrollReads_ = function() {
  this.suppresNativeScrollReads_ = false;
};


/**
 * @const
 * @private
 * @type {number}
 */
pstj.ui.CustomScrollArea.nativeScrollWidth_ = goog.style.getScrollbarWidth();


/**
 * @enum {string}
 */
pstj.ui.CustomScrollArea.Classes = {
  SCROLL_CONTAINER: goog.getCssName('custom-scroll-internal'),
  SCROLL_DIV: goog.getCssName('custom-scroll-div'),
  SCROLL_BAR: goog.getCssName('custom-scroll-bar')
};
