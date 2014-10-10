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
 */
pstj.material.Ripple = goog.defineClass(pstj.material.Element, {
  /**
   * Implements a simple ripple container.
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
    this.setAutoEventsInternal(EventMap.EventFlag.PRESS |
        EventMap.EventFlag.RELEASE);
    /**
     * Recentering flag for the wave.
     * @type {boolean}
     * @private
     */
    this.recenterRipples_ = false;
  },


  /**
   * Setter for the recentering of the waves.
   * @param {boolean} recenter
   */
  setRecenterRipples: function(recenter) {
    this.recenterRipples_ = recenter;
  },


  /** @override */
  onPress: function(e) {
    var wave = Wave.get(this);
    wave.setRecenter(this.recenterRipples_);
    this.getHandler().listenOnce(this, pstj.agent.Pointer.EventType.RELEASE,
        function(ev) {
          wave.handleRelease(ev);
        });
    wave.handlePress(e);
  }

});

goog.ui.registry.setDefaultRenderer(pstj.material.Ripple, RR);

goog.ui.registry.setDecoratorByClassName(RR.CSS_CLASS, function() {
  return new pstj.material.Ripple(null);
});

});  // goog.scope

