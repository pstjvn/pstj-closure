goog.provide('pstj.demos.iconcontainer');

goog.require('goog.ui.decorate');
goog.require('pstj.material.IconContainer');

(function() {
  goog.ui.decorate(document.querySelector('[is]'));

  var ci = 'arrow-drop-down';

  var ic = new pstj.material.IconContainer();
  ic.setIcon(ci);
  ic.render(document.querySelector('.rendertarget'));

  ic.getElement().addEventListener('click', function() {
    ci = (ci == 'arrow-drop-down' ? 'arrow-drop-up' : 'arrow-drop-down');
    ic.setIcon(ci);
  });
})();
