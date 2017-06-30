goog.module('pstj.demos.swagger.document');

var Document = goog.require('pstj.ds.swagger.Document');
var xhr = goog.require('goog.labs.net.xhr');


xhr.getJson('example.json').then(function(_) {
  Document.fromMap(_);
});
