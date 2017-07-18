goog.provide('pstj.demos.codegen.parser.Sysmaster');

goog.require('goog.Promise');
goog.require('goog.labs.net.xhr');
goog.require('pstj.codegen.parser.Sysmaster');
goog.require('pstj.codegen.parser.helper');


/** @const {string} */
const prefix = 'testfiles/';

/** @const {!Array<string>} */
const sources = [
  'a.json',
  'b.json'
];

/** @return {!Array<!goog.Promise<Object>>} */
const createFilePromises = function() {
  return sources.map(source => goog.labs.net.xhr.getJson(prefix + source));
};

goog.Promise.all(createFilePromises())
    .then(function(objects) {
      pstj.codegen.parser.helper.sysmaster(objects, sources);
    })
    .then(function(api) {
      let parser = new pstj.codegen.parser.Sysmaster(api);
      let doc = parser.getDocument();
      console.log(doc);
    });
