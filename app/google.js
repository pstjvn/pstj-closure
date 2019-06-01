goog.provide('pstj.app.Google');

goog.require('goog.Promise');
goog.require('goog.asserts');
goog.require('goog.log');
goog.require('goog.net.jsloader');


/**
 * @define {string} The client id to use.
 */
pstj.app.GoogleClientId = goog.define('pstj.app.GoogleClientId', '');


/**
 * Implements global app utility to work with google apis for auth.
 *
 * @deprecated Use `pstj.app.google.User` instead.
 */
pstj.app.Google = goog.defineClass(null, {
  constructor: function() {
    /**
     * @type {?goog.Promise}
     * @private
     */
    this.loadPromise_ = null;
    /**
     * @type {?goog.Promise}
     * @private
     */
    this.userPromise_ = null;
    this.init();
  },

  /**
   * @return {!goog.Promise}
   */
  getReadyPromise: function() {
    return goog.asserts.assertInstanceof(this.loadPromise_, goog.Promise);
  },

  /**
   * @return {!goog.Promise<!pstj.ds.oauth.User>}
   */
  getUserPromise: function() {
    return goog.asserts.assertInstanceof(this.userPromise_, goog.Promise);
  },

  /**
   * @protected
   */
  init: function() {
    this.loadPromise_ = new goog.Promise(function(resolve, reject) {
      this.userPromise_ = new goog.Promise(function(res, rej) {
        goog.log.info(this.logger, 'Loading google apis');
        goog.net.jsloader
            .load(
                'https://apis.google.com/js/platform.js',
                {cleanupWhenDone: true})
            .addCallback(
                function() {
                  goog.log.info(this.logger, 'GAPI lib loaded');
                  goog.log.info(this.logger, 'Loading oauth library');
                  goog.global['gapi']['load']('auth2', goog.bind(function() {
                    goog.log.info(this.logger, 'oauth library loaded');
                    goog.log.info(
                        this.logger, 'Initializing google oauth with id:' +
                            pstj.app.GoogleClientId);
                    goog.global['gapi']['auth2']['init']({
                      'client_id': pstj.app.GoogleClientId,
                      'cookiepolicy': 'single_host_origin'
                    });
                    goog.log.info(this.logger, 'Oauth initialized');
                    // Loaded the auth2 api
                    resolve();
                    goog.log.info(this.logger, 'Checking for existing user');
                    var hasUser =
                        goog.global['gapi']['auth2']
                                   ['getAuthInstance']()['isSignedIn']['get']();
                    // if we have an user we need to query it and resolve
                    // user promise, else we reject the user promise
                    if (hasUser) {
                      var user = goog.global['gapi']['auth2']
                                            ['getAuthInstance']()['currentUser']
                                                                 ['get']();
                      var bp = user['getBasicProfile']();
                      resolve(/** @type {!pstj.ds.oauth.User} */ ({
                        id: bp['getId'](),
                        name: bp['getName'](),
                        provider: 'google'
                      }));
                    } else {
                      goog.log.error(this.logger, 'No user logged in');
                      rej();
                    }
                  }, this));
                },
                this)
            .addErrback(function(e) {
              goog.log.error(this.logger, 'Faild to load GAPI');
              reject(e);
              rej();
            });
      }, this);
    }, this);
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
      var instance = goog.global['gapi']['auth2']['getAuthInstance']();
      instance['signOut']()['then'](function() { resolve(null); });
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
      var instance = goog.global['gapi']['auth2']['getAuthInstance']();
      instance['signIn']()['then'](goog.bind(function(userobj) {
        var bp = userobj['getBasicProfile']();
        resolve(/** @type {!pstj.ds.oauth.User} */ ({
          id: bp['getId'](),
          name: bp['getName'](),
          provider: 'google'
        }));
      }, this));
    }, this);
    return this.userPromise_;
  },

  /**
   * @protected
   * @type {?goog.debug.Logger}
   */
  logger: goog.log.getLogger('pstj.app.Google')
});
goog.addSingletonGetter(pstj.app.Google);
