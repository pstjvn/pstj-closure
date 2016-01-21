'use strict';

goog.provide('pstj.worker.WorkerService');

goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('pstj.worker.Event');
goog.require('pstj.worker.IWorker');

/**
 * Implements wrapper around native web wroker so the user does not have to
 * setup anything and just use a worker service and its listen and send
 * (postMessage) methods.
 * @implements {pstj.worker.IWorker}
 */
pstj.worker.WorkerService = class extends goog.events.EventTarget {
  /**
   * @param  {DedicatedWorkerGlobalScope} scope
   */
  constructor(scope) {
    super();
    /**
     * @protected
     * @type {DedicatedWorkerGlobalScope}
     */
    this.worker = scope;
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
   * Allow the consumers to send messages over to the client application. Note
   * that the message must be serialized beforehand as this class does not
   * suport message convergence.
   * @param  {string} data The data to send to the woker app.
   */
  send(data) { this.worker.postMessage(data); }
}
