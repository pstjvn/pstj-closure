goog.provide('pstj.demos.iconcontainer');

goog.require('goog.ui.decorate');
goog.require('pstj.material.IconContainer');

(function() {
  goog.ui.decorate(document.querySelector('[is]'));

  var ic = new pstj.material.IconContainer();
  ic.setIcon('menu');
  ic.render(document.querySelector('.rendertarget'));
})();
