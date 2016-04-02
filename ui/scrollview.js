/**
 * @fileoverview Attempt to reimplement the tableview widget with the
 * capabilities explored by the sencha team.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.ScrollView');

goog.require('goog.asserts');
goog.require('goog.async.AnimationDelay');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.style');
// goog.require('goog.events.EventType');
goog.require('goog.ui.Control');
goog.require('pstj.ds.List');
goog.require('pstj.lab.style.css');
goog.require('pstj.ui.TableViewItem');
goog.require('pstj.ui.gestureAgent');
goog.require('pstj.ui.gestureAgent.EventType');



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
  this.dataOffset_ = 0;
  /**
   * The axium visual offset that is allowed.
   * @type {number}
   * @private
   */
  this.maxVisualOffset_ = 0;
  /**
   * The cache used for calculations. This is done to allow the access to
   * numeric values to be made in array and potentially in a typed array. The
   * access in typed arrays is performed in the same was as in normal arrays,
   * however the buffer must be created separately.
   * @type {number}
   * @private
   */
  this.childCount_ = 0;
  /**
   * Referrences the last known velocity.
   * @type {number}
   * @private
   */
  this.velocity_ = 0;
  /**
   * The height a single child will have in the view. Note that in this
   * implemnetation we assume static child height and thus once it is set and
   * the component is in the document we cannot change it.
   * @type {!number}
   * @private
   */
  this.cellHeight_ = 100;
  /**
   * Kinetich raf-ing.
   * @type {goog.async.AnimationDelay}
   * @private
   */
  this.kineticRaf_ = new goog.async.AnimationDelay(this.kineticHandler,
      undefined, this);
};
goog.inherits(pstj.ui.ScrollView, goog.ui.Control);


/**
 * The priction to use when decelerating.
 * @type {number}
 * @const
 */
pstj.ui.ScrollView.Friction = 0.5;


goog.scope(function() {
var _ = pstj.ui.ScrollView.prototype;


/**
 * Handles the RAF when we have kinetic.
 * @param {number} ts The timestamp of the RAF.
 * @protected
 */
_.kineticHandler = function(ts) {
  this.kineticRaf_.start();
  if (this.velocity_ != 0) {
    this.handleVerticalDifference(-this.velocity_);
    this.velocity_ += (this.velocity_ < 0) ? pstj.ui.ScrollView.Friction :
        -pstj.ui.ScrollView.Friction;
  } else {
    this.kineticRaf_.stop();
    this.onDrawReady();
  }
};


/**
 * Only List type is alloed here.
 * @override
 */
_.setModel = function(model) {
  goog.asserts.assertInstanceof(model, pstj.ds.List);
  goog.base(this, 'setModel', model);
  // null out the positioning.
  this.kineticRaf_.stop();
  this.visualOffset_ = 0;
  this.dataOffset_ = 0;
  this.updateChildren();
  this.updateScroll();
  this.calculateMaxVisualOffset();
  this.onDrawReady();
};


/**
 * Calculates the maximum allowed visual offset. The calculation is based on the
 * number of model items and the height of the cell.
 * @protected
 */
_.calculateMaxVisualOffset = function() {
  if (this.isInDocument() && !goog.isNull(this.getModel())) {
    this.maxVisualOffset_ = (
        (this.getCellHeight() * this.getModel().getCount()) -
        goog.style.getSize(this.getElement()).height);
  }
};


/**
 * Method designed specifically to extend. The sublcasses should override it
 * in order to perfom heavy drawing operations inside of it. It is guaranteed
 * to be called only after movement is completed.
 * @protected
 */
_.onDrawReady = function() {};


/**
 * Iterate children setting the models.
 * @protected
 */
_.updateChildren = function() {
  var use_null = goog.isNull(this.getModel());
  this.forEachChild(function(child, idx) {
    if (use_null) {
      child.setModel(null);
    } else {
      child.setModel(this.getModel().getByIndex(this.dataOffset_ + idx));
    }
    pstj.lab.style.css.setTranslation(child.getElement(), 0,
        (idx * this.cellHeight_));
  }, this);
};


/**
 * Moves the children around to match the view's reqirement.
 * @param {boolean} down If true one child from the head will be moved to the
 * tail, else the reverse will be performed.
 * @protected
 */
_.switchChild = function(down) {
  var first = this.dataOffset_ % this.childCount_;
  if (down) {
    var child = this.getChildAt(first);
    child.setModel(this.getModel().getByIndex(
        this.dataOffset_ + this.childCount_));
    pstj.lab.style.css.setTranslation(child.getElement(), 0,
        ((this.dataOffset_ + this.childCount_) * this.cellHeight_));
    this.dataOffset_++;
  } else {
    var last = (first == 0) ?
        (this.childCount_ - 1) : (first - 1);
    var child = this.getChildAt(last);
    child.setModel(this.getModel().getByIndex(this.dataOffset_ - 1));
    pstj.lab.style.css.setTranslation(
        child.getElement(), 0, ((this.dataOffset_ - 1) * this.cellHeight_));
    this.dataOffset_--;
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
  if (this.isInDocument()) {
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
  return new pstj.ui.TableViewItem(undefined, this.getDomHelper());
};


/** @inheritDoc */
_.enterDocument = function() {
  goog.base(this, 'enterDocument');
  // FIXME: this should not be used in desktop PCs!!! fires too often
  // this.getHandler().listen(
  //     goog.dom.ViewportSizeMonitor.getInstanceForWindow(window),
  //     goog.events.EventType.RESIZE, this.handleViewportResize);
  if (this.getChildCount() == 0) {
    this.generateCells();
  }
  this.getHandler().listen(this, [
    pstj.ui.gestureAgent.EventType.PRESS,
    pstj.ui.gestureAgent.EventType.MOVE,
    pstj.ui.gestureAgent.EventType.RELEASE,
    pstj.ui.gestureAgent.EventType.CANCEL
  ], this.handleGesture);
  this.calculateMaxVisualOffset();
  // It is safe to attach multiple times, subsequent ones will be ignored
  pstj.ui.gestureAgent.getInstance().attach(this);
};


/**
 * Generalized handler for the events that are to be bound to the instance.
 * @param {goog.events.Event} e The abstractd gesture event.
 * @protected
 */
_.handleGesture = function(e) {
  if (e.type == pstj.ui.gestureAgent.EventType.PRESS) {
    this.kineticRaf_.stop();
  } else if (e.type == pstj.ui.gestureAgent.EventType.MOVE) {
    this.handleVerticalDifference(
        pstj.ui.gestureAgent.getInstance().getMoveDifferenceY());
  } else if (e.type == pstj.ui.gestureAgent.EventType.RELEASE) {
    this.velocity_ = pstj.ui.gestureAgent.getInstance().getVelocityY();
    if (this.velocity_ != 0) {
      if (!this.kineticRaf_.isActive()) {
        this.kineticRaf_.start();
      }
    } else {
      this.onDrawReady();
    }
  }
};


/**
 * Handles the difference in vertical that should be traveled by the scroll view
 * in order to match the new desired position.
 * @param {number} diff The difference in pixels to apply.
 * @protected
 */
_.handleVerticalDifference = function(diff) {
  var offset = this.visualOffset_ - diff;
  if (-offset < 0) offset = 0;
  if (-offset > this.maxVisualOffset_) offset = -this.maxVisualOffset_;
  this.visualOffset_ = offset;
  var toppixel = this.dataOffset_ * this.getCellHeight();
  if (toppixel + this.getCellHeight() < -this.visualOffset_) {
    this.switchChild(true);
  } else if (toppixel > -this.visualOffset_) {
    this.switchChild(false);
  }
  this.updateScroll();
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
  this.childCount_ = len;
  if (this.isInDocument()) {
    this.updateChildren();
  }
};


/**
 * Updates the position of the scrolling element to match the desired visual
 * offset.
 * @protected
 */
_.updateScroll = function() {
  pstj.lab.style.css.setTranslation(this.getElement(), 0, this.visualOffset_);
};

});  // goog.scope
