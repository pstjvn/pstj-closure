require('../../../../library/closure/goog/bootstrap/nodejs.js');
require('../../deps.js');
require('../../demodeps.js');

// We need this in the node_modules...
var request = require('request');

goog.require('goog.Promise');
goog.require('goog.array');
goog.require('goog.json');
goog.require('pstj.codegen.emitter.Closure');
goog.require('pstj.codegen.parser.Sysmaster');
goog.require('pstj.codegen.parser.helper');

const files = ['forextend.json', 'base.json'];
const prefix =
    'http://213.231.158.90/~peterj/closure/apps/pstj/demos/codegen/testfiles/';
const getFile = url => {
  return new goog.Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(body);
    });
  });
};

/**
 * @param {!Array<!Object<string, ?>>} objects
 * @return {!Object<string, ?>}
 */
const combineObjects = objects =>
    pstj.codegen.parser.helper.sysmaster(objects, files);

const demo = api => {
  let parser = new pstj.codegen.parser.Sysmaster(api);
  let doc = parser.getDocument();
  let emitter = new pstj.codegen.emitter.Closure();
  emitter.setDocument(doc);
  console.log(emitter.generateCode());
};

(function() {
  goog.Promise
      .all(
          goog.array.map(
              files,
              (file) => {
                let url = prefix + file;
                return getFile(url);
              }))
      .then(sources => {
        return goog.array.map(sources, source => goog.json.parse(source));
      })
      .then(combineObjects)
      .then(demo);
})();
