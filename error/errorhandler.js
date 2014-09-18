/**
 * @fileoverview Provides unified mechanizm for hanling errors in the code
 *   that happen after successful initialization (i.e. errors related to the
 *   network stack and user interaction). The model is designed in such a way
 *   as to allow the developer to direct the error to the throw method and
 *   expect the developer to initialize an error handling class and over ride
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

goog.provide('pstj.error');
goog.provide('pstj.error.ErrorHandler');

goog.require('goog.pubsub.PubSub');
goog.require('pstj.control.Base');



/**
 * Base class that provides error handling. For the handling to happen all
 *   errors must be directed to the message bus of the namespace.
 * @constructor
 * @extends {pstj.control.Base}
 */
pstj.error.ErrorHandler = function() {
  goog.base(this);
  pstj.error.ErrorHandler.Bus.subscribe(pstj.error.ErrorHandler.Topic,
      goog.bind(this.handleError, this));
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
 * Alias for the error types.
 * @enum {number}
 */
pstj.error.Type = pstj.error.ErrorHandler.Error;


/**
 * @type {goog.pubsub.PubSub}
 */
pstj.error.ErrorHandler.Bus = new goog.pubsub.PubSub();


/**
 * @const
 * @type {string}
 */
pstj.error.ErrorHandler.Topic = 'ERROR';


/**
 * Handles for the errors coming on the message bus. This method is designed
 *   to be overriden by application logic class.
 * @param {pstj.error.ErrorHandler.Error} error_index The type of the
 *   error.
 * @param {number=} opt_status_id The status of the error (for json statuses).
 * @param {string=} opt_message The mesage of the error if any.
 * @protected
 */
pstj.error.ErrorHandler.prototype.handleError = function(error_index,
    opt_status_id, opt_message) {};


/**
 * Specialized method to notify the error handler instance for an error.
 * @param {pstj.error.ErrorHandler.Error} error_index The type of the error.
 * @param {number=} opt_status_id The status of the error (for json statuses).
 * @param {string=} opt_message The mesage of the error if any.
 */
pstj.error.throwError = function(error_index, opt_status_id, opt_message) {
  pstj.error.ErrorHandler.Bus.publish(pstj.error.ErrorHandler.Topic,
      error_index, opt_status_id, opt_message);
};
