#!/usr/bin/node

// How to run: nodejs/compiler.js  assets/icons.xml

// Inlcude support for closure library.
require('../../../library/closure/goog/bootstrap/nodejs.js');
require(__dirname + '/../../../templates/deps.js');
require(__dirname + '/../deps.js');
require(__dirname + '/../demodeps.js');


goog.require('pstj.sourcegen.ClosureGenerator');
goog.require('pstj.ds.discovery.Document');


// node requires
var fs = require('fs');
var args = require('args');
var request = require('request');

var _ = {};

var options = args.Options.parse([
  {
    name: 'uri',
    required: true,
    shortName: 'u',
    help: 'The URI to read the discovery document from'
  },
  {
    name: 'output-path',
    shortName: 'o',
    required: true,
    help: 'The directory in which to put the generated file'
  }
]);

function dieWithHelp() {
  console.log('Cannot parse options!\n');
  console.log(options.getHelp());
  process.exit(1);
}

function httpget(url, cb) {
  request(url, function(err, response, body) {
    if (err) throw new Error('Cannot retrieve remote discovery document: ' +
          err);
    cb(body);
  });
}

function pathget(path, cb) {

}

/**
 * Given a serialized discovery document returns the generated code based on it.
 * @param  {string} json
 * @return {string}
 */
function processJSONText(json) {
  var document = new pstj.ds.discovery.Document(goog.json.parse(json));
  var generator = new pstj.sourcegen.ClosureGenerator(document);
  return generator.generate();
}

// Exit with error when no options are met.
if (process.argv.length != 6) dieWithHelp();

var parsed = args.parser(process.argv).parse(options);
var uri = parsed['uri'];
var outputpath = parsed['output-path'];
var re = new RegExp('^[0-9A-Za-z-]+?\\.[A-Za-z]+?(:[0-9]+?|)');

if (uri.indexOf('http') == 0 ||
    uri.indexOf('localhost') != -1 ||
    re.test(uri)) {
  httpget(uri, function(result) {
    var output = processJSONText(result);
    fs.writeFileSync(outputpath + '/rpc.js', output);
  });
} else {
  pathget(uri, processJSONText);
}
