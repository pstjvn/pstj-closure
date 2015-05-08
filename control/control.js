goog.provide('pstj.control.Control');

goog.require('goog.events.EventHandler');
goog.require('goog.pubsub.PubSub');

goog.scope(function() {


/**
* Defines the base class for controllers. The controller abstraction is aimed
* to to provide externalized control over the UI components and encomapses
* any business logic that stains from the default UI element behavior.
*
* The control instances are expected to communicate via a pub-sub system (as
* opposite from components/UI controls which communicate via the event system).
*
* In an applications tructure the control instance could be responsible for
* only one UI instance, for no UI instance or for a group (usually nested) UI
* instances. A control instance is also expected to stop all UI events that are
* to be expected from its UI 'children' and propagate business logic to other
* controls if the instance itself is not ready / capable to handle it.
*
* No child/parent connection should be used between the control instances and
* all control instances should filter the bus signals by the emitter.
*/
pstj.control.Control = goog.defineClass(null, {
  constructor: function() {
    /**
     * If the control have been initialized.
     * @type {boolean}
     */
    this.initialized = false;
    /**
     * Default event handler for dealing with events from compisited components.
     * @type {goog.events.EventHandler}
     * @private
     */
    this.handler_ = new goog.events.EventHandler(this);
  },

  /**
   * Default initializer. Put everything you need to initilize here.
   */
  init: function() {
    this.initialized = true;
  },

  /**
   * Pushes a new publication to the global application bus.
   * @param {string} topic The topic we would like to push.
   * @param {*=} opt_data Data to send with the signal.
   */
  push: function(topic, opt_data) {
    pstj.control.Control.getBus().publish(topic, opt_data);
  },

  /**
   * Listen for updates on a selected topic.
   * @param {string} topic The topic name to listen on.
   * @param {Function} handler The method handler.
   */
  listen: function(topic, handler) {
    pstj.control.Control.getBus().subscribe(topic, handler, this);
  },

  /**
   * Accessor for the default handler.
   * @return {goog.events.EventHandler}
   */
  getHandler: function() {
    return this.handler_;
  },

  statics: {
    /**
     * Provides the global application bus.
     * @type {goog.pubsub.PubSub}
     * @private
     * @final
     */
    appBus_: (new goog.pubsub.PubSub()),

    /**
     * Access to the instance for control bus.
     * @return {goog.pubsub.PubSub}
     */
    getBus: function() {
      return pstj.control.Control.appBus_;
    }
  }
});

});  // goog.scope
