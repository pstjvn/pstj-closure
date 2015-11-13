/**
 * @fileoverview Provides app level RPC abstraction. You should always override
 * this class to get a working RPC package.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.app.Rpc');

goog.require('pstj.control.Toast');
goog.require('pstj.resource');


/**
 * Implements the RPC for this app.
 */
pstj.app.Rpc = goog.defineClass(null, {
  constructor: function() {
    /**
     * @private
     * @type {pstj.resource.Resource}
     */
    this.resource_ = null;
  },

  /**
   * @param {pstj.resource.Configuration} config
   */
  configure: function(config) {
    if (goog.isNull(this.resource_)) {
      goog.log.info(this.logger, 'Configuring RPC');
      if (goog.DEBUG) {
        goog.log.info(this.logger, goog.debug.expose(config));
      }
      pstj.resource.configure(config);
      this.resource_ = pstj.resource.getInstance();
      this.registerCallbacks();
    } else {
      throw new Error('Already configured');
    }
  },

  /**
   * @type {goog.debug.Logger}
   * @protected
   */
  logger: goog.log.getLogger('pstj.rpc.Rpc'),

  /**
   * Getter for the underlying resource.
   * @return {pstj.resource.Resource}
   */
  getResource: function() {
    return this.resource_;
  },

  /**
   * Pre-registers the handlers for the default RPC calls.
   * You should not call this directly, but can override it if needed.
   * @protected
   */
  registerCallbacks: function() {},

  /**
   * Provides default error handling. This is usedful if you have no special
   * threatment for a server side error or data error and you need to inform the
   * user.
   * @param {Object<string, *>} packet
   * @protected
   */
  defaultErrorHandler: function(packet) {
    throw new Error('Not implemented');
  }
});
