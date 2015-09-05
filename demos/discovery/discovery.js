goog.provide('pstj.demos.sourcegen.discovery');

goog.require('goog.html.SafeHtml');
goog.require('goog.labs.net.xhr');
goog.require('pstj.ds.discovery.Document');
goog.require('pstj.sourcegen.ClosureGenerator');


/** @final {string} */
var testdataurl = 'testdata.json';


/**
 * Actual demo.
 * @param  {!Object} schema
 */
function demo(schema) {
  var doc = new pstj.ds.discovery.Document(schema);
  var generator = new pstj.sourcegen.ClosureGenerator(doc);
  var str = goog.html.SafeHtml.htmlEscape(generator.generate());
  document.getElementById('result').innerHTML = goog.html.SafeHtml.unwrap(str);
}

goog.labs.net.xhr.getJson(testdataurl).then(demo);
