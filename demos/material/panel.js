goog.provide('pstj.demos.panel');

goog.require('pstj.material.Panel');


(function() {

  var panel1 = new pstj.material.Panel();
  panel1.decorate(document.querySelector('.material-panel'));

  var panel2 = new pstj.material.Panel();
  panel2.render(document.querySelector('#renderer'));

  document.body.addEventListener('click', function(e) {
    panel1.setShadow(!panel1.isShadow());
    panel1.setOverlay(!panel1.isOverlay());

    panel2.setShadow(!panel2.isShadow());
    panel2.setOverlay(!panel2.isOverlay());
  });

})();
