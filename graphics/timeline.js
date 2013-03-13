goog.provide('pstj.graphics.Timeline');

goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.functions');
goog.require('pstj.configure');
goog.require('pstj.date.utils');
goog.require('pstj.graphics.Canvas');
goog.require('pstj.graphics.Draw');
goog.require('pstj.graphics.Smooth');
goog.require('pstj.ui.Templated');

/**
 * @fileoverview Provides the basic time line that can be used to draw unlimited
 * time frame in fractions. Currently up to several days of time is supported,
 * but additional steps can be provided to support much longer periods.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * @constructor
 * @extends {pstj.ui.Templated}
 */
pstj.graphics.Timeline = function() {
  goog.base(this);
  this.animation_ = new pstj.graphics.Smooth(this.draw, this);
};
goog.inherits(pstj.graphics.Timeline, pstj.ui.Templated);


/**
 * Provides the events that are going on in the canvas world.
 * @enum {string}
 */
pstj.graphics.Timeline.EventType = {
  SCALE_CHANGE: goog.events.getUniqueId('scale-change')
};
/**
 * The steps to use to generate the time fractions.
 * @type {Array.<number>}
 * @final
 */
pstj.graphics.Timeline.STEPS = [3600, 1800, 600, 60, 30, 1];


// Configure some default values, can be overridden runtime globally.
//
/**
 * The run time configuration prefix to look up into when determining the run
 *   time values for configurable proeprties.
 * @type {string}
 * @private
 */
pstj.graphics.Timeline.PREFIX_ = 'SYSMASTER.TIMELINE.VIEW';
/**
 * The default font to use to draw text in the canvas. Configurable at run time.
 * @type {string}
 * @private
 */
pstj.graphics.Timeline.FONT_FACE_ = 'normal 10px Arial';
/**
 * The default background color to use when drawing the canvas.
 * @type {string}
 * @private
 */
pstj.graphics.Timeline.BACKGROUND_COLOR_ = '#306392';
/**
 *  The default background for the scale portion of the time line.
 * @type {string}
 * @private
 */
pstj.graphics.Timeline.SCALE_BACKGROUND_COLOR_ = '#abcff1';
/**
 * The default foreground color for the cursor.
 * @type {string}
 * @private
 */
pstj.graphics.Timeline.CURSOR_COLOR_ = '#ff0000';
/**
 * The default background color to use for the cursor in the time line.
 * @type {string}
 * @private
 */
pstj.graphics.Timeline.CURSOR_BACKGROUND_COLOR_ = '#ffffff';
/**
 * The default text color to use in the canvas.
 * @type {string}
 * @private
 */
pstj.graphics.Timeline.TEXT_COLOR_ = '#ffffff';
/**
 * The default color to use for the delimiter.
 * @type {string}
 * @private
 */
pstj.graphics.Timeline.DELIMITER_COLOR_ = '#06b3ec';
/**
 * The default duration of time to be visualizes in the time line when scale is
 *   1.
 * @type {number}
 * @private
 */
pstj.graphics.Timeline.MAIN_PERIOD_ = 86400;
/**
 * The maximum scale factor to be applicable to the time line.
 * @type {number}
 * @private
 */
pstj.graphics.Timeline.MAX_SCALE_FACTOR_ = 800;
/**
 * The height of the scale portion of the time line.
 * @type {number}
 * @private
 */
pstj.graphics.Timeline.SCALE_HEIGHT_ = 30;

/**
 * The size in units for the height of time fraction delimiters.
 * FIXME: this is broken design because if on run time the scale height is
 * indeed changed the anchor sizes will not match it.
 * @type {Array.<number>}
 * @final
 * @private
 */
pstj.graphics.Timeline.ANCHOR_SIZE_ = [
  25,
  20,
  15,
  10,
  // both represent seconds but with different steps, so they use the same
  // height.
  5,
  5
];

/**
 * @type {number}
 * @private
 */
pstj.graphics.Timeline.prototype.scrollValue_ = 0;

/**
 * @type {number}
 * @private
 */
pstj.graphics.Timeline.prototype.scaleFactor_ = 1;

/**
 * @type {number}
 */
pstj.graphics.Timeline.prototype.cursorHeight = 60;

/**
 * @type {number}
 * @private
 */
pstj.graphics.Timeline.prototype.currentTime_ = 0;

/**
 * @type {number}
 * @private
 */
pstj.graphics.Timeline.prototype.initialRatio_;

/**
 * @type {boolean}
 * @private
 */
pstj.graphics.Timeline.prototype.enabled_ = true;

// Define the properties of the instance based on configuration in runtime
// (should have been provided before the compiled script) as a mixin of the
// final configuration of items above (pstj.graphics.Timeline.*).

/**
 * @type {string}
 */
pstj.graphics.Timeline.prototype.tlFontFace = goog.asserts.assertString(
  pstj.configure.getRuntimeValue('FONT_FACE', pstj.graphics.Timeline.FONT_FACE_,
  pstj.graphics.Timeline.PREFIX_));

/**
 * @type {string}
 */
pstj.graphics.Timeline.prototype.tlBackgroundColor = goog.asserts.assertString(
  pstj.configure.getRuntimeValue('BACKGROUND_COLOR',
  pstj.graphics.Timeline.BACKGROUND_COLOR_, pstj.graphics.Timeline.PREFIX_));

/**
 * @type {string}
 */
pstj.graphics.Timeline.prototype.tlScaleBackgroundColor = goog.asserts
  .assertString(pstj.configure.getRuntimeValue('SCALE_BACKGROUND_COLOR',
  pstj.graphics.Timeline.SCALE_BACKGROUND_COLOR_,
  pstj.graphics.Timeline.PREFIX_));

/**
 * @type {string}
 */
pstj.graphics.Timeline.prototype.tlCursorColor = goog.asserts.assertString(
  pstj.configure.getRuntimeValue('CURSOR_COLOR',
  pstj.graphics.Timeline.CURSOR_COLOR_, pstj.graphics.Timeline.PREFIX_));

/**
 * @type {string}
 */
pstj.graphics.Timeline.prototype.tlCursorBackgroundColor = goog.asserts
  .assertString(pstj.configure.getRuntimeValue('CURSOR_BACKGROUND_COLOR',
  pstj.graphics.Timeline.CURSOR_BACKGROUND_COLOR_,
  pstj.graphics.Timeline.PREFIX_));

/**
 * @type {string}
 */
pstj.graphics.Timeline.prototype.tlTextColor = goog.asserts.assertString(
  pstj.configure.getRuntimeValue('TEXT_COLOR',
  pstj.graphics.Timeline.TEXT_COLOR_, pstj.graphics.Timeline.PREFIX_));

/**
 * @type {string}
 */
pstj.graphics.Timeline.prototype.tlDelimiterColor = goog.asserts.assertString(
  pstj.configure.getRuntimeValue('DELIMITER_COLOR',
  pstj.graphics.Timeline.DELIMITER_COLOR_, pstj.graphics.Timeline.PREFIX_));

/**
 * @type {number}
 * @private
 */
pstj.graphics.Timeline.prototype.duration_ = goog.asserts.assertNumber(
  pstj.configure.getRuntimeValue('MAIN_PERIOD',
  pstj.graphics.Timeline.MAIN_PERIOD_, pstj.graphics.Timeline.PREFIX_));

/**
 * @type {number}
 */
pstj.graphics.Timeline.prototype.tlMaxScaleFactor = goog.asserts.assertNumber(
  pstj.configure.getRuntimeValue('MAX_SCALE_FACTOR',
  pstj.graphics.Timeline.MAX_SCALE_FACTOR_, pstj.graphics.Timeline.PREFIX_));

/**
 * @type {number}
 */
pstj.graphics.Timeline.prototype.tlScaleHeight = goog.asserts.assertNumber(
  pstj.configure.getRuntimeValue('SCALE_HEIGHT',
  pstj.graphics.Timeline.SCALE_HEIGHT_, pstj.graphics.Timeline.PREFIX_));

// End runtime configuration.
//

/** @inheritDoc */
pstj.graphics.Timeline.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.canvas_ = new pstj.graphics.Canvas(this.getElement());
  this.draw_ = new pstj.graphics.Draw(this.canvas_.getContext());
  this.setupDrawOptions_();

  this.getHandler().listen(this.getCanvas(), goog.events.EventType.RESIZE,
    this.createCache);

  this.getHandler().listen(this.getContentElement(),
    goog.events.EventType.CLICK, this.handleMouseClick);

  this.createCache();
  this.update();
};

/**
 * Makes sure that the run time configurable drawing options are applyed to
 *   the draw abstraction.
 * @private
 */
pstj.graphics.Timeline.prototype.setupDrawOptions_ = function() {
  this.draw_.setFont(this.tlFontFace);
  this.draw_.setTextColor(this.tlTextColor);
};

/**
 * Sets the state of the timeline. In disabled mode it should not accept any
 *   events and should act as if it is not there however it should still
 *   updates itself.
 * @param {boolean} enable If true will set the state to enabled.
 */
pstj.graphics.Timeline.prototype.setEnabled = function(enable) {
  if (enable != this.enabled_) {
    this.enabled_ = enable;
    goog.dom.classlist.toggle(this.getElement(), goog.getCssName('disabled'));
  }
};

/**
 * Getter for the maximum value possible to be set as scroll value in the
 *   view that matches the current scale factor (i.e. the larger the scale,
 *   the larger the scroll value could go).
 * @return {number} The maximum scroll value allowed based on the current state.
 */
pstj.graphics.Timeline.prototype.getMaximumScrollValue = function() {
  return Math.max(0, this.getDuration() - this.getWindowVisibleTime_());
};

/**
 * Getter for the current duration that is fractioned in the view. This is the
 * duration that is the maximum time visualized (when scale factor == 1).
 * @return {number} The duration in seconds.
 */
pstj.graphics.Timeline.prototype.getDuration = function() {
  return this.duration_;
};

/**
 * Accessors for the canvas used, but abstracted to remove complexity from
 * the logic of this class.
 * @return {pstj.graphics.Canvas} The canvas class.
 */
pstj.graphics.Timeline.prototype.getCanvas = function() {
  return this.canvas_;
};

/**
 * Returns the actual canvas DOM element used.
 * @return {Element} The canvas element.
 */
pstj.graphics.Timeline.prototype.getContentElement = function() {
  return this.canvas_.getCanvas();
};

/**
 * Getter for the drawing adapter. This might be useful for the overloading
 *   classes if they need access to the same context and same drawing
 *   subroutines and allows them to utilize them. They can as well use their
 *   own and bind to their values by calling getCanvas().getContext() and
 *   instantiating a new draw abstraction or draw directly.
 * @return {pstj.graphics.Draw} The abstracted drawing utility.
 */
pstj.graphics.Timeline.prototype.getDrawAdaptor = function() {
  return this.draw_;
};

/**
 * Getter for the current time in the time line. The time will match the
 *   cursor showing the current time stamp.
 * @return {number} The current time in seconds as offset from 0:00 hours.
 */
pstj.graphics.Timeline.prototype.getCurrentTime = function() {
  return this.currentTime_;
};

/**
 * Sets the current time in the time line. It will also update the view as
 *   to position the current time cursor.
 * @param {number} time The time to set (in seconds).
 */
pstj.graphics.Timeline.prototype.setCurrentTime = function(time) {
  if (time < 0) time = 0;
  if (time > this.duration_) time = this.duration_;
  if (this.currentTime_ != time) {
    this.currentTime_ = time;
    this.update();
  }
};

/**
 * Set the scale factor of the view using a percentage scale. This is a
 *   utility method.
 * @param {number} percent The percent (or value of the scale scale of 0 -
 *   100) to use to calculate a scale factor based on the maximum allowed
 *   scale factor.
 */
pstj.graphics.Timeline.prototype.setScalePercent = function(percent) {
  if (percent == 0) this.setScaleFactor(1);
  else {
    var scalefactor = (this.scaleCalculationCashe_ * percent) << 0;
    scalefactor = scalefactor | 1;
    this.setScaleFactor(scalefactor);
  }
};

/**
 * Sets the value of the scale factor. Should be between 1 and the maximum
 *   scale factor configured.
 * @param {number} value The scale factor to apply to the view.
 */
pstj.graphics.Timeline.prototype.setScaleFactor = function(value) {
  if (value < 1 || value > this.tlMaxScaleFactor) return;
  if (this.scaleFactor_ != value) {
    this.scaleFactor_ = value;
    this.dispatchEvent(pstj.graphics.Timeline.EventType.SCALE_CHANGE);
    this.update();
  }
};

/**
 * Sets the current scroll value. The possible values should be bound to
 *   0..N where N is the maximum scroll value as calculated by
 *   #getMaximumScrollValue as if executed with the current scale factor in
 *   mind.
 * @param {number} value The value of the scroll to use.
 */
pstj.graphics.Timeline.prototype.setScrollValue = function(value) {
  this.scrollValue_ = value;
  this.update();
};

/**
 * Provides chance to subclasses to execute drawing operations before the
 *   current time marker is drawn.
 * @param {number} ts The time stamp as provided by the animation scheduler.
 * @return {boolean} True if the canvas will need another update for any
 *   reason.
 * @protected
 */
pstj.graphics.Timeline.prototype.drawsBeforeMarker = goog.functions.FALSE;

/**
 * Provides chance to subclasses to execute drawing operations after the
 *   current time marker is drawn.
 * @param {number} ts The time stamp as provided by the animation scheduler.
 * @return {boolean} True if the canvas will need another update for any
 *   reason.
 * @protected
 */
pstj.graphics.Timeline.prototype.drawsAfterMarker = goog.functions.FALSE;

/**
 * Perform the actual drawing on the canvas. This method should not be
 *   invoked directly, instead the animation.update should be used.
 * @param {number} ts The time stamp as generated by the animation
 *   subroutine.
 * @return {boolean} Should return true only if after the drawing is
 *   performed there is reason to get redrawn again (for example animation
 *   is sequenced).
 * @protected
 */
pstj.graphics.Timeline.prototype.draw = function(ts) {
  // draw backgrounds.
  this.getDrawAdaptor().rect(0, 0, this.width_, this.height_,
    this.tlBackgroundColor);

  this.getDrawAdaptor().rect(0, 0, this.width_, this.tlScaleHeight,
    this.tlScaleBackgroundColor);
  // actual timeline drawing.
  var x;
  var sec;
  var drawDigitsIn = 0;
  var y2 = this.height_;

  // Calculate the step in which to put the labels for fragment delimiter.
  while (this.shouldUseStep_(pstj.graphics.Timeline.STEPS[drawDigitsIn]) > 50) {
    drawDigitsIn++;
  }
  drawDigitsIn--;


  var usedStep = this.getSmallestStepApplicable();
  var first_step_position = this.timeToX(0);
  var step_size_in_pixels = this.timeToX(
    pstj.graphics.Timeline.STEPS[usedStep]) - first_step_position;

  sec = Math.abs(((first_step_position / step_size_in_pixels) << 0) *
    pstj.graphics.Timeline.STEPS[usedStep]);
  x = this.timeToX(sec);


  // Draw the time fragment delimiter, including labels.
  while (x < this.width_ && sec < this.getDuration()) {
    if (x >= 0) {
      var iter = 0;
      while (iter < pstj.graphics.Timeline.STEPS.length) {
        if (sec % pstj.graphics.Timeline.STEPS[iter] == 0) break;
        iter++;
      }
      this.getDrawAdaptor().line(x,
        this.tlScaleHeight - pstj.graphics.Timeline.ANCHOR_SIZE_[iter],
        x, y2, this.tlDelimiterColor);
      if (drawDigitsIn >= iter) {
        this.getDrawAdaptor().text(pstj.date.utils.getTimestamp(sec), x - 20,
          10, this.tlDelimiterColor);
      }
    }
    x = x + step_size_in_pixels;
    sec = sec + pstj.graphics.Timeline.STEPS[usedStep];
  }
  // Invoke any drawings that has to be performed before the marker is
  // drawn.
  var beforeDraws = this.drawsBeforeMarker(ts);

  // Draw the marker for current time.
  x = this.timeToX(this.getCurrentTime());
  this.getDrawAdaptor().line(x, 0, x, this.height_, this.tlCursorColor);

  this.getDrawAdaptor().rect(x + 1, 11, 50, 11,
    this.tlCursorBackgroundColor);

  this.getDrawAdaptor().text(pstj.date.utils.getTimestamp(
    this.getCurrentTime()), x + 3, 20, this.tlCursorColor);

  var afterDraws = this.drawsAfterMarker(ts);

  // Tell the animation subroutine that the canvas is now clear and does not
  // need redrawing.
  return beforeDraws || afterDraws || false;
};

/**
 * Hide the asynchronous implementation behind a common method.
 */
pstj.graphics.Timeline.prototype.update = function() {
  this.animation_.update();
};

/**
 * Calculates the X position on the canvas for a certain time (in seconds),
 *   considering the scale and scroll values of the canvas and the time
 *   being offset from 0:00 hours.
 * @param  {number} time The second since 0:00 to calculate X for.
 * @return {number}      The calculated X value for that second.
 */
pstj.graphics.Timeline.prototype.timeToX = function(time) {
  if (this.getWindowVisibleTime_() < this.getDuration()) {
    time = time - this.calculateScrollValue();
  }
  return time * this.scaleFactor_ * this.initialRatio_;
};

/**
 * Looks up the time based on a X value on the scale. This is used to find a
 *   time stamp that matches an X position on the canvas, on large scale the
 *   returned number will be rounded, as well as on small scale the value
 *   will be rounded to a full second.
 * @param  {number} x The value of X on the canvas / scale.
 * @return {number} The calculated time for the provided X value.
 */
pstj.graphics.Timeline.prototype.xToTime = function(x) {
  var timeShift = Math.max(0, this.scrollValue_);
  return Math.round((x / (this.scaleFactor_ * this.initialRatio_)) +
    timeShift);
};

/**
 * Handle the mouse clicks in the canvas. Method is public so it can be
 *   overridden in subclasses.
 * @protected
 * @param {goog.events.Event} ev The CLICK event from the browser.
 */
pstj.graphics.Timeline.prototype.handleMouseClick = function(ev) {
  this.setCurrentTime(this.xToTime(ev.offsetX));
};

/**
 * Utility function to figure out the smallest step that is applicable on
 *   the canvas. The calculation assumes at least 4 pixels space to be a big
 *   enough step in order for the drawing to be readable.
 * @protected
 * @return {number} The index of the time difference (step) that is
 *   considered applicable on the canvas with the current scale factor
 *   applied.
 */
pstj.graphics.Timeline.prototype.getSmallestStepApplicable = function() {
  for (var i = 0; i < pstj.graphics.Timeline.STEPS.length; i++) {
    var s1 = 0, s2 = pstj.graphics.Timeline.STEPS[i];
    var x1 = this.timeToX(s1), x2 = this.timeToX(s2);
    if ((x2 - x1) <= 4) return i - 1;
  }
  return i - 1;
};

/**
 * Draws a period in the time line.
 * @param {number} start The start of the period as time offset from 0:00.
 * @param {number} end The end of the period as time offset from 0:00.
 * @param {string} color The color to use to fill in the rectangular
 *   representation of the period.
 * @protected
 */
pstj.graphics.Timeline.prototype.drawPeriod = function(start, end, color) {
  var x1 = this.timeToX(start);
  var x2 = this.timeToX(end);

  // When start is before the start limit but end is after it
  if (x1 < 0 && x2 > 0) x1 = 0;

  // When end is after end limit
  if (x2 > this.width_) x2 = this.width_;

  // If x is still < 0 - the object is not in visible time frame.
  if (x1 < 0) return;

  // If x is > size the object is not in visible time frame.
  if (x1 > this.width_) return;

  this.getDrawAdaptor().rect(x1, this.tlScaleHeight, x2 - x1,
    this.height_, color, true);
};

/**
 * Intentionally export this as calculation function to ease overriding it.
 * @return {number} The current scroll value.
 * @protected
 */
pstj.graphics.Timeline.prototype.calculateScrollValue = function() {
  return this.scrollValue_;
};

/**
 * Returns the visible time i.e. the duration that can fit in the canvas at
 *   the current scale.
 * @return {number} Time in seconds.
 * @private
 */
pstj.graphics.Timeline.prototype.getWindowVisibleTime_ = function() {
  return this.getDuration() / this.scaleFactor_;
};

/**
 * Checks if a certain step (time interval) should be used (i.e. the canvas
 *   has enough pixels for two separate lines of the step considering the
 *   current scale factor).
 * @param  {number} step The interval in seconds to check.
 * @return {number} True if the step fits in the canvas.
 * @private
 */
pstj.graphics.Timeline.prototype.shouldUseStep_ = function(step) {
  return step * this.scaleFactor_ * this.initialRatio_;
};

/**
 * Creates cached values to be used for faster calculation during drawing
 * @protected
 */
pstj.graphics.Timeline.prototype.createCache = function() {
  this.width_ = this.getCanvas().getSize().width;
  this.height_ = this.getCanvas().getSize().height;
  this.scaleCalculationCashe_ = (this.tlMaxScaleFactor - 1) / 100;
  this.initialRatio_ = this.width_ / this.getDuration();
};
