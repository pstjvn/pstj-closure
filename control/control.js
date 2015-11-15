goog.provide('pstj.control.Control');

goog.require('goog.Disposable');
goog.require('goog.array');
goog.require('goog.events.EventHandler');
goog.require('goog.pubsub.TypedPubSub');

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
 *
 * @extends {goog.Disposable}
 */
pstj.control.Control = goog.defineClass(goog.Disposable, {
  /**
   * @param {Object=} opt_scope The default scope to execute the listeners in.
   */
  constructor: function(opt_scope) {
    goog.Disposable.call(this);
    /**
     * The scope to use when handling topics.
     * @type {?Object}
     */
    this.scope_ = opt_scope || this;
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
    /**
     * List of keys for bus scubsriptions we have.
     * @type {Array<number>}
     * @private
     */
    this.busListeners_ = [];
    this.registerDisposable(this.handler_);
  },

  /**
   * Default initializer. Put everything you need to initilize here.
   */
  init: function() {
    this.initialized = true;
  },

  /**
   * Pushes a new publication to the global application bus.
   * @param {!goog.pubsub.TopicId<PAYLOAD>} topic The topic we would like to
   *    push.
   * @param {PAYLOAD} data Data to send with the signal.
   * @template PAYLOAD
   */
  push: function(topic, data) {
    pstj.control.Control.getBus().publish(topic, data);
  },

  /**
   * Listen for updates on a selected topic.
   * @param {!goog.pubsub.TopicId<PAYLOAD>} topic The topic name to listen on.
   * @param {function(PAYLOAD): void} handler Function to be invoked when a
   *     message is published to the given topic.
   * @template PAYLOAD
   * @return {number} The key by which we can unsubscribe.
   */
  listen: function(topic, handler) {
    var key = pstj.control.Control.getBus().subscribe(
        topic, handler, this.scope_);
    this.busListeners_.push(key);
    return key;
  },

  /**
   * Cancels a subscription.
   * @param {number} key The key returned by a 'listen' call.
   */
  cancel: function(key) {
    if (goog.array.remove(this.busListeners_, key)) {
      pstj.control.Control.getBus().unsubscribeByKey(key);
    }
  },

  /**
   * Accessor for the default handler.
   * @return {goog.events.EventHandler}
   */
  getHandler: function() {
    return this.handler_;
  },

  /**
   * Sets the scope of the controller.
   *
   * This allows for global/static controllers to be bound later in the
   * application life to a certain context but still execute control
   * functions before that (i.e. with singleton pattern).
   *
   * @param {!Object} scope The new scope to use.
   */
  setScope: function(scope) {
    this.scope_ = scope;
  },

  /** @inheritDoc */
  disposeInternal: function() {
    goog.base(this, 'disposeInternal');
    goog.array.forEach(this.busListeners_, function(key) {
      pstj.control.Control.getBus().unsubscribeByKey(key);
    });
    goog.array.clear(this.busListeners_);
    this.busListeners_ = null;
    this.handler_ = null;
    this.scope_ = null;
  },

  statics: {
    /**
     * Provides the global application bus.
     * @type {goog.pubsub.TypedPubSub}
     * @private
     * @final
     */
    appBus_: (new goog.pubsub.TypedPubSub()),

    /**
     * Access to the instance for control bus.
     * @return {goog.pubsub.TypedPubSub}
     */
    getBus: function() {
      return pstj.control.Control.appBus_;
    }
  }
});

});  // goog.scope
