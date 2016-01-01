goog.provide('pstj.demos.togglebutton');

goog.require('goog.array');
goog.require('goog.ui.decorate');
goog.require('pstj.material.ToggleButton');


(function() {
  goog.array.forEach(
      document.querySelectorAll('.material-toggle-button'),
      function(node) {
        goog.ui.decorate(node);
      });

  var t1 = new pstj.material.ToggleButton('Test 1');
  var t2 = new pstj.material.ToggleButton('Test 2');
  var t3 = new pstj.material.ToggleButton();
  var t4 = new pstj.material.ToggleButton();
  var t5 = new pstj.material.ToggleButton();


  t2.setChecked(true);
  t3.setEnabled(false);
  t4.setChecked(true);
  t4.setEnabled(false);

  t1.render(document.getElementById('c1'));
  t2.render(document.getElementById('c2'));
  t3.render(document.getElementById('c3'));
  t4.render(document.getElementById('c4'));
  t5.render(document.getElementById('c5'));

  setTimeout(function() {
    t5.setEnabled(false);
  }, 5000);
})();
