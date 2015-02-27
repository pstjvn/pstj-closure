/**
 * @fileoverview Provides the wave-like ink effect for material design.
 *
 * The main idea is that the waves are up to 10. In reality less than 10 will be
 * used, but in extreme cases (i.e. not material design but drawing like
 * application) it is possible to need more than 10 (for 10 digits and N
 * (~10) still running animations).
 *
 * The wave is designed to be pool/cached. You would want to request a wave from
 * the pool and set the element on which the wave is to be applied. In the
 * ripple element example implementation a cache will be used to link the touch
 * ID to the wave instance returned by the pool for it (assuming the use of
 * Pointer abstraction). When the touch finishes (RELEASE) one should wait for
 * it to finish and then remove it from the cache. Removing from the cache
 * should also return the wave instance in the pool for free waves.
 *
 * Obtaining a new wave should link it in the cache to the element instance.
 *
 * Note that the pool is static by default and if you forget to free the
 * finished waves it can be exhausted. This is done for performance reasons.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.Wave');

goog.require('goog.Disposable');
goog.require('goog.array');
goog.require('goog.async.AnimationDelay');
goog.require('goog.async.Delay');
goog.require('goog.color');
goog.require('goog.dom');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.structs.Pool');
goog.require('goog.style');
goog.require('goog.userAgent.product');
goog.require('pstj.color');
goog.require('pstj.ds.Cache');
goog.require('pstj.lab.style.css');
goog.require('pstj.material.EventType');
goog.require('pstj.math.utils');

goog.scope(function() {
var AnimationDelay = goog.async.AnimationDelay;
var Coordinate = goog.math.Coordinate;
var Size = goog.math.Size;
var Disposable = goog.Disposable;
var css = pstj.lab.style.css;
var dom = goog.dom;
var gcolor = goog.color;
var mutils = pstj.math.utils;
var pcolor = pstj.color;
var style = goog.style;



/**
 * Implementation of the Wave effect for material design.
 * @constructor
 * @extends {Disposable}
 * @struct
 * @suppress {checkStructDictInheritance}
 */
pstj.material.Wave = function() {
  Disposable.call(this);
  /**
   * Reference to the currently attached component, if any.
   * @type {pstj.material.Element}
   * @private
   */
  this.component_ = null;
  /**
   * @type {Element}
   * @private
   */
  this.element_ = null;
  /**
   * Outer in script created element (wc, wave container, outer).
   * @type {Element}
   * @private
   */
  this.waveContainer_ = null;
  /**
   * Inner in-script created element (wave, inner).
   * @type {Element}
   * @private
   */
  this.wave_ = null;
  /**
   * The .bg element in the Ripple container element. Extracted from the
   * submitted element.
   * @type {Element}
   * @private
   */
  this.background_ = null;
  /**
   * The start coordinate, calculated on starting the new wave.
   * @type {Coordinate}
   * @private
   */
  this.startPoint_ = new Coordinate();
  /**
   * The end coordinate to use when using re centering position.
   * @type {Coordinate}
   * @private
   */
  this.endPoint_ = new Coordinate();
  /**
   * The size of the container currently holding our wave.
   * @type {Size}
   * @private
   */
  this.containerSize_ = new Size(0, 0);
  /**
   * The longest side of the container, used in calculations so we cache it.
   * @type {number}
   * @private
   */
  this.containerLargestSide_ = 0;
  /**
   * The color exacted from the element's currently computer style.
   * @type {string}
   * @private;
   */
  this.waveColor_ = '';
  /**
   * @type {number}
   * @private
   */
  this.maxRadius_ = 0;
  /**
   * @type {boolean}
   * @private
   */
  this.pressed_ = false;
  /**
   * Flag to signify if the animation should be re-centered. For visual example
   * please see the polymer implementation.
   * @type {boolean}
   * @private
   */
  this.recenter_ = false;
  /**
   * @type {number}
   * @private
   */
  this.pressTimestamp_ = 0.0;
  /**
   * @type {number}
   * @private
   */
  this.releaseTimestamp_ = 0.0;
  /**
   * @type {number}
   * @private
   */
  this.pressElapsedTime_ = 0;
  /**
   * @type {number}
   * @private
   */
  this.releaseElapsedTime_ = 0;
  /**
   * @type {number}
   * @private
   */
  this.initialOpacity_ = pstj.material.Wave.InitialOpacity_;
  /**
   * @type {number}
   * @private
   */
  this.opacityDecayVelocity_ = 0.8;
  // Setup cached DOM nodes.
  this.wave_ = dom.createDom('div', goog.getCssName('wave'));
  this.waveContainer_ = dom.createDom('div',
      goog.getCssName('wave-container'));
  dom.appendChild(this.waveContainer_, this.wave_);
  /**
   * Cached delayed call to complete a tap gesture. Used when the tap
   * event is bound to the wave instead of the touchstart-touchend pair.
   *
   * @type {function(this: pstj.material.Wave):void}
   * @private
   */
  this.delay_ = new goog.async.Delay(this.completeTap_, 70, this);

  /**
   * Caches the wave radius and the denominator. Saves a few calculations.
   * @type {Array<number>}
   * @private
   */
  this.cache_ = [0, 0];
};
goog.inherits(pstj.material.Wave, goog.Disposable);


/**
 * Sets per wave initial opacity.
 * @param {number} opacity
 */
pstj.material.Wave.prototype.setInitialOpacity = function(opacity) {
  if (this.pressed_) throw new Error('Already pressed, cannot alter opacity');
  this.initialOpacity_ = opacity;
};


/**
 * Sets the re centering option. If recenter is applied the animation does not
 * stay fixed but instead growing the wave will move it toward the center of the
 * container.
 * @param {boolean} recenter
 */
pstj.material.Wave.prototype.setRecenter = function(recenter) {
  this.recenter_ = recenter;
};


/**
 * Sets per wave decay velocity.
 * @param {number} velocity
 */
pstj.material.Wave.prototype.setOpacityDecayVelocity = function(velocity) {
  if (this.pressed_) throw new Error('Already pressed, cant set velocity');
  this.opacityDecayVelocity_ = velocity;
};


/**
 * Method is called on every RAF until the wave is considered active i.e. has
 * more frames to render.
 */
pstj.material.Wave.prototype.nextFrame = function() {
  if (this.pressTimestamp_ > 0) {
    this.pressElapsedTime_ = (
        pstj.material.Wave.LastTs_ - this.pressTimestamp_);
  }

  if (this.releaseTimestamp_ > 0) {
    this.releaseElapsedTime_ = (
        pstj.material.Wave.LastTs_ - this.releaseTimestamp_);
  }

  var radius = this.getWaveRadius();
  var alpha = this.getWaveAlpha();
  var bgFillAlpha = this.getBackgroundAlpha(alpha);

  this.drawRipple(radius, alpha, bgFillAlpha);


  if (this.releaseTimestamp_ == 0) {
    // the wave still needs to be here as the user has not released
    // his/her finger
    return true;
  } else {
    // User has lifted his/her finger plus
    // the minimum alpha is reached and the maximum radius is reached
    // so we need not render this wave anymore.
    if (alpha < 0.01 && radius >= Math.min(this.maxRadius_,
        pstj.material.Wave.WaveMaxRadius)) {
      return false;
    } else {
      return true;
    }
  }
};


/**
 * Draws the current ripple on the screen.
 * @param {number} radius
 * @param {number} innerAlpha
 * @param {number=} opt_outherAlpha
 */
pstj.material.Wave.prototype.drawRipple = function(
    radius, innerAlpha, opt_outherAlpha) {
  if (goog.isDef(opt_outherAlpha)) {
    style.setStyle(this.background_, 'opacity', opt_outherAlpha);
  }
  style.setStyle(this.wave_, 'opacity', innerAlpha);
  var x = this.startPoint_.x;
  var y = this.startPoint_.y;
  if (this.recenter_) {
    var fraction = Math.min(1, (
        radius / this.containerLargestSide_ * 2 / Math.sqrt(2)));
    x = x + (fraction * (this.endPoint_.x - this.startPoint_.x));
    y = y + (fraction * (this.endPoint_.y - this.startPoint_.y));
  }
  x = x - (this.containerSize_.width / 2);
  y = y - (this.containerSize_.height / 2);
  css.setTranslation(this.waveContainer_, x, y);

  // This is noted as workaround for Safari, but is actually required for the
  // effect to work.
  var s = radius / (this.containerLargestSide_ / 2);
  if (goog.userAgent.product.SAFARI) {
    style.setStyle(
        this.wave_, 'transform', 'scale(' + s + ',' + s + ')');
  } else {
    style.setStyle(
        this.wave_, 'transform', 'scale3d(' + s + ',' + s + ',1)');
  }
};


/**
 * The alpha to be applied to the background.
 * @param {number} waveOpacity The pre-calculated wave opacity to base this
 * opacity on.
 * @return {number}
 * @protected
 */
pstj.material.Wave.prototype.getBackgroundAlpha = function(waveOpacity) {
  return Math.max(0, Math.min(
      this.pressElapsedTime_ / 1000 * 0.3, waveOpacity));
};


/**
 * Getter for rgba color to be applied directly. Currently this code is not
 * used.
 * @param {number=} opt_alpha
 * @return {string}
 * @protected
 */
pstj.material.Wave.prototype.getCssColorWithAlpha = function(opt_alpha) {
  if (!goog.isDef(opt_alpha)) opt_alpha = 1;
  return pcolor.hexToRgba(gcolor.parse(this.waveColor_).hex, opt_alpha);
};


/**
 * Calculates the current alpha value for the wave.
 * @return {number}
 * @protected
 */
pstj.material.Wave.prototype.getWaveAlpha = function() {
  if (this.releaseElapsedTime_ <= 0) {
    return this.initialOpacity_;
  }

  return Math.max(0, this.initialOpacity_ - (
      (this.releaseElapsedTime_ / 1000) * this.opacityDecayVelocity_));
};


/**
 * Returns the radius that should be applied to the wave as per the currently
 * elapsed time since the last user interaction (press/release).
 * @return {number}
 * @protected
 */
pstj.material.Wave.prototype.getWaveRadius = function() {
  return (
      this.cache_[0] * (
          1 - Math.pow(
              80,
              -(
                (
                  (this.pressElapsedTime_ / 1000) +
                  (this.releaseElapsedTime_ / 1000)
                ) / this.cache_[1]
              )
              )
          )
  );
};


/**
 * Sets up a new component binding. This is used to manage the ripples.
 * @param {pstj.material.Element} comp
 */
pstj.material.Wave.prototype.setComponent = function(comp) {
  this.component_ = comp;
  this.setElement(goog.asserts.assertInstanceof(
      this.component_.getRippleElement(), Element));
};


/**
 * Getter for the currently bound component.
 * @return {pstj.material.Element}
 */
pstj.material.Wave.prototype.getComponent = function() {
  return this.component_;
};


/**
 * Sets the element and triggers calculation for a new wave.
 * @param {!Element} element
 */
pstj.material.Wave.prototype.setElement = function(element) {
  this.element_ = element;
  this.setupElements();
};


/**
 * Sets up the wave elements.
 * @protected
 */
pstj.material.Wave.prototype.setupElements = function() {
  // Set up the background container.
  this.background_ = dom.getElementByClass(goog.getCssName('ripple-bg'),
      this.element_);
  // Calculate the wave color
  this.waveColor_ = style.getComputedStyle(this.element_, 'color');
  // Set the color on th wave
  style.setStyle(this.wave_, 'backgroundColor', this.waveColor_);
  // Append the ripple nodes to the waves container. Those are cached
  dom.appendChild(dom.getElementByClass(goog.getCssName('ripple-waves'),
      this.element_), this.waveContainer_);
  // Set the background color on the BG container in the element.
  style.setStyle(this.background_, 'backgroundColor', this.waveColor_);
};


/**
 * Handles the PRESS pointer event. Starts the wave.
 * @param {pstj.agent.PointerEvent} e
 */
pstj.material.Wave.prototype.handlePress = function(e) {
  this.pressed_ = true;

  this.pressTimestamp_ = e.getPoint().timestamp;
  this.releaseTimestamp_ = 0;

  this.pressElapsedTime_ = 0.0;
  this.releaseElapsedTime_ = 0.0;

  var clientRect = style.getBounds(this.element_);

  this.startPoint_.x = e.getPoint().x - clientRect.left;
  this.startPoint_.y = e.getPoint().y - clientRect.top;

  // This needs some tweaking for cases when the event is actually transfered by
  // another element to the ripple (passive ripples).
  if (this.startPoint_.x < 0) this.startPoint_.x = 1;
  if (this.startPoint_.x > clientRect.width) {
    this.startPoint_.x = clientRect.width - 1;
  }

  if (this.startPoint_.y < 0) this.startPoint_.y = 1;
  if (this.startPoint_.y > clientRect.height) {
    this.startPoint_.y = clientRect.height - 1;
  }

  if (this.recenter_) {
    this.endPoint_.x = clientRect.width / 2;
    this.endPoint_.y = clientRect.height / 2;
  }

  this.containerSize_.width = clientRect.width;
  this.containerSize_.height = clientRect.height;
  this.containerLargestSide_ = this.containerSize_.getLongest();

  this.maxRadius_ = mutils.distanceToFurthestCorner(this.startPoint_,
      clientRect);

  // Update the cache.
  this.cache_[0] = ((Math.min(mutils.diagonal(this.containerSize_),
      pstj.material.Wave.WaveMaxRadius) * 1.1) + 5);
  this.cache_[1] = (1.1 - (0.2 * (this.cache_[0] /
      pstj.material.Wave.WaveMaxRadius)));

  style.setStyle(this.waveContainer_, {
    'top' : (
        this.containerSize_.height - this.containerLargestSide_) / 2 + 'px',
    'left' : (
        this.containerSize_.width - this.containerLargestSide_) / 2 + 'px',
    'width' : this.containerLargestSide_ + 'px',
    'height' : this.containerLargestSide_ + 'px'
  });
};


/**
 * Handler for an agent generated pointer event.
 * @param {pstj.agent.PointerEvent} e
 */
pstj.material.Wave.prototype.handleRelease = function(e) {
  this.completeTap_(e.getPoint().timestamp);
};


/**
 * Handler for the TAP event. It differentiates from press/release cycle by the
 * fact that we have to immediately use the release.
 * @param {pstj.agent.PointerEvent} e
 */
pstj.material.Wave.prototype.handleTap = function(e) {
  this.handlePress(e);
  this.delay_.start();
};


/**
 * Completes the press/release cycle. This is a separate method because if TAP
 * is used the release delay is simulated.
 * @param {number} ts The time stamp. In press/release this is the time stamp if
 * the release event, in TAP handling this is the goog.now() result.
 * @private
 */
pstj.material.Wave.prototype.completeTap_ = function(ts) {
  if (!goog.isDef(ts)) ts = goog.now();
  if (this.pressed_) {
    this.pressed_ = false;
    this.releaseTimestamp_ = ts;
    this.pressTimestamp_ = 0;
    this.releaseElapsedTime_ = 0.0;
  }
};


/**
 * Clears the wave so we can return it in the pool and reuse it.
 * The nodes are already cached so we do not need to re-create them
 * and instead we leave them attached to the wave instance. On next use we
 * simply null out the nodes and re-attach them to the main element.
 */
pstj.material.Wave.prototype.clear = function() {
  dom.removeNode(this.waveContainer_);
  this.background_ = null;
  this.element_ = null;
  this.component_ = null;
  this.setRecenter(false);
  this.waveColor_ = '';
  this.pressTimestamp_ = 0;
  this.pressElapsedTime_ = 0;
  this.releaseTimestamp_ = 0;
  this.releaseElapsedTime_ = 0;
  this.pressed_ = false;
  this.initialOpacity_ = pstj.material.Wave.InitialOpacity_;
  this.opacityDecayVelocity_ = pstj.material.Wave.OpacityDecayVelocity_;
};


/**
 * Helper method to clear the background of the Ripple element when the wave we
 * are about to remove is the last one.
 */
pstj.material.Wave.prototype.clearBackground = function() {
  style.setStyle(this.background_, 'backgroundColor');
};


/**
 * Override to make sure we do not keep the elements around. Note that the
 * disposing should not actually occur since a pool should be used for
 * obtaining a wave instance and those are all cached. This override is
 * provide in case you decided to do something else with the implementation.
 * @override
 */
pstj.material.Wave.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.clear();
  this.waveContainer_ = null;
  this.wave_ = null;
  this.startPoint_ = null;
  this.containerSize_ = null;
};


/**
 * The default initial opacity to work with.
 * @type {number}
 * @final
 * @private
 */
pstj.material.Wave.InitialOpacity_ = 0.25;


/**
 * The initial opacity decay to work with.
 * @type {number}
 * @final
 * @private
 */
pstj.material.Wave.OpacityDecayVelocity_ = 0.8;


/**
 * The maximum wave radius we can draw. This is the cap of the wave we can
 * possible draw on the screen and is global.
 * @type {number}
 * @final
 */
pstj.material.Wave.WaveMaxRadius = 150;


/**
 * Static cache for the component to wave structure.
 * @type {pstj.ds.Cache}
 * @private
 */
pstj.material.Wave.Cache_ = (pstj.ds.Cache.create('WaveCache'));


/**
 * Returns a new wave to be used in an animation. If no more waves are
 * allowed it will throw, so no need to check for undefined.
 *
 * The cache is used to be able to easily iterate on RAF.
 *
 * You should request a new wave, possible set up the opacity and decay
 * velocity and then hand over the pointer event that should trigger the
 * wave. Note that if you omit to pass the pointer event the wave will be
 * permanently taken over and this will eventually deplete the wave pool and
 * an error will be thrown. You should request a wave only to react to a
 * Pointer press event. Ripple element does that automatically. Once the
 * animation is finished the wave is automatically freed. You should not
 * keep references to the wave in your code.
 *
 * @param {pstj.material.Element} component
 * @return {pstj.material.Wave}
 */
pstj.material.Wave.get = function(component) {
  var o = pstj.material.Wave.Pool_.getObject();
  if (!goog.isDef(o)) {
    throw new Error('[WavePool]: No more objects in the pool');
  }

  // Record how many active waves are there on this component.
  if (pstj.material.Wave.Cache_.has(component.getId())) {
    pstj.material.Wave.Cache_.set(component.getId(),
        pstj.material.Wave.Cache_.get(component.getId()) + 1);
  } else {
    pstj.material.Wave.Cache_.set(component.getId(), 1);
  }

  if (!pstj.material.Wave.raf_.isActive()) {
    pstj.material.Wave.raf_.start();
  }

  o.setComponent(component);

  // add the wave to the list of animatable waves
  goog.array.insert(pstj.material.Wave.waves_, o);

  return o;
};


/**
 * Handles th RAF-ed signal and prcess every active wave. The waves that
 * need to be removed are releaed in the animation processing.
 * @param {number} ts
 */
pstj.material.Wave.onRaf = function(ts) {
  pstj.material.Wave.LastTs_ = ts;
  goog.array.forEach(pstj.material.Wave.waves_,
      pstj.material.Wave.animateWave_);

  if (!pstj.material.Wave.Cache_.isEmpty()) {
    pstj.material.Wave.raf_.start();
  }
};


/**
 * List of active waves.
 * @type {Array.<pstj.material.Wave>}
 * @private
 */
pstj.material.Wave.waves_ = new Array(10);


/**
 * Push the next frame on the wave.
 * @private
 * @param {pstj.material.Wave} wave
 * @param {number} index
 * @param {Array.<number, pstj.material.Wave>} arr
 * @return {boolean}
 */
pstj.material.Wave.animateWave_ = function(wave, index, arr) {
  goog.asserts.assertInstanceof(wave, pstj.material.Wave);
  var result = wave.nextFrame();
  if (!result) {
    var comp = wave.getComponent();
    var count = pstj.material.Wave.Cache_.get(comp.getId());
    if (count > 1) {
      pstj.material.Wave.Cache_.set(comp.getId(), count - 1);
    } else {
      // remove the cache for the component.
      pstj.material.Wave.Cache_.remove(comp.getId());
      // is the component does not have more active waves we need to clear
      // its background.
      wave.clearBackground();
    }
    // clear the wave
    wave.clear();
    // remove it from the list of active waves.
    goog.array.remove(pstj.material.Wave.waves_, wave);
    // Release the wave object
    pstj.material.Wave.release(wave);
    comp.dispatchEvent(pstj.material.EventType.RIPPLE_END);
  }
  return true;
};


/**
 * Releases a wave after it was used to be returned in the pool and reused
 * afterwards.
 * @param {pstj.material.Wave} o
 * @return {boolean}
 */
pstj.material.Wave.release = function(o) {
  return pstj.material.Wave.Pool_.releaseObject(o);
};



/**
 * @constructor
 * @extends {goog.structs.Pool}
 * @suppress {checkStructDictInheritance}
 */
pstj.material.WavePool = function() {
  goog.structs.Pool.call(this, 5, 10);
};
goog.inherits(pstj.material.WavePool, goog.structs.Pool);


/** @override */
pstj.material.WavePool.prototype.createObject = function() {
  return new pstj.material.Wave();
};


/**
 * The RAF syncing for the wave drawing. We want to spare the users the need
 * to sync and raf the wave animation so we do it here.
 * @type {AnimationDelay}
 * @private
 * @final
 */
pstj.material.Wave.raf_ = (new AnimationDelay(pstj.material.Wave.onRaf));


/**
 * Pool instace to use globally. This simplifies the API.
 * @type {pstj.material.WavePool}
 * @private
 * @final
 */
pstj.material.Wave.Pool_ = (new pstj.material.WavePool());

});  // goog.scope
