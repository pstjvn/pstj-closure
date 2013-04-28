goog.provide('pstj.widget.Progress');

goog.require('goog.asserts');
goog.require('goog.async.Delay');
goog.require('goog.events.EventType');
goog.require('pstj.math.utils');
goog.require('pstj.ui.Async');
goog.require('pstj.widget');

/**
 * @fileoverview Provides initial loading progress bar to be used during
 *   application initialization. It supports custom text on top of the
 *   progress bar.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * My new class description
 * @constructor
 * @extends {pstj.ui.Async}
 */
pstj.widget.Progress = function() {
  goog.base(this);
  /**
   * @private
   * @type {number}
   */
  this.itemsDone_ = 0;
  /**
   * @private
   * @type {string}
   */
  this.text_ = '';
  /**
   * The delayed action of readyness.
   * @type {goog.async.Delay}
   * @private
   */
  this.delay_ = new goog.async.Delay(function() {
    this.dispatchEvent(goog.events.EventType.LOAD);
    goog.dispose(this);
  }, 800, this);

  this.registerDisposable(this.delay_);
};
goog.inherits(pstj.widget.Progress, pstj.ui.Async);

goog.scope(function() {

  var _ = pstj.widget.Progress.prototype;

  /** @inheritDoc */
  _.getTemplate = function() {
    return pstj.widget.progress({
      text: this.text_
    });
  };

  /** @inheritDoc */
  _.setModel = function(model) {
    goog.asserts.assertNumber(model,
      'Model should always be number for this widget');
    this.delay_.stop();
    goog.base(this, 'setModel', model);
  };

  /**
   * Notify the widget that one item has been completed.
   */
  _.progress = function() {
    this.itemsDone_++;
    this.update();
    if (this.itemsDone_ == this.getModel()) {
      this.delay_.start();
    }
  };

  /**
   * Allows the developer to set custom text on top of the progress bar.
   * @param {string} text The text to use.
   */
  _.setContent = function(text) {
    this.text_ = text;
  };

  /** @inheritDoc */
  _.getContentElement = function() {
    return /** @type {!Element} */ (
      this.querySelector('.' + goog.getCssName('pstj-widget-progress-bar')));
  };

  /** @inheritDoc */
  _.draw = function(ms) {
    var model = goog.asserts.assertNumber(this.getModel(),
      'Model should be a number!');
    var percent = pstj.math.utils.getPercentFromValue(this.itemsDone_, model);
    this.getContentElement().style.width = percent + '%';
    return false;
  };

});
