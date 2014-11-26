/**
 * @fileoverview Provides implementation for a 'cast player' abstraction. In
 * this implementation we assume the native default player app is used on the
 * cast device and we manage sessions against it.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.cast.Cast');

goog.require('goog.async.Delay');
goog.require('goog.events.EventTarget');
goog.require('goog.functions');

goog.scope(function() {
var EventTarget = goog.events.EventTarget;


/**
 * Provides an abstraction over the cast player module.
 *
 * The cast sender API is a full blown session and player state API and is
 * too big to work directly with, thus we try to abstract some of the
 * functionlity into a subset that is also easer to reason about.
 *
 * The workflow is as follow:
 * there could be only one instance
 *
 * the instane automatically starts to listen for when the sender SDK
 * is available: on web this happens when the sender js file is loaded and if
 * the extension is present, on android this happens when the device ready is
 * called and the cast api is set up.
 *
 * once the SDK/Plugin is available the initialization process is started: it
 * configures which remote app will be started as well as the session listener
 * (used when session is created) and the receiver listener (listen for
 * availablity of a remote device that we can connect to). For external
 * consumers the best way to utilize this is to listen for the 'AVAIL' event
 * and check if current avail is ON. Once this is true it is safe to assume
 * that a device is ready to use and a session for it can be created.
 *
 * At this point the user should be able to see a 'cast' icon that upon
 * pressing should:
 *
 * create a new session (if one does not yet exists) - session creation
 * also involves a device selection thus at this point the user will be
 * presented with thirdparty selection dialog to choose the device to
 * cast to. If a device is chosen and session is successflly created
 * the SESSION_AVAILABLE event will be fired - for automatic players
 * this is the moment when the playback should start.
 *
 */
pstj.cast.Cast = goog.defineClass(EventTarget, {
  /**
   * @constructor
   * @suppress {checkStructDictInheritance}
   * @extends {EventTarget}
   */
  constructor: function() {
    EventTarget.call(this);
    /**
     * The ID of the remote app that will be used to play back the media.
     * It cannot be set to the default before the cast API is available, thus
     * configuration is made only on runtime.
     * @type {string}
     * @private
     */
    this.appID_ = '';
    /**
     * Current device state. The player needs a device that is available for it
     * to be able to play anything.
     * @type {pstj.cast.Cast.DeviceState}
     * @private
     */
    this.deviceState_ = pstj.cast.Cast.DeviceState.UNAVAILABLE;
    /**
     * The current state of the player. Note that it syncs to the remote app's
     * playback state.
     * @type {pstj.cast.Cast.PlayerState}
     * @private
     */
    this.playerState_ = pstj.cast.Cast.PlayerState.IDLE;
    /**
     * Reference to the cast session created for the App. If there is no such
     * session it is not possible to play via this player.
     * @type {chrome.cast.Session}
     * @private
     */
    this.session_ = null;
    /**
     * Reference tot he currently loaded media object on the remoet side.
     * @type {chrome.cast.media.Media}
     * @private
     */
    this.media_ = null;
    /**
     * Flag, used to avoid double initializtion.
     * @type {boolean}
     * @private
     */
    this.initialized_ = false;
    /**
     * Flag, indicates if at least one cast device is curently available.
     * @type {boolean}
     * @private
     */
    //this.available_ = false;
    /**
     * Delayed initialization. Used for when the chrome cast api is not
     * readily available and we need to re-initialize internally.
     * @type {goog.async.Delay}
     * @private
     */
    this.delayedInit_ = null;
    /**
     * Prebound method instance as we are using it in the API.
     * @type {function(this: pstj.cast.Cast, chrome.cast.Session): void}
     * @private
     */
    this.sessionListenerBound_ = goog.bind(this.sessionListener, this);
    /**
     * @type {function(this:pstj.cast.Cast): void}
     * @private
     */
    this.sessionUpdateListenerBound_ = goog.bind(this.sessionUpdateListener,
        this);
    /**
     * Prebound version of the error handler for requestSession calls.
     * @type {function(this:pstj.cast.Cast, chrome.cast.Error): void}
     * @private
     */
    this.onLaunchErrorBound_ = goog.bind(this.handleCreateSessionError, this);
    /**
     * Prebound version of the media info handler.
     * @type {function(boolean):void}
     * @private
     */
    this.onMediaInfoBound_ = goog.bind(this.onMediaInfo, this);
    /**
     * The current time of the video/audio.
     * @type {number}
     * @protected
     */
    this.mediaTime = 0;
    /**
     * Duration of the current media.
     * @type {number}
     * @protected
     */
    this.mediaDuration = -1;
    /**
     * The current volume of the player (audio track only).
     * @type {chrome.cast.Volume}
     * @protected
     */
    this.audioVolume = null;
  },


  /**
   * Wheather a cast device is currently available. The device is only one
   * in the SDK (as in "possible remote device" not a particular device in
   * case many are available). The device can be 'unavail' when no device is
   * present in the SDK registry, idle when there is at least one device that
   * can be connected, ACTIVE when there is a connection made to a selected
   * device and warning/error when something whent wrong with the device.
   * In the latter case it is okay to destroy the session and create a new one
   * to allow the user to select another device if many are present.
   *
   * @return {boolean}
   */
  isAvailable: function() {
    return (this.deviceState_ == pstj.cast.Cast.DeviceState.IDLE ||
        this.deviceState_ == pstj.cast.Cast.DeviceState.ACTIVE);
  },


  /**
   * Allows users to query the device state.
   * @return {pstj.cast.Cast.DeviceState}
   */
  getDeviceState: function() {
    return this.deviceState_;
  },


  /**
   * Sets the Application ID to use on the cast. It will throw if the cast is
   * already initialized.
   * @param {string} appid
   */
  setAppID: function(appid) {
    if (this.initialized_) {
      throw new Error('App ID can be configured only before initialization');
    }
    this.appID_ = appid;
  },


  /**
   * Start initalization of the cast API. This method can be called only once.
   * @deprecated Do not use this initialization path!
   */
  initialize: function() {
    if (this.initialized_) {
      throw new Error('Cast can be initialized only once, already inited');
    }
    this.initialized_ = true;
    this.initializePrivate_();
  },


  /**
   * Method to start timer to wait for the cast API. This is deprecated in favor
   * of the new method to detect when the API is ready (i.e. one that does
   * not involve timer to run for the rest of time when you have no extention).
   * @deprecated Do not use this initilization path.
   * @private
   */
  initializePrivate_: function() {
    if (!window['chrome']) {
      if (goog.DEBUG) {
        console.log('No chrome namespace');
      }
      return;
    }

    if (!chrome.cast || !chrome.cast.isAvailable) {
      if (goog.DEBUG) {
        console.log('Delaying init');
      }
      if (!this.getDelayedInit_().isActive()) {
        this.getDelayedInit_().start();
      }
      return;
    }

    // Once ready, clean up the delays.
    if (!goog.isNull(this.delayedInit_)) {
      this.delayedInit_.dispose();
      this.delayedInit_ = null;
    }

    this.initializeInternal();
  },


  /**
   * Lazily creating the delayed init. This code should be considered
   * deprecated and not used. It can be removed in the future.
   * @return {goog.async.Delay}
   * @deprecated Do not use this initialization path!
   * @private
   */
  getDelayedInit_: function() {
    if (goog.isNull(this.delayedInit_)) {
      this.delayedInit_ = new goog.async.Delay(this.initializePrivate_,
          1000, this);
    }
    return this.delayedInit_;
  },


  /**
   * Internal method to do the initialization, does not enforces single
   * call so that we can attempt again if the cast API is not readily available
   * for some reason.
   * @protected
   */
  initializeInternal: function() {
    var appID = this.appID_ || chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
    var sessionRequest = new chrome.cast.SessionRequest(appID);
    // Configures the API what to do with standard situations and the remote
    // application to use when connected to a device.
    // Session listener is provided in case that the app is restarted and
    // a previous session is still alive on the device.
    var config = new chrome.cast.ApiConfig(
        sessionRequest,
        goog.bind(this.sessionListener, this),
        goog.bind(this.receiverListener, this),
        chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED);
    // Initialize session discovery. The session is actually a link
    // to the cast SDK/API and not to a remote application or a particular
    // device that is in range
    chrome.cast.initialize(
        config,
        goog.functions.NULL,
        goog.bind(this.onInitError, this));
  },


  /**
   * Called when a session is found / created (i.e. when we first receive info
   * about session being available). We check if the session is an old one (i.e.
   * if there is media inside of it already) so we can sync to it
   * is still live on the device selected by the user.
   * @private
   */
  onOldSessionDiscovered_: function() {
    // is the old session has media in it we should try to notify listeners
    if (!goog.isNull(this.session_) &&
        !goog.array.isEmpty(this.session_.media)) {
      this.updateOnMediaDiscovered(this.session_.media[0]);
    }
  },


  /**
   * Update the instance state based on an old session with an existing media
   * on it. Not all params are used, method ios made protected so you can
   * extract what you need in a subclass.
   * @param {chrome.cast.media.Media} media
   * @protected
   */
  updateOnMediaDiscovered: function(media) {
    this.setPlayerStateFromRemoteState_(media.playerState);
    this.mediaTime = media.currentTime;
    this.audioVolume = media.volume;
  },

  /**
   * Update the instance states based on the load of a new media (i.e. we have
   * called the 'loadMedia' method so we know we want to enforce our state on
   * the things.
   * @param {chrome.cast.media.Media} media
   */
  updateOnMediaLoaded: function(media) {

  },


  /**
   * Sets the player state internal state to match the remote player state.
   * @param {chrome.cast.media.PlayerState} state
   * @private
   */
  setPlayerStateFromRemoteState_: function(state) {
    var newState = pstj.cast.Cast.PlayerState.IDLE;
    switch (state) {
      // Player is in PLAY mode but not actively playing content.
      case chrome.cast.media.PlayerState.BUFFERING:
        newState = pstj.cast.Cast.PlayerState.LOADING;
        break;
      // No media is loaded into the player.
      case chrome.cast.media.PlayerState.IDLE:
        newState = pstj.cast.Cast.PlayerState.IDLE;
        break;
      // The media is not playing.
      case chrome.cast.media.PlayerState.PAUSED:
        newState = pstj.cast.Cast.PlayerState.PAUSED;
        break;
      // The media is playing.
      case chrome.cast.media.PlayerState.PLAYING:
        newState = pstj.cast.Cast.PlayerState.PLAYING;
        break;
    }
    this.setPlayerStateInternal(newState);
  },


  /**
   * Sets the player state and if there is a change emits the appropriate event.
   * @param {pstj.cast.Cast.PlayerState} state
   * @protected
   */
  setPlayerStateInternal: function(state) {
    if (this.playerState_ != state) {
      this.playerState_ = state;
      this.dispatchEvent(pstj.cast.Cast.EventType.PLAYER_STATE_CHANGE);
    }
  },


  /**
   * Invoked when a session successfully established with the SDK/Plugin.
   * @param {chrome.cast.Session} session
   * @protected
   */
  sessionListener: function(session) {
    if (goog.DEBUG) {
      console.log('Session listener triggerd', session);
    }
    this.session_ = session;
    // Assuming a working session with the remote end.
    if (this.session_) {
      this.deviceState_ = pstj.cast.Cast.DeviceState.ACTIVE;
      this.session_.addUpdateListener(this.sessionUpdateListenerBound_);
      // Fireing this means we are ready to play something.
      this.dispatchEvent(pstj.cast.Cast.EventType.READY);
      // Check if the session is coming from us creating a new one or is it
      // an already existing session and possibly with media inside of it. If
      // media is present it will be synced with our instance.
      this.onOldSessionDiscovered_();
    }
  },


  /**
   * Check if there is already a session to a receiving application.
   * @return {boolean}
   */
  hasActiveSession: function() {
    return (!goog.isNull(this.session_) && (this.session_.status ==
        chrome.cast.SessionStatus.CONNECTED));
  },


  /**
   * Handles the updates for the session to the receiver application.
   * @protected
   */
  sessionUpdateListener: function() {
    if (this.session_.status != chrome.cast.SessionStatus.CONNECTED) {
      this.dispatchEvent(pstj.cast.Cast.EventType.DISCONNECT);
    }
  },

  /**
   * Stops the session.
   */
  destroySession: function() {
    if (!goog.isNull(this.session_)) {
      this.session_.stop(
          goog.bind(this.handleStopSuccess, this),
          goog.bind(this.handleStopError, this));
    }
  },


  /**
   * Handles successful stop of the playback.
   * @protected
   */
  handleStopSuccess: function() {},


  /**
   * Handles the error while trying to stop playing media.
   * Possible error values:
   * TIMEOUT, API_NOT_INITIALIZED, CHANNEL_ERROR, SESSION_ERROR, and
   * EXTENSION_MISSING
   * @param {chrome.cast.Error} err
   * @protected
   */
  handleStopError: function(err) {},


  /**
   * Invoked when the availability of a Cast receiver that supports
   * the application in sessionRequest is known or changes.
   * @param {chrome.cast.ReceiverAvailability} availability
   * @protected
   */
  receiverListener: function(availability) {
    if (goog.DEBUG) {
      console.log('Receiver lisener change: ' + availability);
    }

    if (availability == chrome.cast.ReceiverAvailability.AVAILABLE) {
      this.deviceState_ = pstj.cast.Cast.DeviceState.IDLE;
    } else {
      this.deviceState_ = pstj.cast.Cast.DeviceState.UNAVAILABLE;
    }
    // Notify listeners about device availability change.
    this.dispatchEvent(pstj.cast.Cast.EventType.AVAILABILITY_CHANGE);
  },


  /**
   * Handler for unsuccessful initialization of the Cast API.
   * @param {chrome.cast.Error} err
   */
  onInitError: function(err) {
    if (goog.DEBUG) {
      console.log('Error initializing', err);
    }
    this.dispatchEvent(pstj.cast.Cast.EventType.ERROR);
  },


  /**
   * Attempts to start a new session. Session state is handled in
   * sessionListener. The session is a link to the APP on the chromecast.
   */
  createSession: function() {
    chrome.cast.requestSession(
        this.sessionListenerBound_,
        this.onLaunchErrorBound_);
  },


  /**
   * Use this method to stop the current stream and start a new one. Note
   * that at this point it is assumed that you have an active session.
   * Active session is requested by clicking the cast button.
   * @param {string} url The url to start streaming.
   */
  castUrl: function(url) {
    console.log('Casting url: ' + url);
    this.mediaTime = 0;
    this.playerState_ = pstj.cast.Cast.PlayerState.IDLE;
    this.play(url);
  },


  /**
   * Attempt to play a new media stream.
   * @param {string} url The url of the video to play.
   * @param {number=} opt_offset The position to witch to rewind the video.
   * @param {string=} opt_image The thumbnail if any while loading the media.
   */
  play: function(url, opt_offset, opt_image) {
    this.mediaTime = opt_offset || 0;
    if (goog.isNull(this.media_)) {
      // we need a new media session.
      // no active media session. loadin media
      var mediaInfo = new chrome.cast.media.MediaInfo(url, 'video/mp4');
      mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
      mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
      mediaInfo.contentType = 'video/mp4';
      mediaInfo.metadata.title = 'Test video from Bobo';
      if (goog.isDef(opt_image)) {
        mediaInfo.metadata.images = [{'url': opt_image}];
      }

      var request = new chrome.cast.media.LoadRequest(mediaInfo);
      // we want to always to auto-play new media
      request.autoplay = true;
      request.currentTime = this.mediaTime;

      this.playerState_ = pstj.cast.Cast.PlayerState.LOADING;
      this.session_.loadMedia(request,
          this.onLoadMediaSuccess_.bind(this),
          this.onLoadMediaError_.bind(this));

    } else {
      console.log('There is active media object playing... ');
    }
  },


  /**
   * Handles the successful loading of media on the device.
   * @param {chrome.cast.media.Media} mediaobj
   * @private
   */
  onLoadMediaSuccess_: function(mediaobj) {
    console.log('Should have playback on TV now');
    this.media_ = mediaobj;
    this.playerState_ = pstj.cast.Cast.PlayerState.PLAYING;
    // POSSIBLE GOOD PLACE to start progress listener.
    // Add this when we want to have processbar
    this.media_.addUpdateListener(this.onMediaInfoBound_);
  },


  /**
   * Called when the session cannot create a new media instance.
   * @param {chrome.cast.Error} err
   * @private
   */
  onLoadMediaError_: function(err) {
    if (goog.DEBUG) {
      console.log('Error while loadin media on the server', err);
    }
  },


  /**
   * Receives signals for when something happens with the media (play, pause,
   * end, etc.).
   * @param {boolean} alive If the media is still alive.
   * @protected
   */
  onMediaInfo: function(alive) {
    if (goog.DEBUG) {
      console.log('Media status update', alive, goog.now());
    }
    if (!alive) {
      this.mediaTime = 0;
      this.playerState_ = pstj.cast.Cast.PlayerState.IDLE;
    }
  },


  /**
   * Handles errors when trying to create a new session.
   * TODO: implement check for possible errors.
   * The possible errors are TIMEOUT, INVALID_PARAMETER, API_NOT_INITIALIZED,
   * CANCEL, CHANNEL_ERROR, SESSION_ERROR, RECEIVER_UNAVAILABLE, and
   * EXTENSION_MISSING. Note that the timeout timer starts after users select
   * a receiver. Selecting a receiver requires user's action, which has no
   * timeout.
   *
   * @param {chrome.cast.Error} err
   * @protected
   */
  handleCreateSessionError: function(err) {
    if (goog.DEBUG) {
      console.log('Error creating session:', err);
    }
    // for now assume only error when not selecting dvice.
    this.dispatchEvent(pstj.cast.Cast.EventType.CANCEL);
  },


  statics: {
    /**
     * The state the remote device could be in.
     * @enum {number}
     */
    DeviceState: {
      UNAVAILABLE: -1,
      IDLE: 0,
      ACTIVE: 1,
      WARNING: 2,
      ERROR: 3
    },


    /**
     * Player states we know of.
     * @enum {number}
     */
    PlayerState: {
      IDLE: 0,
      LOADING: 1,
      LOADED: 2,
      PLAYING: 3,
      PAUSED: 4,
      STOPPED: 5,
      SEEKING: 6,
      ERROR: 7
    },

    /**
     * The events the instance can fire.
     * @enum {string}
     */
    EventType: {
      // When error occured
      ERROR: goog.events.getUniqueId('error'),
      // After initializtion success
      INIT: goog.events.getUniqueId('init'),
      // When at least one device is found or device dissapears
      AVAILABILITY_CHANGE: goog.events.getUniqueId('availability-change'),
      // When ready to talk to the device to create a new session
      READY: goog.events.getUniqueId('ready'),
      PLAYER_STATE_CHANGE: goog.events.getUniqueId('player-state-change'),
      DISCONNECT: goog.events.getUniqueId('disconnect'),
      // When user canceled the session initiation.
      CANCEL: goog.events.getUniqueId('user-cancel')
    }
  }
});
goog.addSingletonGetter(pstj.cast.Cast);


/**
 * @define {boolean} If we should use the new method to initialize the
 * Cast subsystem (i.e. automatically). If this is false the cast must be
 * manually initialized with instance.initialize();
 */
goog.define('pstj.cast.UseAutoInitialization', true);


if (pstj.cast.UseAutoInitialization) {
  if (goog.DEBUG) {
    console.log('Automatic cast registration');
  }
  // Use the new method to load the API
  window['__onGCastApiAvailable'] = function(loaded, err) {
    pstj.cast.Cast.getInstance().initialized_ = true;
    pstj.cast.Cast.getInstance().initializeInternal();
  };
}

});  // goog.scope
