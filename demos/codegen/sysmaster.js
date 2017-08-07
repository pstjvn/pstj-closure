goog.provide('pstj.demos.codegen.parser.Sysmaster');

goog.require('goog.Promise');
goog.require('goog.labs.net.xhr');
goog.require('pstj.codegen.emitter.Closure');
goog.require('pstj.codegen.parser.Sysmaster');
goog.require('pstj.codegen.parser.helper');


/** @const {string} */
const prefix = 'testfiles/';

/** @const {!Array<string>} */
const sources = ['forextend.json', 'base.json'];

/** @return {!Array<!goog.Promise<Object>>} */
const createFilePromises = function() {
  return sources.map(source => goog.labs.net.xhr.getJson(prefix + source));
};

/**
 * @param {!Array<!Object<string, ?>>} objects
 * @return {!Object<string, ?>}
 */
const combineObjects = objects =>
    pstj.codegen.parser.helper.sysmaster(objects, sources);

/**
 * @param {!Object<string, ?>} api
 */
const demo = api => {
  let parser = new pstj.codegen.parser.Sysmaster(api);
  let doc = parser.getDocument();
  let emitter = new pstj.codegen.emitter.Closure();
  emitter.setDocument(doc);
  document.getElementById('result').textContent = (emitter.generateCode());
};

goog.Promise.all(createFilePromises()).then(combineObjects).then(demo);