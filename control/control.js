goog.provide('pstj.control.Control');

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
  /**
  * @constructor
  * @param {string=} opt_topic Optional name topic for the bus.
  * @struct
  */
  constructor: function(opt_topic) {
    this.topic = opt_topic || 'default';
  },


  /**
  * Handles the events from the components/UI controls.
  * By default it will stop the event propagation and elevate it to the bus
  * system for the other controls to receive it.
  * @param {goog.events.Event} e The event (could be any kind).
  * @protected
  */
  handleEvents: function(e) {
    // by default all events are fired to the bus
    e.stopPropagation();
    pstj.control.getBus().publish(this.topic, e);
  }
});


/**
* @type {goog.pubsub.PubSub}
* @private
* @final
*/
pstj.control.Control.bus_ = new goog.pubsub.PubSub();


/**
* Access to the instance for control bus.
* @return {goog.pubsub.PubSub}
*/
pstj.control.getBus = function() {
  return pstj.control.Control.bus_;
};

});  // goog.scope
