goog.provide('pstj.demos.input');

goog.require('pstj.material.Input');


(function() {

  var i1 = new pstj.material.Input();
  i1.type = 'tel';
  i1.name = 'phonenum';
  i1.value = '3443';
  i1.render();

})();

