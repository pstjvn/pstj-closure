'use strict';
/**
 * @fileoverview Provides convenience wrapper for web worker insantiation.
 *
 * On its own this class does not do much, it is expected to be used when
 * creating message brokers and client/service message buses to communicate with
 * a real world worker application.
 *
 * The broker is expected to be able to keep track of the sent messages and
 * wrap the communication layer via promisses (for single initiation messages)
 * or via message bus topics (for multi initiation messages i.e. when both app
 * and worker app can initiate new commiunication)
 *
 * @author regardingscot@gmai.com (Peter StJ)
 */


goog.provide('pstj.worker.WorkerClient');

goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('pstj.worker.Event');
goog.require('pstj.worker.IWorker');

goog.scope(function() {

/**
 * Implements wrapper around native web wroker so the user does not have to
 * setup anything and just use a worker application and its listen and post
 * methods.
 * @implements {pstj.worker.IWorker}
 */
pstj.worker.WorkerClient = class extends goog.events.EventTarget {
  /** @param {string} url The url of the worker app. */
  constructor(url) {
    super();
    /**
     * @protected
     * @type {Worker}
     */
    this.worker = new Worker(url);
    this.worker.addEventListener(goog.events.EventType.MESSAGE,
                                 goog.bind(this.handleNativeMessage_, this),
                                 false);
  }

  /**
   * Handles the native worker message events and wraps them in the closure
   * event system. On top of this another layer would be to have message bus
   * system or brokarage sistem that can handle structures messages.
   *
   * @param  {!Event} event The native event.
   * @private
   */
  handleNativeMessage_(event) {
    this.dispatchEvent(new pstj.worker.Event(this, event.data));
  }

  /**
   * Allow the consumers to send messages over to the worker application. Note
   * that the message must be serialized beforehand as this class does not
   * suport message convergence.
   * @param {string} data The data to send to the woker app.
   */
  send(data) { this.worker.postMessage(data); }
};

});  // goog.scope
