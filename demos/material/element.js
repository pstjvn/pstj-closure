goog.provide('pstj.demos.element');

goog.require('pstj.material.Element');

(function() {
  var el = new pstj.material.Element('Rendered');
  el.render(document.body);
  var el2 = new pstj.material.Element();
  el2.decorate(document.querySelector('.core-element'));
})();
