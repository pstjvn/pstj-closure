/**
 * @fileoverview Provides the default implementation for the ripple effect
 * as found in the paper reference implementation.
 *
 * Note that while it is usable, a more robust variant that leaves less DOM
 * nodes inside the tree is available.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.Ripple');

goog.require('pstj.material.Element');
goog.require('pstj.material.EventMap');
goog.require('pstj.material.RippleRenderer');
goog.require('pstj.material.Wave');


goog.scope(function() {
var Wave = pstj.material.Wave;
var EventMap = pstj.material.EventMap;
var RR = pstj.material.RippleRenderer;


/**
 * Implements the ripple effect element.
 * Note that by default the ripple subscribe to automatially listen for
 * TAP events (i.e. if a TAP event hits the ripple it will react). TAP
 * event can hit the ripple from a child or from itself if pointer agent
 * is enabled.
 *
 * Note that by default the pointer agent is NOT enabled, but you can call
 * manually the onPress/onRelase or onTap methods to simulate clicks from
 * parents of the ripple.
 *
 * If you want to use the ripple as a stand alone effect note that it uses
 * TAP by default. Also note thatthe pointer agent will generate all of
 * those events in that order: press, release, tap; but listeners will be
 * assigned as per the auto event mask.
 */
pstj.material.Ripple = goog.defineClass(pstj.material.Element, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   * @constructor
   * @extends {pstj.material.Element}
   * @struct
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.material.Element.call(this, opt_content, opt_renderer, opt_domHelper);
    this.setAutoEventsInternal(EventMap.EventFlag.TAP);
    /**
     * Recentering flag for the wave.
     * @type {boolean}
     * @private
     */
    this.recenterRipples_ = false;
    /**
     * Reference to the wave instance currently being pressed in.
     * @type {pstj.material.Wave}
     * @private
     */
    this.wave_ = null;
    /**
     * Opacity to use with the waves in this ripple.
     * @type {number}
     * @private
     */
    this.opacity_ = 0.25;
  },


  /**
   * Setter for the recentering of the waves.
   * @param {boolean} recenter
   */
  setRecenterRipples: function(recenter) {
    this.recenterRipples_ = recenter;
  },


  /** @inheritDoc */
  decorateInternal: function(el) {
    this.recenterRipples_ = el.hasAttribute('recenter');
    var opacity = el.getAttribute('opacity');
    if (opacity) {
      opacity = parseFloat(opacity);
      if (isNaN(opacity) || opacity < 0 || opacity > 1) {
        opacity = this.opacity_;
      }
    } else {
      opacity = this.opacity_;
    }
    this.setOpacity(opacity);
    goog.base(this, 'decorateInternal', el);
  },


  /**
   * Sets the ripple opacity. It will be used as initial opacity for the
   * waves it creates.
   * @param {number} o A number between 0 and 1.
   */
  setOpacity: function(o) {
    this.opacity_ = o;
  },


  /** @override */
  // This is commented out as TAP is preffered. If you have really good reason
  // you can use press/release as triggers as shown here.
  onPress: function(e) {
    this.wave_ = this.getNewWave();
    this.getHandler().listenOnce(this, pstj.agent.Pointer.EventType.RELEASE,
        this.onRelease);
    this.wave_.handlePress(e);
  },


  /** @inheritDoc */
  onRelease: function(e) {
    if (this.wave_) {
      this.wave_.handleRelease(e);
      this.wave_ = null;
    }
  },


  /** @override */
  onTap: function(e) {
    this.getNewWave().handleTap(e);
  },


  /**
   * Obtains a new wave to use in the ripple.
   * @return {pstj.material.Wave}
   */
  getNewWave: function() {
    var w = Wave.get(this);
    w.setRecenter(this.recenterRipples_);
    w.setInitialOpacity(this.opacity_);
    return w;
  }

});

goog.ui.registry.setDefaultRenderer(pstj.material.Ripple, RR);


goog.ui.registry.setDecoratorByClassName(RR.CSS_CLASS, function() {
  return new pstj.material.Ripple(null);
});

});  // goog.scope

