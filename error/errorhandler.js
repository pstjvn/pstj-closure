goog.provide('pstj.error.throw');
goog.provide('pstj.error.ErrorHandler');
goog.provide('pstj.error.ErrorHandler.Errors ');

goog.require('pstj.control.Base');
goog.require('goog.pubsub.PubSub');

/**
 * @fileoverview Provides unified mechanizm for hanling errors in the code
 *   that happen after successful initialization (i.e. errors related to the
 *   network stack and user interaction). The model is designed in such a way
 *   as to allow the developer to direct the error to the throw method and
 *   exoect the developer to initialize an error handling class and over ride
 *   its hanleError method in order to implement hadling for all known errors.
 *
 * Example:
 * <pre>
 * myhandler = function() {goog.base(this)};
 * myhandler.prototype.handleError = function(a,b,c) {};
 *
 * // app code
 * errhandler = myhandler.getInstance();
 * // error in execution
 * if (err) {
 *   pstj.error.throw(pstj.error.ErrorHandler.Error.HTTP, 404, 'Not found');
 * }
 * </pre>
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Base class that provides error handling. For the handling to happen all
 *   errors must be directed to the message bus of the namespace.
 * @constructor
 * @extends {pstj.control.Base}
 */
pstj.error.ErrorHandler = function() {
  goog.base(this);
  pstj.error.Bus.subscibe(pstj.error.Bus.Topic.ERROR, goog.bind
    this.handleError, this));
};
goog.inherits(pstj.error.ErrorHandler, pstj.control.Base);
goog.addSingletonGetter(pstj.error.ErrorHandler);

/**
 * The type of errors to handle.
 * @enum {number}
 */
pstj.error.ErrorHandler.Error = {
  HTTP: 0, // http error (4xx)
  SERVER: 1, // server logical error (i.e. 5xx)
  JSON: 2, // served json cannot be parsed
  STRUCTURE: 3, // errors coming from the status in the json message,
                // application specific
  RUNTIME: 4, // user action triggers something that we do not know how to
              // handle automatically and needs user interaction for fixing it.
  NO_DATA: 5 // timeout on important requests, loading etc.
};

/**
 * @type {goog.pubsub.PubSub}
 */
pstj.error.ErrorHandler.bus = new goog.pubsub.PubSub();

/**
 * @const
 * @type {string}
 */
pstj.error.ErrorHandler.Topic = 'ERROR';

goog.scope(function() {

  var _ = pstj.error.ErrorHandler.prototype;

  /**
   * Handles for the errors coming on the message bus. This method is designed
   *   to be overriden by application logic class.
   * @param {pstj.error.ErrorHandler.Errors} error_index The type of the
   *   error.
   * @param {number=} status_id The status of the error (for json statuses)
   * @param {string=} message The mesage of the error if any.
   * @protected
   */
  _.handleError = function(error_index, status_id, message) {};
});

/**
 * Specialized method to notify the error handler instance for an error.
 * @param {pstj.error.ErrorHandler.Errors} error_index The type of the error.
 * @param {number=} status_id The status of the error (for json statuses)
 * @param {string=} message The mesage of the error if any.
 */
pstj.error.throw = function(error_index, status_id, message) {
  pstj.error.ErrorHandler.bus.publish(pstj.error.ErrorHandler.Topic,
    error_index, status_id, message);
};
