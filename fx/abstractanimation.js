/**
 * @fileoverview The default animation implementation in goog namespace is
 * constructed for coordinates calculations, white we would want to use more
 * abstract calculation method.
 *
 */

goog.provide('pstj.fx.animation');

goog.require('goog.async.AnimationDelay');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.fx.easing');
goog.require('goog.math.Coordinate');
goog.require('goog.style');
goog.require('pstj.lab.style.css');
goog.require('pstj.math.utils');

goog.scope(function() {


/** Template function for wave reveal animation */
pstj.fx.animation.Wave = goog.defineClass(null, {
  /**
   * @constructor
   * @param {Element} el
   */
  constructor: function(el) {
    this.reveal = false;
    this.element = el;
    this.startTime = -1;
    this.endTime = -1;
    this.startValue = 0;
    this.endValue = 1;
    this.duration = 800;
    this.rippleElement = this.element.querySelector('.ripple');
    this.innerElement = this.element.querySelector('.inner');
    this.rect = goog.style.getBounds(this.element);
    this.clickPoint = new goog.math.Coordinate();
    this.radius = 0;
    this.raf = new goog.async.AnimationDelay(this.onRaf, undefined, this);
    goog.events.listen(this.element, goog.events.EventType.CLICK,
        this.handleClick, undefined, this);
    this.cache = [0, 0];
  },

  /**
   * @param {goog.events.Event} e
   */
  handleClick: function(e) {
    this.reveal = !this.reveal;
    this.startTime = goog.now();
    this.endTime = this.startTime + this.duration;
    if (this.reveal) {
      this.clickPoint.x = e.clientX - this.rect.left;
      this.clickPoint.y = e.clientY - this.rect.top;
    } else {
      this.clickPoint.x = this.rect.width / 2;
      this.clickPoint.y = this.rect.height / 2;
    }
    this.radius = pstj.math.utils.distanceToFurthestCorner(this.clickPoint,
        this.rect);
    goog.style.setWidth(this.rippleElement, this.radius * 2);
    goog.style.setHeight(this.rippleElement, this.radius * 2);

    var origin = this.radius + 'px ' + this.radius + 'px';
    goog.style.setStyle(this.rippleElement, 'transform-origin', origin);
    goog.style.setStyle(this.innerElement, 'transform-origin', origin);
    this.cache[0] = 0 + this.clickPoint.x - this.radius;
    this.cache[1] = 0 + this.clickPoint.y - this.radius;
    goog.style.setStyle(this.rippleElement, 'border-radius', '50%');
    this.raf.start();
  },

  /**
   * @param {number} ts
   */
  onRaf: function(ts) {
    this.raf.start();
    if (this.reveal) {
      var scale = goog.fx.easing.easeOut((ts - this.startTime) / this.duration);
    } else {
      var scale = goog.fx.easing.easeIn(this.endValue - (
          ts - this.startTime) / this.duration);
    }
    if (this.reveal && scale >= 1) {
      pstj.lab.style.css.clearTranslation(this.rippleElement);
      pstj.lab.style.css.clearTranslation(this.innerElement);
      goog.style.setStyle(this.rippleElement, 'border-radius', 0);
      this.raf.stop();
    } else if (!this.reveal && scale <= 0) {
      this.raf.stop();
      this.update(0);
    } else {
      this.update(scale);
    }
  },

  /**
   * @param {number} scale
   */
  update: function(scale) {
    var rev = 1 / scale;
    pstj.lab.style.css.setTranslation(this.rippleElement, this.cache[0],
        this.cache[1], 'px',
        'scale(' + scale + ')');

    pstj.lab.style.css.setTranslation(this.innerElement,
        this.cache[0] * -1 * rev,
        this.cache[1] * -1 * rev,
        'px',
        'scale(' + rev + ')');
  }

});

});  // goog.scope
