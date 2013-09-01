goog.provide('pstj.ui.TableView');

goog.require('goog.async.AnimationDelay');
goog.require('goog.async.Delay');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component');
goog.require('pstj.lab.style.css');
goog.require('pstj.ui.TableViewItem');

/**
 * Provides the TableView fnctionality similar to NSTableView.
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
pstj.ui.TableView = function() {
  goog.base(this);
  /**
   * The item offset we have at the top, when an item is tranferred from the
   * head to the tail of the list the offset is increased and vice versa.
   * @type {number}
   * @private
   */
  this.offset_ = 0;
  /**
   * The visual offset is an additional offset applied to the items as currently
   * structured based on the offset_. If the items are not exactly alligned with
   * the edge of the container the visual offset represents that missalignment.
   * @type {number}
   * @private
   */
  this.visualOffset_ = 0;
  /**
   * Numerical array is used to store cacheable values to make the object
   * smaller and the access to the values faster and allow them to be alligned
   * in faster memory structure.
   * In addition a types array could be used, but it is currently not as
   * not all target browsers support it.
   * @type {Array.<number>}
   * @private
   */
  this.cache_ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  /**
   * Internal cache for the height of a child item. It is used for calculations
   * and should be retrieved once a single item is constructed.
   * It can also be assigned programatically should we know the size of an item
   * in advance.
   * @type {number}
   * @private
   */
  this.childHeight_ = 0;
  /**
   * Internal cache for the height of the main element (container), used to
   * calculate offsets and allowed animation destinations.
   * @type {number}
   * @private
   */
  this.elementHeight_ = 0;
  /**
   * Flag: if we are cirrently animating / simulating movement to a new
   * Y destination (after a fast touch move that has momentum), this flag should
   * be up (true).
   * @type {boolean}
   * @private
   */
  this.isAnimating_ = false;
  /**
   * Flag to disable handling of move and end events when data is altered.
   * @private
   * @type {boolean}
   */
  this.ignoreEndEvents_ = false;

  this.momentumRaf_ = new goog.async.AnimationDelay(this.handleMomentum, undefined, this);
  this.movementRaf_ = new goog.async.AnimationDelay(this.handleMovement, undefined, this);
  this.paintNotifyDelay_ = new goog.async.Delay(this.paintNotify, 450, this);
};
goog.inherits(pstj.ui.TableView, goog.ui.Component);

/**
 * Provides named accessors for the cached values. The access will be rewritten
 * by the compiler to be interpreted as regular array access by index, so there
 * is no performance penalty from using the named accessors.
 *
 * @enum {number}
 */
pstj.ui.TableView.Cache = {
  TOUCH_START_Y: 0,
  TOUCH_CURRENT_Y: 1,
  TOUCH_START_TIME: 2,
  TOUCH_END_TIME: 4,
  TOUCH_DURATION: 5,
  ANIMATION_DESTINATION_Y: 6,
  ANIMATION_DURATION: 7,
  ANIMATION_DESIRED_END_TIME: 8,
  ANIMATION_START_TIME: 9,
  HANDLER_LAST_Y: 10,
  HANDLER_CURRENT_Y: 11,
  MODEL_LENGTH: 12,
  NEEDS_MOMENTUM: 13
};

/**
 * @define {number} The deceleration for the table view momentum.
 */
goog.define('pstj.ui.TableView.DECELERATION', 0.001);

goog.scope(function() {

  var _ = pstj.ui.TableView.prototype;
  var CP = pstj.ui.TableView.Cache; // CacheProperties
  var _css = pstj.lab.style.css;

  /** @inheritDoc */
  _.setModel = function(model) {
    if (!(model instanceof pstj.ds.List)) {
      throw new Error('The widget is designed to use List instance as source');
    }
    goog.base(this, 'setModel', model);
    // if we are in the document reset everything with the new data.
    if (this.isInDocument()) {
      this.offset_ = 0;
      this.visualOffset_ = 0;
      this.momentumRaf_.stop();
      this.movementRaf_.stop();
      this.isAnimating_ = false;
      this.cache_[CP.NEEDS_MOMENTUM] = 0;
      this.cache_[CP.HANDLER_LAST_Y] = 0;
      this.cache_[CP.HANDLER_CURRENT_Y] = 0;
      this.ignoreEndEvents_ = true;
      this.setChildHeight(this.getChildCount());
      this.applyStyles();
    }
  };

  /**
   * Public method that should generate the rows for the view. In mobile
   * environment it is okay to assume height the longest of the browser
   * dimentions. For browsers it is a bit more difficult as it may change size
   * independent of the device dimentions, thus we have to update the items
   * count on every resize.
   * FIXME: make this work in desktop browsers as well.
   */
  _.generateRows = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var height = (w > h) ? w : h;
    var elscount = Math.ceil(height / this.childHeight_);
    for (var i = 0; i < elscount; i++) {
      this.addChild((new pstj.ui.TableViewItem()), true);
    }
  };

  /** @inheritDoc */
  _.enterDocument = function() {
    console.log('enter document');
    goog.base(this, 'enterDocument');
    this.getHandler()
      .listen(this.getElement(), goog.events.EventType.TOUCHSTART, this.handleTouchStart)
      .listen(this.getElement(), goog.events.EventType.TOUCHMOVE, this.handleTouchMove)
      .listen(this.getElement(), goog.events.EventType.TOUCHEND, this.handleTouchEnd);
    this.elementHeight_ = goog.style.getSize(this.getElement()).height;
    if (!goog.isNull(this.getModel())) {
      this.updateContentForCount(this.getChildCount());
    }
    this.applyStyles();
  };

  /**
   * Sets the desired child height in the container.
   * FIXME: this is bad practice and should be avoided
   *
   * @param {number} height The height that will be used.
   */
  _.setChildHeight = function(height) {
    this.childHeight_ = height;
  };

  /**
   * Handler or the touchstart browser event. Notice that it might come from
   * the child nodex as well as the root element.
   *
   * @param {goog.events.Event} e The wrapped browser event.
   * @protected
   */
  _.handleTouchStart = function(e) {
    if (e.target != this.getElement()) {
      this.isAnimating_ = false;
      this.cache_[CP.NEEDS_MOMENTUM] = 0;
      this.momentumRaf_.stop();
      this.movementRaf_.stop();
      if (e.getBrowserEvent().touches.length == 1) {
        e.stopPropagation();
        e.preventDefault();
        this.ignoreEndEvents_ = false;
        // we do not need to record the child element, assuming it will
        // fire the 'ACTION' event when really pressed (so it is a
        // good idea to subscribe it to touchable agent)
        this.cache_[CP.HANDLER_LAST_Y] = e.getBrowserEvent().touches[0].clientY;
        this.cache_[CP.TOUCH_START_TIME] = e.getBrowserEvent().timeStamp;
        this.cache_[CP.TOUCH_START_Y] = this.cache_[CP.HANDLER_LAST_Y];
      }
    }
  };

  /**
   * Check if no animation is pending in the draw queue. Use this to check if
   * a it is okay to make heavy alterations on the UI and separate the UI
   * tasks to smaller jobs and check with this method before each re-paint (
   * i.e. in each tick).
   *
   * @return {boolean}
   */
  _.hasAnimationPending = function() {
    return (!this.movementRaf_.isActive() && !this.momentumRaf_.isActive());
  };

  /**
   * Emits the animation end event to singal that we are currently not using
   * raf and thus heavier repaints can be taken care of. Note that it is not
   * guaranteed that this will not change during your operation so if it is
   * really cpu consuming (like something with images) use nextTick and on
   * each tick check if an animation is not started again.
   *
   * @protected
   */
  _.paintNotify = function() {
    this.dispatchEvent('animation-end');
  };

  /**
   * Handles the touch move event from the browser attached on the root
   * element of the node.
   *
   * @param {goog.events.Event} e The wrapped browser event.
   * @protected
   */
  _.handleTouchMove = function(e) {
    if (this.ignoreEndEvents_) return;
    if (e.target != this.getElement()) {
      e.stopPropagation();
      e.preventDefault();
      this.cache_[CP.HANDLER_CURRENT_Y] = e.getBrowserEvent().touches[0].clientY;
      this.movementRaf_.start();
    }
  };

  /**
   * Handles the touch end event. It is also checking if the touch was
   * short enough and powerful (distance wise) enough to trigger a momentum
   * in the list.
   *
   * @param {goog.events.Event} e The wrapped browser event.
   * @protected
   */
  _.handleTouchEnd = function(e) {
    if (this.ignoreEndEvents_) return;
    if (e.target != this.getElement()) {
      var be = e.getBrowserEvent();
      // Only if we are the last touch (i.e. released)
      if (be.touches.length == 0) {
        e.stopPropagation();
        this.cache_[CP.TOUCH_END_TIME] = be.timeStamp;
        this.cache_[CP.TOUCH_DURATION] = this.cache_[CP.TOUCH_END_TIME] - this.cache_[CP.TOUCH_START_TIME];
        this.cache_[CP.TOUCH_CURRENT_Y] = this.cache_[CP.HANDLER_CURRENT_Y];
        // If touch lasted for less than 300 ms and there was movement
        if (this.cache_[CP.TOUCH_DURATION] < 300 && Math.abs(this.getTouchDistance_()) > 10) {
          this.cache_[CP.NEEDS_MOMENTUM] = 1;
          if (!this.movementRaf_.isActive()) {
            this.movementRaf_.start();
          }
        } else if (this.isBeyoundEdge()) {
            this.cache_[CP.TOUCH_DURATION] = 160;
            this.cache_[CP.NEEDS_MOMENTUM] = 1;
            if (!this.movementRaf_.isActive()) {
              this.movementRaf_.start();
            }
        }
      }
    }
  };

  /**
   * Calculates the momentum of the touch move that just finished and
   * attempt to simulate continuous movement based on that momentum.
   *
   * @protected
   */
  _.setMomentum = function() {
    // distance traveled from beginning of touch event
    var distance = this.getTouchDistance_();
    // The speed that the touch traveled that distance.
    var speed = Math.abs(distance) / this.cache_[CP.TOUCH_DURATION];

    this.cache_[CP.ANIMATION_DESTINATION_Y] = Math.round(this.cache_[CP.TOUCH_CURRENT_Y] + ((speed * speed) / (
        2 * pstj.ui.TableView.DECELERATION) * (distance < 0 ? -1 : 1)));

    this.cache_[CP.ANIMATION_DURATION] = Math.abs(speed / pstj.ui.TableView.DECELERATION);
    this.cache_[CP.ANIMATION_DESIRED_END_TIME] = this.cache_[CP.TOUCH_END_TIME] + this.cache_[CP.ANIMATION_DURATION];
    this.cache_[CP.ANIMATION_START_TIME] = this.cache_[CP.TOUCH_END_TIME];

    // if we have scrolled down.
    if (distance > 0) {
      // if the distance to travel is larger than allowed
      if (this.cache_[CP.ANIMATION_DESTINATION_Y] - this.cache_[CP.TOUCH_CURRENT_Y] > this.pixelsToTop()) {
        this.cache_[CP.ANIMATION_DESTINATION_Y] = this.cache_[CP.TOUCH_CURRENT_Y] + this.pixelsToTop();
        this.cache_[CP.ANIMATION_DURATION] = (Math.abs(this.pixelsToTop()) / speed) << 0;
        this.cache_[CP.ANIMATION_DESIRED_END_TIME] = this.cache_[CP.ANIMATION_START_TIME] + this.cache_[CP.ANIMATION_DURATION];
      }
    } else {
      if (this.cache_[CP.TOUCH_CURRENT_Y] - this.cache_[CP.ANIMATION_DESTINATION_Y] > this.pixelsToBottom()) {
        this.cache_[CP.ANIMATION_DESTINATION_Y] = this.cache_[CP.TOUCH_CURRENT_Y] - this.pixelsToBottom();
        this.cache_[CP.ANIMATION_DURATION] = (Math.abs(this.pixelsToBottom()) / speed) << 0;
        this.cache_[CP.ANIMATION_DESIRED_END_TIME] = this.cache_[CP.ANIMATION_START_TIME] + this.cache_[CP.ANIMATION_DURATION];
      }
    }
    this.isAnimating = true;
  };

  /**
   * Tries to detect if the drawing is / will be (in case where the raf
   * after the  move has not yet been completed) beyond the edges of the list
   * view. If this is the case dummy momentum should be used to put back the
   * list into its edges.
   * @return {boolean}
   * @protected
   */
  _.isBeyoundEdge = function() {
    var next_visual_offset = this.visualOffset_ + this.cache_[CP.HANDLER_CURRENT_Y] - this.cache_[CP.HANDLER_LAST_Y];
    if (this.offset_ == 0 && next_visual_offset > 0) {
      return true;
    }
    if (((this.getModel().getCount() - this.offset_) * this.childHeight_) - this.elementHeight_ > next_visual_offset) {
      return true;
    }
    return false;
  };

  /**
   * Method called by the momentum execution RAF.
   *
   * @param {number} ts The timestamp of the RAF.
   * @protected
   */
  _.handleMomentum = function(ts) {
    console.log('handle momentum', this.isAnimating_);
    if (this.isAnimating_) {
      this.momentumRaf_.start();
      if (ts >= this.cache_[CP.ANIMATION_DESIRED_END_TIME]) {
        this.isAnimating_ = false;
        this.cache_[CP.HANDLER_CURRENT_Y] = this.cache_[CP.ANIMATION_DESTINATION_Y];
      } else {
        var nn = (ts - this.cache_[CP.ANIMATION_START_TIME]) / this.cache_[CP.ANIMATION_DURATION];
        var easing = (nn * (2 - nn));
        this.cache_[CP.HANDLER_CURRENT_Y] = (
          (this.cache_[CP.ANIMATION_DESTINATION_Y] - this.cache_[CP.TOUCH_CURRENT_Y]) * easing) + this.cache_[CP.TOUCH_CURRENT_Y];
      }
      this.handleMovement(ts);
    }
  };

  /**
   * Calculates the pixels that we are allowed to scroll top before we reach the
   * beginnig of the list.
   * @return {number}
   */
  _.pixelsToTop = function() {
    return (this.offset_ * this.childHeight_) - this.visualOffset_;
  };

  /**
   * Calculates how many pixels are free to be taken until we reach the end
   * of the visual list.
   * @return {number}
   */
  _.pixelsToBottom = function() {
    return (((this.getModel().getCount() - this.offset_) * this.childHeight_) +
        this.visualOffset_ - this.elementHeight_);
  };

  /**
   * Updates the content / model for the N items. Could be negative number
   * signifying that the items at the bottom need update, negative numbers
   * mean the items at the top need update.
   * // TODO: actually test this code with data.
   *
   * @param {number} count An integer indicating how many of the items at the
   * head (negative) or at the tail (positive) to update.
   * @protected
   */
  _.updateContentForCount = function(count) {
    if (count < 0) {
      // TOP to BOTTOM
      for (var i = (
          this.getChildCount() + count); i < this.getChildCount(); i++) {
        this.getChildByOffsetIndex(i).setModel(
          this.getModel().getByIndex(i + this.offset_));
      }
    } else if (count > 0) {
      // BOTTOM to TOP
      for (var i = 0; i < count; i++) {
        this.getChildByOffsetIndex(i).setModel(
          this.getModel().getByIndex(i + this.offset_));
      }
    }
  };

  /**
   * Function called at every RAF timeout to update the drawn items on the
   * screen. The method calculated the needed offsets and shifts in the
   * item arrangement and calls the style application method at the end.
   *
   * @param {number} ts The timestamp generated by the RAF.
   * @protected
   */
  _.handleMovement = function(ts) {
    this.visualOffset_ = this.visualOffset_ + this.cache_[CP.HANDLER_CURRENT_Y] - this.cache_[CP.HANDLER_LAST_Y];
    this.cache_[CP.HANDLER_LAST_Y] = this.cache_[CP.HANDLER_CURRENT_Y];
    this.shiftItems();
    this.applyStyles();
    if (this.cache_[CP.NEEDS_MOMENTUM] == 1) {
      this.cache_[CP.NEEDS_MOMENTUM] = 0;
      this.isAnimating_ = true;
      this.setMomentum();
      this.momentumRaf_.start();
    }
  };

  /**
   * Shifts items from head of list to tail and vice versa when offset requires
   * if. It is in the heart of the NSListView and is the method allowing to
   * simulate large lists with only a few child component instances. For the
   * calculations to work correctly it is requires that the child component
   * height be correctly pre-calculated.
   *
   * @protected
   */
  _.shiftItems = function() {
    // at this point we assume that the visual offset is larger than items,
    // so we need to shift
    var to_trans = 0;
    if (this.visualOffset_ > 0) {
      // we need item(s) to go to from BOTTOM to TOP;
      // Make check if the element is 0 index!!!!
      if (this.offset_ > 0) {
        to_trans = ((this.visualOffset_ + this.childHeight_) / this.childHeight_) << 0;
        this.visualOffset_ = (this.visualOffset_ - (this.childHeight_ * to_trans)) % this.childHeight_;
        this.offset_ = this.offset_ + (to_trans * -1);
        this.updateContentForCount(to_trans);
      }
    } else if (this.visualOffset_ < (this.childHeight_ * -1)) {
      if (this.getModel().getCount() > (this.offset_ + this.getChildCount())) {
        // we are way up, can transfer item(s) to the bottom
        // we need item(s) to go from TOP to BOTTOM
        // calculate how many items to transfer
        to_trans = (this.visualOffset_ / this.childHeight_) << 0; // < 0
        this.visualOffset_ = this.visualOffset_ % this.childHeight_;
        // now we have migrated els_to_transfer count to the bottom, update
        // them on the next tick.
        this.offset_ = this.offset_ + (to_trans * -1);
        this.updateContentForCount(to_trans);
      }
    }
  };

  /**
   * Helper function to calculate the distance traveled by a touch event from
   * its start to its end.
   *
   * @return {number}
   * @private
   */
  _.getTouchDistance_ = function() {
    return this.cache_[CP.TOUCH_CURRENT_Y] - this.cache_[CP.TOUCH_START_Y];
  };

  /**
   * Allows access to a child element using the internal logic of displaying
   * items. That means that while the natural position of a child might be
   * 0, using the offset logic it might need to be positioned at any of the
   * available positions (where positions is between 0 and children.length - 1).
   * Use this method to access the children in the order at which they actually
   * apear on the screen (i.e. accounting for offset).
   *
   * @param {number} index The child at the desired visual index.
   * @return {goog.ui.Component} The real child component matching the index.
   * @protected
   */
  _.getChildByOffsetIndex = function(index) {
    var idx = index + (this.offset_ % this.getChildCount());
    if (idx >= this.getChildCount()) {
      idx = idx - this.getChildCount();
    }
    return this.getChildAt(idx);
  };

  /**
   * Applies the styling for the offsets for each of the child components. The
   * order is guaranteed by using the proper accessor for indexes of child
   * components based on the visual offsetting used internally.
   *
   * @protected
   */
  _.applyStyles = function() {
    console.log('Apply styles');
    for (var i = 0, len = this.getChildCount(); i < len; i++) {
      _css.setTranslation(this.getChildByOffsetIndex(i).getElement(), 0,
        ((i * this.childHeight_) + this.visualOffset_));
    }
  };
});
