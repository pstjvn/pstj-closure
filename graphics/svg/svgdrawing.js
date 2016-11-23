goog.module('pstj.graphics.svg.SvgDrawing');

const create = goog.require('pstj.animation.create');
const SvgInfo = goog.require('pstj.graphics.svg.SvgInfo');
const EventType = goog.require('goog.fx.Transition.EventType');
const EventTarget = goog.require('goog.events.EventTarget');

/**
 * The possible states our drawing can be settletd in.
 *
 * @enum {number}
 */
const State = {
  STOPPED: 0,
  PAUSED: -1,
  PLAYING: 1
};

/**
 * Represents an SVG animation / drawing.
 *
 * Note that in order to be able to present the SVG as a drawing it should
 * consist of path elements without fill property (or set to none).
 *
 * If your SVG element contains polygons ot polylines consider re-rendering it
 * as one consisting of paths {@see graphics.svg.transformers}
 *
 * This class is designed also to be used with a remote invokation system, i.e.
 * it can be instanciate by a renderer from a web worker and operates on the
 * document from the main thread.
 */
const SvgDrawing = class extends EventTarget {
  /**
   * @param {!SVGElement} svg
   * @param {number=} duration
   */
  constructor(svg, duration = 3000) {
    super();
    /** @type {!SvgInfo} */
    this.svg = new SvgInfo(svg);
    /** @type {!State} */
    this.state = State.STOPPED;
    /** @type {number} */
    this.progress = 1;
    /** @type {number} */
    this.startTime = 0;
    /** @protected {number} */
    this.duration = duration;
    /** @type {function(): void} */
    this.animation = create(null, goog.bind(this.draw, this), null);
  }

  /**
   * This is the actual work done on constructing a frame for the animation
   * pass.
   *
   * @param {!pstj.animation.State} state
   * @protected
   */
  draw(state) {
    // If we are playing we need to advance our animation.
    if (this.state == State.PLAYING) {
      this.progress = (state.timestamp - this.startTime) / this.duration;
      if (this.progress >= 1) {
        this.progress = 1;
        this.state = State.STOPPED;
        this.dispatchEvent(EventType.STOP);
        this.dispatchEvent(EventType.FINISH);
      } else {
        this.animation();
      }
    }
    this.svg.setDrawingProgress(this.progress);
  }

  /**
   * Starts playback of the path animation.
   *
   * When animation is started PLAY will always be emited. If the animation is
   * starting from the beginning BEGIN will be dispatched, if not from start
   * RESUME will be emited.
   */
  play() {
    this.svg.init();
    if (this.state != State.PLAYING) {
      this.state = State.PLAYING;
      if (this.progress != 1) {
        this.dispatchEvent(EventType.RESUME);
        this.startTime = goog.now() - (this.duration * this.progress);
      } else {
        this.dispatchEvent(EventType.BEGIN);
        this.progress = 0;
        this.startTime = goog.now();
      }
      this.dispatchEvent(EventType.PLAY);
      this.animation();
    }
  }

  /**
   * Pauses the animation. Note that if the animation is not currently playing
   * this will do nothing.
   *
   * If animation is playing, PAUSE event will be emited.
   */
  pause() {
    this.svg.init();
    if (this.state == State.PLAYING) {
      this.dispatchEvent(EventType.PAUSE);
      this.state = State.PAUSED;
    }
  }

  /**
   * Stops the animation if already running.
   *
   * Will dispatch the 'STOP' event if running.
   */
  stop() {
    this.svg.init();
    if (this.state != State.STOPPED) {
      this.dispatchEvent(EventType.STOP);
      this.state = State.STOPPED;
    }
  }

  /**
   * Sets the animation progression.
   *
   * Note that calling this mthod will stop the current animation if it
   * is running. This involves also emmiting the STOP event.
   *
   * @param {number} progress
   */
  setProgress(progress) {
    this.svg.init();
    this.stop();
    this.progress = progress;
    this.animation();
  }
}

exports = SvgDrawing;