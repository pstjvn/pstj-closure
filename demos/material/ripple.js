goog.provide('pstj.demos.ripple');

goog.require('goog.ui.decorate');
goog.require('pstj.material.Element');
goog.require('pstj.material.EventMap');
goog.require('pstj.material.Ripple');

(function() {
  var ripple = new pstj.material.Ripple('Rendered');
  ripple.setOpacity(0.2);
  ripple.setRecenterRipples(true);
  ripple.setUsePointerAgent(true);
  ripple.render(document.querySelector('.rendertarget'));

  var el = goog.ui.decorate(document.querySelector('.core-element'));

  document.querySelector('#opacity').addEventListener('change', function(e) {
    var val = e.target.value;
    var opacity = parseFloat(val);
    if (!isNaN(opacity)) {
      if (opacity > 1) opacity = 1;
      if (opacity < 0) opacity = 0;
      ripple.setOpacity(opacity);
      el.getChildAt(0).setOpacity(opacity);
    }
  });

  document.querySelector('#recenter').addEventListener('change', function(e) {
    var recenter = (e.target.value == 1);
    ripple.setRecenterRipples(recenter);
    el.getChildAt(0).setRecenterRipples(recenter);
  });

  document.querySelector('#eventtypes').addEventListener('change', function(e) {
    var autoevents = (e.target.value == 1) ?
        pstj.material.EventMap.EventFlag.TAP : (
            pstj.material.EventMap.EventFlag.PRESS |
            pstj.material.EventMap.EventFlag.RELEASE);

    ripple.setAutoEventsInternal(autoevents);
    el.getChildAt(0).setAutoEventsInternal(autoevents);
  });

  document.querySelector('#rippletype').addEventListener('change', function(e) {
    var android = (e.target.value == 1);
    window.pstj.material.Wave.USE_NATIVE_RIPPLE = android;
  });
})();
