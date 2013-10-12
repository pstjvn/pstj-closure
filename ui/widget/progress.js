/**
 * @fileoverview Provides initial loading progress bar to be used during
 *   application initialization. It supports custom text on top of the
 *   progress bar.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.widget.Progress');
goog.provide('pstj.widget.ProgressTemplate');

goog.require('goog.asserts');
goog.require('goog.async.Delay');
goog.require('goog.events.EventType');
goog.require('pstj.math.utils');
goog.require('pstj.templates');
goog.require('pstj.ui.Async');
goog.require('pstj.ui.Template');



/**
 * Provides the default progress bar template implementation.
 * @constructor
 * @extends {pstj.ui.Template}
 */
pstj.widget.ProgressTemplate = function() {
  goog.base(this);
};
goog.inherits(pstj.widget.ProgressTemplate, pstj.ui.Template);
goog.addSingletonGetter(pstj.widget.ProgressTemplate);


/** @inheritDoc */
pstj.widget.ProgressTemplate.prototype.getTemplate = function(model) {
  return pstj.templates.progress(model);
};


/** @inheritDoc */
pstj.widget.ProgressTemplate.prototype.generateTemplateData = function(comp) {
  return {
    text: comp.getContent()
  };
};


/** @inheritDoc */
pstj.widget.ProgressTemplate.prototype.getContentElement = function(comp) {
  return comp.querySelector('.' + goog.getCssName('pstj-widget-progress-bar'));
};



/**
 * Provides an application loading progress bar widget.
 * @constructor
 * @extends {pstj.ui.Async}
 * @param {pstj.ui.Template=} opt_template Options template to use to construct
 *   the DOM.
 */
pstj.widget.Progress = function(opt_template) {
  goog.base(this, opt_template || pstj.widget.ProgressTemplate.getInstance());
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
  }, 800, this);

  this.registerDisposable(this.delay_);
};
goog.inherits(pstj.widget.Progress, pstj.ui.Async);


/** @inheritDoc */
pstj.widget.Progress.prototype.setModel = function(model) {
  goog.asserts.assertNumber(model,
      'Model should always be number for this widget');
  this.delay_.stop();
  goog.base(this, 'setModel', model);
};


/**
 * Notify the widget that one item has been completed.
 */
pstj.widget.Progress.prototype.progress = function() {
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
pstj.widget.Progress.prototype.setContent = function(text) {
  this.text_ = text;
};


/**
 * Getter for the content of the progress.
 * @return {string}
 */
pstj.widget.Progress.prototype.getContent = function() {
  return this.text_;
};


/** @inheritDoc */
pstj.widget.Progress.prototype.draw = function(ms) {
  var model = goog.asserts.assertNumber(this.getModel(),
      'Model should be a number!');
  var percent = pstj.math.utils.getPercentFromValue(this.itemsDone_, model);
  this.getContentElement().style.width = percent + '%';
  return false;
};
