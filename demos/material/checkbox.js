goog.provide('pstj.demos.checkbox');

goog.require('goog.array');
goog.require('goog.ui.decorate');
goog.require('pstj.material.Checkbox');

(function() {
  goog.array.forEach(
      document.querySelectorAll('.material-checkbox'),
      function(node) {
        goog.ui.decorate(node);
      });

  var cb = new pstj.material.Checkbox('Rendered');
  cb.setUsePointerAgent(true);
  cb.render();

  var cb2 = new pstj.material.Checkbox('Rendered (checked)');
  cb2.setUsePointerAgent(true);
  cb2.setChecked(true);
  cb2.render();

  var cb3 = new pstj.material.Checkbox('Rendered (disabled)');
  cb3.setUsePointerAgent(true);
  cb3.setEnabled(false);
  cb3.render();

  var cb4 = new pstj.material.Checkbox('Rendered (checked, disabled)');
  cb4.setUsePointerAgent(true);
  cb4.setChecked(true);
  cb4.setEnabled(false);
  cb4.render();
})();
