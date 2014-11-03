goog.provide('pstj.agent.Scroll');
goog.provide('pstj.agent.ScrollEvent');

goog.require('goog.asserts');
goog.require('goog.async.AnimationDelay');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('pstj.ui.Agent');


/**
 * Implements a scrolling agent. It will dispatch the scroll event synced to the
 * RAF.
 */
pstj.agent.Scroll = goog.defineClass(pstj.ui.Agent, {
  /**
   * @constructor
   * @extends {pstj.ui.Agent}
   * @struct
   */
  constructor: function() {
    pstj.ui.Agent.call(this, null);
    /**
     * References the last scrolled - on component.
     * @type {pstj.material.Element}
     * @private
     */
    this.currentSource_ = null;
    /**
     * The animation delay used to sync the scroll events to the RAF.
     * @type {goog.async.AnimationDelay}
     * @private
     */
    this.raf_ = new goog.async.AnimationDelay(this.onRaf, undefined, this);
  },


  /** @override */
  updateCache: function(component) {
    // We can actually support only the material element control as we need
    // to know which is the scroll element.
    this.getCache().set(component.getId(), goog.events.listen(
        component.getScrollElement(), goog.events.EventType.SCROLL,
        goog.bind(this.handleScroll, this, component)));
  },


  /** @override */
  detach: function(component) {
    goog.events.unlistenByKey(/** @type {goog.events.Key} */ (this.getCache()
        .get(component.getId())));
    if (component == this.currentSource_) {
      this.raf_.stop();
      this.currentSource_ = null;
    }
  },


  /**
   * Handles the original (browser generated) scroll event.
   * @param {pstj.material.Element} component
   * @param {goog.events.Event} e
   * @protected
   */
  handleScroll: function(component, e) {
    this.currentSource_ = component;
    if (!this.raf_.isActive()) {
      this.raf_.start();
    }
  },


  /**
   * Handles the RAF-ed sync event. This dispatches the scroll event that is
   * already synced to the RAF and should be directly used by the component.
   * @param {number} ts The timestamp as produced by the animation delay class.
   * @protected
   */
  onRaf: function(ts) {
    this.currentSource_.dispatchEvent(new pstj.agent.ScrollEvent(
        this.currentSource_));
  }
});
goog.addSingletonGetter(pstj.agent.Scroll);


/**
 * Implements the scroll event abstraction.
 */
pstj.agent.ScrollEvent = goog.defineClass(goog.events.Event, {
  /**
   * @constructor
   * @extends {goog.events.Event}
   * @param {pstj.material.Element} target
   * @suppress {checkStructDictInheritance}
   */
  constructor: function(target) {
    goog.events.Event.call(this, goog.events.EventType.SCROLL, target);
    /**
     * @type {number}
     */
    this.scrollTop = target.getScrollElement().scrollTop;
  }
});
