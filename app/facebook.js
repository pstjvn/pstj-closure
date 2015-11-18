/**
 * @fileoverview Simple conrol to load FB SDK and perform user auth against it.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.app.Facebook');

goog.require('goog.Promise');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.log');
goog.require('pstj.control.Control');


/**
 * @define {string} Globally defined facebook app id. We need this on compile
 * time for this to work.
 */
goog.define('pstj.app.FacebookId', '');


/**
 * @define {string} Globally settable FB JS SDK version to use.
 */
goog.define('pstj.app.FacebookSDKVersion', 'v2.5');


/** @extends {pstj.control.Control} */
pstj.app.Facebook = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    /**
     * @type {goog.Promise<!Object<string, ?>>}
     * @private
     */
    this.installPromise_ = null;
    /** @private */
    this.resolve_ = null;
    /** @private */
    this.reject_ = null;
    this.init();
  },

  /**
   * Retrieve the readyness promise.
   * @return {!goog.Promise<!Object<string, ?>>}
   */
  getReadyPromise: function() {
    return goog.asserts.assertInstanceof(this.installPromise_,
        goog.Promise);
  },

  /** @override */
  init: function() {
    goog.base(this, 'init');
    this.installPromise_ = new goog.Promise(function(resolve, reject) {
      this.resolve_ = resolve;
      this.reject_ = reject;
    }, this);
    // Clean up refs after the promise is ready.
    this.installPromise_.thenAlways(function() {
      this.resolve_ = null;
      this.reject_ = null;
    }, this);
    goog.log.fine(this.logger, 'Installing FB SDK');
    this.installSDK();
  },

  /** @private */
  handleSDKLoaded_: function() {
    goog.log.info(this.logger, 'FB SDK loaded, initializing it...');
    goog.global['FB']['init'](this.getConfig());
    goog.global['FB']['getLoginStatus'](goog.bind(this.handleLoginStatusInit_,
        this));
  },

  /**
   * @private
   * @return {!Object<string, ?>}
   */
  getConfig: function() {
    return {
      'appId': pstj.app.FacebookId,
      'version': pstj.app.FacebookSDKVersion,
      'cookie': true,
      'xfbml': false
    };
  },

  /** @protected */
  installSDK: function() {
    goog.global['fbAsyncInit'] = goog.bind(this.handleSDKLoaded_, this);
    var scriptElement = goog.dom.createDom('script', {
      'type': 'text/javascript',
      'src': 'https://connect.facebook.net/en_US/sdk.js'
    });
    document.head.appendChild(scriptElement);
  },

  /**
   * @private
   * @param {!Object<string, ?>} response
   */
  handleLoginStatusInit_: function(response) {
    goog.log.info(this.logger, 'Received initial FB status');
    if (response['status'] != 'connected') {
      this.reject_(null);
    } else {
      this.attemptUserInfo_();
    }
  },

  /** @private */
  attemptUserInfo_: function() {
    goog.log.fine(this.logger, 'Call FB API /me');
    goog.global['FB']['api']('/me', goog.bind(this.handleUserInfo_, this));
  },

  /**
   * @private
   * @param {!Object<string, ?>} response
   */
  handleUserInfo_: function(response) {
    this.resolve_(response);
  },

  /**
   * @protected
   * @type {goog.debug.Logger}
   */
  logger: goog.log.getLogger('pstj.app.Facebook')

});
goog.addSingletonGetter(pstj.app.Facebook);
