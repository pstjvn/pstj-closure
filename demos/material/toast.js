goog.provide('pstj.demos.toast');

goog.require('pstj.material.Toast');

var contents = [
  'Hellow world',
  'Very long and ugly line of text that is really now what we want',
  'Very long and ugly line of text that is really now what we want at all' ];
var labels = [
  'close',
  'regular',
  'label too big and ugly to read'
];
var idx = 0;
var toast = new pstj.material.Toast('Hello world');
toast.setLabel('or not');
toast.render(document.querySelector('.rendertarget'));
document.querySelector('body').addEventListener('click', function() {
  if (!toast.isOpen()) {
    toast.setContent(contents[idx]);
    toast.setLabel(labels[idx]);
    idx++;
    if (idx > 2) idx = 0;
  }
  toast.toggle();
});
