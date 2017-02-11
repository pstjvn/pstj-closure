goog.provide('pstj.app.google.Gapi');

goog.require('goog.Promise');
goog.require('goog.asserts');
goog.require('goog.html.TrustedResourceUrl');
goog.require('goog.log');
goog.require('goog.net.jsloader');
goog.require('goog.string.Const');


/**
 * Provides a class based abstraction for loading Google API module.
 */
pstj.app.google.Gapi = goog.defineClass(null, {
  constructor: function() {
    /** @private {?goog.Promise<!Object>} */
    this.gapi_ = null;
    /** @private {!goog.html.TrustedResourceUrl} */
    this.remoteUrl_ = goog.html.TrustedResourceUrl.fromConstant(
        goog.string.Const.from('https://apis.google.com/js/platform.js'));
  },

  /**
   * Obtains the promise that will eventually resolve to the global GAPI
   * object.
   *
   * @return {!goog.Promise<!Object>}
   */
  getPromise: function() {
    if (goog.isNull(this.gapi_)) {
      this.gapi_ = new goog.Promise(function(resolve, reject) {
        goog.log.info(this.logger, 'Start loading library');
        goog.net.jsloader.loadSafe(this.remoteUrl_)
            .addCallback(
                function() {
                  goog.log.info(this.logger, 'Script finished loading');
                  if (goog.isObject(goog.global['gapi'])) {
                    goog.log.info(this.logger, 'GAPI object ready');
                    resolve(goog.global['gapi']);
                  } else {
                    goog.log.error(this.logger, 'Global GAPI object not found');
                    reject('Global GAPI not found');
                  }
                },
                this)
            .addErrback(function(e) {
              goog.log.error(this.logger, 'Script failed to load');
              reject(e);
            }, this);
      }, this);
    }
    return goog.asserts.assertInstanceof(this.gapi_, goog.Promise);
  },

  /** @protected {!goog.debug.Logger} */
  logger: goog.log.getLogger('pstj.app.google.Gapi')
});
goog.addSingletonGetter(pstj.app.google.Gapi);
