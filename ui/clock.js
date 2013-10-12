/**
 * @fileoverview Provides UI for a clock. Represents a very simplistic UI
 * component that simply updates the rendered time each time the time provider
 * calls its set method. The direct use of this class is discouraged, instead
 * extend it or better yet use it only as an example on implementing the IClock
 * interface.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.Clock');

goog.require('goog.ui.Component');
goog.require('pstj.ds.IClock');
goog.require('pstj.ds.TimeProvider');



/**
 * Class that implements the IClock interface, that is an UI representation of
 *   a system clock that can expose its setTime method to be called by the
 *   time provider and update the UI that presents the current time to the
 *   user.
 * @constructor
 * @implements {pstj.ds.IClock}
 * @extends {goog.ui.Component}
 * @param {goog.dom.DomHelper=} opt_dh Optional dom helper.
 */
pstj.ui.Clock = function(opt_dh) {
  goog.base(this, opt_dh);
  /**
   * Flag indicating if the instance is registered to receive time updates from
   *   the global time provider
   * @type {!boolean}
   * @private
   */
  this.registeredForTimeUpdate_ = false;
};
goog.inherits(pstj.ui.Clock, goog.ui.Component);


/** @inheritDoc */
pstj.ui.Clock.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  if (!this.registeredForTimeUpdate_) {
    this.registeredForTimeUpdate_ = true;
    pstj.ds.TimeProvider.getInstance().addSubscriber(this);
  }
};


/** @inheritDoc */
pstj.ui.Clock.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  if (this.registeredForTimeUpdate_) {
    this.registeredForTimeUpdate_ = false;
    pstj.ds.TimeProvider.getInstance().removeSubscriber(this);
  }
};


/** @inheritDoc */
pstj.ui.Clock.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  if (this.registeredForTimeUpdate_) {
    pstj.ds.TimeProvider.getInstance().removeSubscriber(this);
  }
  delete this.registeredForTimeUpdate_;
};


/**
 * Implementation of the IClock interface.
 * @param {number} time The time in the global time provider as it was set to
 *   during the last update.
 */
pstj.ui.Clock.prototype.setTime = function(time) {
  if (this.isInDocument()) {
    this.getContentElement().innerHTML = (new Date(time)).toString();
  }
};
