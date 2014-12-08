goog.provide('pstj.demos.shadow');

goog.require('pstj.material.Element');
goog.require('pstj.material.Shadow');

(function() {
  var shadow = new pstj.material.Shadow();
  shadow.setTransitioning(true);
  shadow.render(document.querySelector('.render-target'));

  var el2 = new pstj.material.Element();
  el2.decorate(document.querySelector('.core-element'));

  var el3 = new pstj.material.Element();
  el3.decorate(document.querySelector('.core-element.withtransition'));

  var inc = true;
  var depth = 0;
  el2.getElement().addEventListener('click', function(e) {
    depth = depth + (inc ? 1 : -1);
    if (depth >= 5 || depth <= 0) inc = !inc;
    el2.getChildAt(0).setDepth(depth);
    el3.getChildAt(0).setDepth(depth);
    shadow.setDepth(depth);
  });
})();
