goog.provide('pstj.worker.IWorker');

/** @suppress {extraRequire} */
goog.require('goog.events.Listenable');


/**
 * @interface
 * @extends {goog.events.Listenable}
 */
pstj.worker.IWorker = function() {};


/**
 * Provides means to send data to the other worker's side.
 * @param  {string} data The data represented as string.
 */
pstj.worker.IWorker.prototype.send = function(data) {};
