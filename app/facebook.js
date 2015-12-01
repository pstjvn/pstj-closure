/**
 * @fileoverview Simple conrol to load FB SDK and perform user auth against it.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.app.Facebook');

goog.require('goog.Promise');
goog.require('goog.asserts');
goog.require('goog.log');
goog.require('goog.net.jsloader');


/**
 * @define {string} Globally defined facebook app id. We need this on compile
 * time for this to work.
 */
goog.define('pstj.app.FacebookId', '');


/**
 * @define {string} Globally settable FB JS SDK version to use.
 */
goog.define('pstj.app.FacebookSDKVersion', 'v2.5');


/** Facebook integration */
pstj.app.Facebook = goog.defineClass(null, {
  constructor: function() {
    /**
     * @type {goog.Promise}
     * @private
     */
    this.loadPromise_ = null;
    /**
     * @type {goog.Promise<!pstj.ds.oauth.User>}
     * @private
     */
    this.userPromise_ = null;
    this.init();
  },

  /**
   * Retrieve the readyness promise.
   * @return {!goog.Promise}
   */
  getReadyPromise: function() {
    return goog.asserts.assertInstanceof(this.loadPromise_,
        goog.Promise);
  },

  /**
   * Retrieves the user from initial load.
   * @return {!goog.Promise<!pstj.ds.oauth.User>}
   */
  getUserPromise: function() {
    return goog.asserts.assertInstanceof(this.userPromise_,
        goog.Promise);
  },

  /** @protected */
  init: function() {
    goog.log.info(this.logger, 'Initializing FB integration');
    this.loadPromise_ = new goog.Promise(function(resolve, reject) {
      this.userPromise_ = new goog.Promise(function(res, rej) {
        goog.log.info(this.logger, 'Prepair callback when SDK loads.');
        goog.global['fbAsyncInit'] = goog.bind(function() {
          goog.log.info(this.logger, 'Finished FB JS SDK loading');
          goog.global['FB']['init'](this.getConfig_());
          resolve(null);
          goog.log.info(this.logger, 'Start check for user');
          goog.global['FB']['getLoginStatus'](goog.bind(function(response) {
            goog.log.info(this.logger, 'Received info for log-in state');
            if (response['status'] != 'connected') {
              goog.log.error(this.logger, 'No user logged in');
              rej();
            } else {
              goog.log.info(this.logger, 'Start user info retrieval');
              goog.global['FB']['api']('/me', goog.bind(function(response) {
                goog.log.info(this.logger, 'Received user info initial load');
                res(/** @type {!pstj.ds.oauth.User} */({
                  id: response['id'],
                  name: response['name'],
                  provider: 'facebook'
                }));
              }, this));
            }
          }, this));
        }, this);
        goog.log.info(this.logger, 'Start loading JS SDK for Facebook');
        goog.net.jsloader.load('https://connect.facebook.net/en_US/sdk.js', {
          cleanupWhenDone: true
        }).addErrback(function(e) {
          goog.log.error(this.logger, 'Could not load the DB JS SDK');
          reject(e);
          rej();
        });
      }, this);
    }, this);
  },

  /**
   * @private
   * @return {!Object<string, ?>}
   */
  getConfig_: function() {
    return {
      'appId': pstj.app.FacebookId,
      'version': pstj.app.FacebookSDKVersion,
      'cookie': true,
      'xfbml': false
    };
  },

  /**
   * Returns the original promise if it was resolved to an actual user,
   * else initialized new promise with login. Note that it can also be
   * rejected!
   * @return {!goog.Promise<!pstj.ds.oauth.User>}
   */
  login: function() {
    return this.userPromise_.thenCatch(this.initializeLogin_, this);
  },

  /**
   * Log out the user.
   * @return {!goog.Promise}
   */
  logout: function() {
    return new goog.Promise(function(resolve, reject) {
      this.userPromise_ = goog.Promise.reject();
      resolve();
      // Maybe we should NOT log out the user from FB entierly but just from
      // our own app?
      // goog.global['FB']['logout'](function() {
      //   this.userPromise_ = goog.Promise.reject();
      //   resolve();
      // });
    });
  },

  /**
   * The login failed, so we need to init the login procedure directly.
   * @private
   * @return {!goog.Promise<!pstj.ds.oauth.User>}
   */
  initializeLogin_: function() {
    goog.log.warning(this.logger, 'Attempting new login');
    this.userPromise_ = new goog.Promise(function(resolve, reject) {
      goog.global['FB']['login'](function(response) {
        goog.log.info(this.logger, 'Received response to login attempt');
        if (response['authResponse']) {
          goog.log.info(this.logger, 'Attempt details info retrieval');
          goog.global['FB']['api']('/me', function(response) {
            goog.log.info(this.logger, 'Received user details');
            resolve(/** @type {!pstj.ds.oauth.User} */({
              id: response['id'],
              name: response['name'],
              provider: 'facebook'
            }));
          });
        } else {
          goog.log.error(this.logger, 'Could not log in, user gave up');
          reject(null);
        }
      });
    }, this);
    return this.userPromise_;
  },

  /**
   * @protected
   * @type {goog.debug.Logger}
   */
  logger: goog.log.getLogger('pstj.app.Facebook')

});
goog.addSingletonGetter(pstj.app.Facebook);
