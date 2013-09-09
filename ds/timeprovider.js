/**
  * @fileoverview Provides global clock with the current system time. The time
  *   provider could be used to provide time at application level and multiple
  *   instances can register for update on it. It is guaranteed to populate the
  *   same time on all instances, however it will update only once per minute
  *   by default to preserve resources.
  *
  * The update time can be configured at run time by providing a global
  *   variable with the name TIMEPROVIDER_UPDATE_INTERVAL and set it to numeric
  *   value (integer) - the interval in milliseconds.
  *
  * If you need a clock that you can query for the time instead of time updates
  *   being pushed to your instances, consider using the SpeedClock instead and
  *   use the speed of '1'.
  *
  * @author regardingscot@gmail.com (Peter StJ)
  */

goog.provide('pstj.ds.TimeProvider');

goog.require('goog.array');
goog.require('pstj.configure');



/**
 * Provides consistent time across the application with updates once every 60
 *   seconds or another compiled in interval. To subscribe for update your
 *   subscribing object should implement the {@see pstj.ds.IClock} interface.
 *   Do not instantiate this class, instead use the instance getter.
 * @constructor
 */
pstj.ds.TimeProvider = function() {
  /**
   * The objects that want to receive update of the time every 60 seconds.
   * @type {Array.<pstj.ds.IClock>}
   * @private
   */
  this.subscribers_ = [];
  /**
   * The last detected time stamp, is a subscribed is added in between ticks it
   *   will receive this time to be on the same time stamp as the rest of the
   *   subscribers.
   * @type {number}
   * @private
   */
  this.lastIssuedTime_ = 0;
};


/**
 * The name of the global variable used to configure the behaviour on run time.
 * @type {string}
 * @protected
 */
pstj.ds.TimeProvider.GLOB = 'TIMEPROVIDER_UPDATE_INTERVAL';


/**
 * The interval to use to update clocks in the system. The value is protected
 *   in order to allow the developer to subtype the time provider with
 *   different time value. Another option is to use global configuration for
 *   the same purpose. Default value is 60 seconds.
 * @type {number}
 * @protected
 */
pstj.ds.TimeProvider.DefaultInterval = 60000;


/**
 * Subscribe an object that implements the Clock interface to the global
 *   clock.
 * @param {!pstj.ds.IClock} obj Object instance that has setTime method.
 */
pstj.ds.TimeProvider.prototype.addSubscriber = function(obj) {
  goog.array.insert(this.subscribers_, obj);
  obj.setTime(this.lastIssuedTime_);
};


/**
 * Un-subscribe an object that implements the IClock interface from the global
 *   clock provider.
 * @param  {!pstj.ds.IClock} obj Object instance that has previously been
 *   subscribed to the global clock.
 */
pstj.ds.TimeProvider.prototype.removeSubscriber = function(obj) {
  goog.array.remove(this.subscribers_, obj);
};


/**
 * Tick handler, this is a private method that is called each time the ticker
 *   is run, it gets the current time and populates it to the subscribed
 *   objects assuming all objects implement IClock interface correctly.
 * @protected
 */
pstj.ds.TimeProvider.prototype.onTick = function() {
  this.lastIssuedTime_ = goog.now();
  var time = this.lastIssuedTime_;
  goog.array.forEach(this.subscribers_, function(obj) {
    obj.setTime(time);
  });
};


/**
 * Starts the clock, this is - enable its tick handler to run every N
 *   milliseconds.
 * @protected
 */
pstj.ds.TimeProvider.prototype.start = function() {
  this.lastIssuedTime_ = goog.now();
  var num = (/** type {number} */ +(pstj.configure.getRuntimeValue(
      pstj.ds.TimeProvider.GLOB, pstj.ds.TimeProvider.DefaultInterval)));
  goog.global.setInterval(goog.bind(this.onTick, this), num);
};


/**
 * Instance getter with custom implementation. It is provided in order to
 *   allow global access to all using parts of your code and start the tick
 *   automatically. The instance is lazily created.
 * @return {pstj.ds.TimeProvider} The time provider instance, started.
 */
pstj.ds.TimeProvider.getInstance = (function() {
  var instance_ = null;
  return function() {
    if (instance_ == null) {
      instance_ = new pstj.ds.TimeProvider();
      instance_.start();
    }
    return instance_;
  };
})();
