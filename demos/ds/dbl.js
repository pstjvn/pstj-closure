goog.provide('pstj.demos.ds.dbl');

goog.require('pstj.ds.DoubleBufferedList');

goog.scope(function() {
  'use strict';
  let dbl = new pstj.ds.DoubleBufferedList();
  var toPrint = '';

  for (let i = 0; i < 10; i++) {
    dbl.add(i);
  }
  console.log(dbl.length == 10);
  dbl.forEach(function(item, index) {
    toPrint += ' ' + item.toString();
    dbl.add(item * 2);
  });
  console.log(toPrint);

  toPrint = '';
  dbl.clear();
  console.log(dbl.length == 10);
  dbl.forEach(function(item, index) {
    toPrint += ' ' + item.toString();
  });
  console.log(toPrint);

});  // goog.scope
