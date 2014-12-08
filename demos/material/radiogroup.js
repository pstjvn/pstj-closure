goog.provide('pstj.demos.radiogroup');

goog.require('goog.ui.decorate');
goog.require('pstj.material.RadioGroup');

(function() {
  var _1 = goog.ui.decorate(document.getElementById('dec1'));
  var _3 = goog.ui.decorate(document.getElementById('dec3'));
  var _2 = goog.ui.decorate(document.getElementById('dec2'));
  var _3 = goog.ui.decorate(document.getElementById('dec4'));

  var a = new pstj.material.RadioGroup();
  a.values = '1,2,3,0';
  a.labels = 'Mon,Fri,Sun,None';
  a.value = '2';
  a.name = 'PreferredDay';
  a.render(document.getElementById('rend1'));

  var b = new pstj.material.RadioGroup();
  b.setEnabled(false);
  b.values = '1,2,3,0';
  b.labels = 'Mon,Fri,Sun,None';
  b.value = '2';
  b.name = 'PreferredDay';
  b.render(document.getElementById('rend2'));

  var c = new pstj.material.RadioGroup();
  c.values = '1,2,3,0';
  c.labels = 'Mon,Fri,Sun,None';
  c.value = '2';
  c.name = 'PreferredDay';
  c.render(document.getElementById('rend3'));

  setTimeout(function() {c.setEnabled(false)}, 2000);
})();
