goog.provide('pstj.demos.icon');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.decorate');
goog.require('pstj.material.IconContainer');
goog.require('pstj.math.utils');


(function() {
  var values = [
    'menu',
    'none',
    'close',
    'plus',
    'check',
    'back-arrow',
    'forward-arrow'
  ];
  var ic = /** @type {pstj.material.IconContainer} */(
      goog.ui.decorate(document.querySelector('[is]')));

  goog.events.listen(ic.getElement(), goog.events.EventType.CLICK, function(e) {
    ic.setIcon(pstj.math.utils.pick(values));
  });
})();
