/**
 * @fileoverview Attempt to reimplement the tableview widget with the
 * capabilities explored by the sencha team.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.ScrollView');

goog.require('goog.ui.Control');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.events.EventType');
goog.require('pstj.lab.style.css');
goog.require('goog.events.MouseWheelHandler.EventType');



/**
 * Implements the idea for scrollview based on the talks of Sencha labs of how
 * they have created facebook html5 app.
 * @constructor
 * @extends {goog.ui.Control}
 * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
 * decorate the component; defaults to {@link goog.ui.ControlRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 * document interaction.
 */
pstj.ui.ScrollView = function(opt_renderer, opt_domHelper) {
  goog.base(this, '', opt_renderer, opt_domHelper);
  /**
   * The first model index that is visible on the screen. Initially it is 0
   * and each time we move a child component from the head to the tail it
   * increases by 1. The opposite is also performed - when moving a child from
   * the tail to the head it is decreased. This way we can always tell the
   * visible models on the view. First model is the value and last index of
   * model is the value + the children count.
   * @type {number}
   * @private
   */
  this.offset_ = 0;
  /**
   * The cache used for calculations. This is done to allow the access to
   * numeric values to be made in array and potentially in a typed array. The
   * access in typed arrays is performed in the same was as in normal arrays,
   * however the buffer must be created separately.
   * @type {Array.<number>}
   * @private
   */
  this.cache_ = [0];
  /**
   * The height a single child will have in the view. Note that in this
   * implemnetation we assume static child height and thus once it is set and
   * the component is in the document we cannot change it.
   * @type {!number}
   * @private
   */
  this.cellHeight_ = 100;
  /**
   * Referrence to the mouse wheel handler for the component's root DOM node.
   * @type {goog.events.MouseWheelHandler}
   * @private
   */
  this.mousewheelhandler_ = null;
};
goog.inherits(pstj.ui.ScrollView, goog.ui.Control);


/**
 * Referrence for the cache values meaning. Using the cache example:
 * <pre>
 *   // Gets the cached child count of the element.
 *   var value = this.cache_[pstj.ui.ScrollView.Cache.CHILD_COUNT];
 * </pre>
 * Becasue the cache is private the names of the cache are also made private.
 * @enum {number}
 * @private
 */
pstj.ui.ScrollView.Cache_ = {
  CHILD_COUNT: 0
};


goog.scope(function() {
var _ = pstj.ui.ScrollView.prototype;
var C = pstj.ui.ScrollView.Cache_;


/**
 * Moves the children around to match the view's reqirement.
 * @param {boolean} down If true one child from the head will be moved to the
 * tail, else the reverse will be performed.
 * @protected
 */
_.switchChild = function(down) {
  var first = this.offset_ % this.getChildCount();
  if (down) {
    var child = this.getChildAt(first);
    child.setModel(this.getModel().getByIndex(
        this.offset_ + this.getChildCount()));
    pstj.lab.style.css.setTranslation(child.getElement(), 0,
        ((this.offset_ + this.getChildCount()) * this.cellHeight_));
    this.offset_++;
  } else {
    var last = (first == 0) ?
        (this.cache_[C.CHILD_COUNT] - 1) : (first - 1);
    var child = this.getChildAt(last);
    child.setModel(this.getModel().getByIndex(this.offset_ - 1));
    pstj.lab.style.css.setTranslation(
        child.getElement(), 0, ((this.offset_ - 1) * this.cellHeight_));
    this.offset_--;
  }
};


/**
 * Sets the height the cell will have based on the design of the child
 * component. Note that once the instance is in the document chaning the
 * height of the cell can have unpredicable effects so we throw an error on
 * it.
 * @param {!number} height The height to use to calculate children positions.
 */
_.setCellHeight = function(height) {
  if (!this.isInDocument()) {
    throw new Error(
        'Component already in document, cell height cannot be changed');
  }
  this.cellHeight_ = height;
};


/**
 * Returns the height used in calculation for cell positioning. Note that the
 * actual cell height might NOT match if the styling is chainging it.
 * @return {!number}
 */
_.getCellHeight = function() {
  return this.cellHeight_;
};


/**
 * Creates a new child component. Note that the child component creation should
 * be overriden for each instance you want to customize.
 * @return {!goog.ui.Control}
 */
_.createRowCell = function() {
  return new goog.ui.Control('', undefined, this.getDomHelper());
};


/** @inheritDoc */
_.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.mousewheelhandler_ = new goog.events.MouseWheelHandler(
      this.getElement());
  // FIXME: this should not be used in desktop PCs!!! fires too often
  this.getHandler().listen(
      goog.dom.ViewportSizeMonitor.getInstanceForWindow(window),
      goog.events.EventType.RESIZE, this.handleViewportResize);

  this.getHandler().listen(this.getElement(), [
    goog.events.EventType.TOUCHSTART,
    goog.events.EventType.TOUCHMOVE,
    goog.events.EventType.TOUCHEND,
    goog.events.EventType.TOUCHCANCEL]);

  this.getHandler().listen(this.mousewheelhandler_,
      goog.events.MouseWheelHandler.EventType.MOUSEWHEEL);
};


/**
 * Generalized handler for the events that are to be bound to the instance.
 * @override
 */
_.handleEvent = function(e) {

};


/**
 * Dummy handler for the changes in the view port. Note that it will be fired
 * only when the viewport measuer size actually changes. Make sure to delay
 * the action if it involved UI touches.
 * @param {goog.events.Event} e The RESIZE event.
 * @protected
 */
_.handleViewportResize = function(e) {
  // do nothing but be in the API.
};


/**
 * Calculates the maximum height of the scroll view we want to handle.
 * This is basic implementation and takes the longest side of the current
 * viewport. Note that it is not guaranteed to work on desktop PC as the
 * viewport size can vary drastically there. If you want to cover that use case
 * consider overrideing the method.
 * @protected
 * @return {number} The longest screen size (pixels).
 */
_.getMaximumCoverableHeight = function() {
  return goog.dom.ViewportSizeMonitor
    .getInstanceForWindow(window).getSize().getLongest();
};


/**
 * Calculates how many children are allowed in the view. This method can
 * be overriden if you need to make adjustments to the default behaviour.
 * @return {number} The children that will fit in the view.
 * @protected
 */
_.calculateMaxChildCount = function() {
  var h = this.getMaximumCoverableHeight();
  return Math.ceil(h / this.cellHeight_) + 1;
};


/**
 * Generates the cells needed for the view.
 * @protected
 */
_.generateCells = function() {
  var len = this.calculateMaxChildCount();
  for (var i = 0; i < len; i++) {
    this.addChild(this.createRowCell(), true);
  }
  this.cache_[C.CHILD_COUNT] = len;
};

});  // goog.scope
