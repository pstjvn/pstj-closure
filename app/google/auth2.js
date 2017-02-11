goog.provide('pstj.app.google.Auth2');

goog.require('goog.Promise');
goog.require('goog.asserts');
goog.require('goog.log');
goog.require('pstj.app.google.Gapi');


/**
 * Loads and processes AUTH2 with Google.
 */
pstj.app.google.Auth = goog.defineClass(null, {
  constructor: function() {
    /** @private {?goog.Promise<!Object>} */
    this.auth_ = null;
  },

  /**
   * Getter for the promise of auth2 API object.
   *
   * @return {!goog.Promise<!Object>}
   */
  getPromise: function() {
    if (goog.isNull(this.auth_)) {
      this.auth_ =
          pstj.app.google.Gapi.getInstance().getPromise().then(function(gapi) {
            goog.log.info('GAPI available');
            var promise = new goog.Promise(function(resolve, reject) {
              goog.log.info('Start loading auth2');
              gapi['load']('auth2', goog.bind(function() {
                goog.log.info('Auth2 loaded');
                resolve(gapi['auth2']);
              }, this));
            }, this);
            return promise;
          }, this);
    }
    return goog.asserts.assertInstanceof(this.auth_, goog.Promise);
  },

  /** @protected {!goog.debug.Logger} */
  logger: goog.log.getLogger('pstj.app.google.Auth')
});
goog.addSingletonGetter(pstj.app.google.Auth);