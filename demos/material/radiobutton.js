goog.provide('pstj.demos.radiobutton');

goog.require('goog.array');
goog.require('goog.ui.decorate');
goog.require('pstj.material.RadioButton');

(function() {
  goog.array.forEach(
      document.querySelectorAll('.material-radio-button'),
      function(el) {
        goog.ui.decorate(el);
      });

  var rb0 = new pstj.material.RadioButton('Rendered');
  var rb1 = new pstj.material.RadioButton('Rendered (checked)');
  var rb2 = new pstj.material.RadioButton('Rendered (disabled)');
  var rb3 = new pstj.material.RadioButton('Rendered (checked, disabled');

  rb1.setChecked(true);
  rb2.setEnabled(false);
  rb3.setChecked(true);
  rb3.setEnabled(false);

  rb0.render();
  rb1.render();
  rb2.render();
  rb3.render();
})();
