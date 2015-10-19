goog.provide('pstj.demos.list');

goog.require('pstj.material.Item');
goog.require('pstj.material.List');


/**
 * Implements our demo.
 */
pstj.demos.list = function() {
  var model = new Array(1000);
  for (var i = 0; i < 1000; i++) {
    model[i] = i.toString();
  }

  var list = new pstj.material.List();
  list.setCreateListItem(function() {
    return new pstj.material.Item();
  });
  list.render(document.querySelector('.container'));
  list.setModel(model);
};

// Auto-exec
pstj.demos.list();

