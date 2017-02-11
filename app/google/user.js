goog.provide('pstj.app.google.User');

goog.require('goog.Promise');
goog.require('goog.asserts');
goog.require('goog.log');
goog.require('goog.string');
goog.require('pstj.app.google.Auth2');
goog.require('pstj.app.google.settings');
goog.require('pstj.ds.oauth');

/**
 * Provides user management (login, logout, discovery) utilities for
 * google auth api.
 *
 * NOTE: for this to work one must provide a valid client_id for
 * Google's Auth2.
 */
pstj.app.google.User = goog.defineClass(null, {
  constructor: function() {
    // Fail early to tell the developer that he forgot to assign
    // client_id for the project.
    if (goog.string.isEmptyOrWhitespace(pstj.app.google.settings.CLIENT_ID)) {
      goog.log.error(this.logger, 'No client_id for auth2 provided');
      throw new Error('Cannot initialize Auth2 without client_id');
    }
    /** @private {?goog.Promise<!Object>} */
    this.user_ = null;
    /** @private {?goog.Promise<!Object>} */
    this.init_ = null;
  },

  /**
   * Returns a promise for an user. The consumers of this method should perform
   * `login` method with params if the promise returned here fails - it would
   * mean
   * no current user is available.
   *
   * NOTE: the original user ptomise attempts to find an already logged in user.
   *
   * @return {!goog.Promise<!pstj.ds.oauth.User>}
   */
  getUser: function() {
    if (goog.isNull(this.user_)) {
      this.user_ = this.getInitializedPromise_().then(function(auth2) {
        goog.log.info('Initial checking for logged-in user');
        var hasAnUser = auth2['getAuthInstance']()['isSignedIn']['get']();
        if (hasAnUser) {
          goog.log.info('Found logged-in user');
          goog.log.info('Requesting user detail and user profile');
          var user = auth2['getAuthInstance']()['currentUser']['get']();
          var bp = user['getBasicProfile']();
          return (/** @type {!pstj.ds.oauth.User} */ ({
            id: bp['getId'](),
            name: bp['getName'](),
            provider: 'google'
          }));
        } else {
          goog.log.error(
              this.logger, 'No logged-in user found, rejecting user promise');
          return goog.Promise.reject();
        }
      }, null, this);
    }
    return this.user_;
  },

  /**
   * Initialize a new login sequence. The existing logged-in user is any will be
   * lost.
   *
   * @return {!goog.Promise<!pstj.ds.oauth.User>}
   */
  login: function() {
    return this.getUser().thenCatch(this.initializeLogin_, this);
  },

  /**
   * Signs out existing user. Will return a promise that resolves to null
   * once the sign out process is complete.
   *
   * @return {!goog.Promise<null>}
   */
  logout: function() {
    this.getInitializedPromise_().then(function(auth2) {
      return new goog.Promise(function(resolve, reject) {
        this.user_ = goog.Promise.reject(null);
        var instance = auth2['getAuthInstance']();
        instance['signOut']()['then'](function() { resolve(null); });
      });
    }, null, this);
  },

  /** @protected {!goog.debug.Logger} */
  logger: goog.log.getLogger('pstj.app.google.User'),

  /**
   * A wrapper promise to make sure the auth2 API is initialized correctly.
   *
   * @return {!goog.Promise<!Object>}
   */
  getInitializedPromise_: function() {
    if (goog.isNull(this.init_)) {
      this.init_ = pstj.app.google.Auth2.getInstance().getPromise().then(
          function(auth2) {
            goog.log.info(this.logger, 'Initializing Auth2');
            auth2['init']({
              'client_id': pstj.app.google.settings.CLIENT_ID,
            });
            return auth2;
          },
          null, this);
    }
    return goog.asserts.assertInstanceof(this.init_, goog.Promise);
  },

  /**
   * This method will check the error thrown in user promise and if it is null
   * (i.e. we created a rejcted promise when the user logged out) and if yes
   * this
   * means that it is safe to attempt a new login. If an error is present this
   * means that an error occured on an earlier stage and we cannot proceed with
   * it and will return the original rejection instead.
   *
   * @param {?Error} err
   * @return {!goog.Promise<!pstj.ds.oauth.User>}
   */
  initializeLogin_: function(err) {
    if (goog.isNull(err)) {
      goog.log.warning(this.logger, 'Attempting new login');
      this.user_ = this.getInitializedPromise_().then(function(auth2) {
        goog.log.info(this.logger, 'Got initialized auth2');
        return new goog.Promise(function(resolve, reject) {
          goog.log.info('Starting sign in process');
          auth2['getAuthInstance']()['signIn']()['then'](
              goog.bind(function(user) {
                goog.log.info(this.logger, 'Sign in process complete');
                var profile = user['getBasicProfile']();
                resolve(/** @type {!pstj.ds.oauth.User} */ ({
                  id: profile['getId'](),
                  name: profile['getName'](),
                  provider: 'google'
                }));
              }, this), goog.bind(function(error) {
                goog.log.error(
                    this.logger, 'Sign in process failed: ' + error.toString());
                reject(null);
              }, this));
        }, this);
      }, null, this);
    }
    return this.user_;
  }
});
goog.addSingletonGetter(pstj.app.google.User);
