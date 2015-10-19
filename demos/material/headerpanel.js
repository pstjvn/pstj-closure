goog.provide('pstj.demos.headerpanel');

goog.require('goog.ui.decorate');
goog.require('pstj.material.HeaderPanel');


goog.ui.decorate(document.querySelector('.material-header-panel'));


(function() {
  var hp1 = new pstj.material.HeaderPanel();
  hp1.setType('waterfall');
  hp1.render(document.querySelector('.container'));
  var div = document.createElement('div');
  div.className = 'content';
  hp1.getElement().querySelector(
      '.material-header-panel-main-content').appendChild(div);
  hp1.getChildAt(0).setContent('Rendered');
})();

