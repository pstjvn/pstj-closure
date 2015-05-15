#!/usr/bin/node

// How to run: nodejs/compiler.js  assets/icons.xml

// Inlcude support for closure library.
require('../../../library/closure/goog/bootstrap/nodejs.js');
require(__dirname + '/../deps.js');

goog.require('goog.Promise');
goog.require('goog.array');
goog.require('goog.string');
goog.require('pstj.ds.jsonschema.parser');

// node requires
var fs = require('fs');

var _ = {};

goog.scope(function() {
var array = goog.array;
var object = goog.object;
var string = goog.string;
var parser = pstj.ds.jsonschema.parser;

/**
 * Keep reference to the resolved paths so we can use then to
 * write files out.
 * @type {Array<string>}
 * @protected
 */
_.paths = null;


/**
 * Main entry point of the app.
 * @param {string} namespace The namespace to use.
 * @param {string} path to read from.
 * @param {string} path to write to.
 */
_.invoke = function(namespace, inpath, outpath) {
  // console.log('Namespace: ' + namespace);
  // console.log('Where to read from: ' + inpath);
  // console.log('Where to write files: ' + outpath);

  // not really used here...
  parser.setGlobalNamespacePrefix(namespace);
  parser.setGlobalPrefix(inpath + '/');


  _.findAllSourceFiles(inpath + '/').then(function(result) {
    _.paths = result;
    parser.load(result).then(_.handleLoadedClasses).then(function(classes) {
      // for each class write to its proper path.
      array.forEach(classes, function(klass, index) {
        fs.writeFile(outpath + _.paths[index] + '.js',
            klass.getBuffer().join(''), 'utf-8');
      });
    });
  });
};


/**
 * Handles the loaded classes.
 * @param {Array<pstj.ds.jsonschema.Class>} classes
 * @return {Array<pstj.ds.jsonschema.Class>}
 */
_.handleLoadedClasses = function(classes) {
  //for each classes
  array.forEach(classes, function(klass) {
    klass.createProperties();
    klass.print();
  });

  return classes;
};


/**
 * Finds all files that need to be loaded.
 * @param {string} path The path to look into.
 * @return {goog.Promise<Array<string>>}
 */
_.findAllSourceFiles = function(path) {
  return new goog.Promise(function(resolve, reject) {
    fs.readdir(path, function(err, files) {
      // The list of file names without the .json extention.
      var result = [];
      if (err) reject(err);
      else {
        array.forEach(files, function(filename) {
          if (filename.match(/\.json$/)) {
            result.push(filename.replace(/\.json$/, ''));
          }
        });
        resolve(result);
      }
    });
  });
};

});  // goog.scope

/** @override */
pstj.ds.jsonschema.parser.load = function(paths) {
  var promises = [];
  goog.array.forEach(paths, function(path) {
    promises.push(new goog.Promise(function(resolve, reject) {
      fs.readFile(pstj.ds.jsonschema.parser.prefix_ + path +
          '.json', function(err, text) {

        if (err) reject(err);
        else {
          resolve(pstj.ds.jsonschema.parser.handleSingleLoad(
              pstj.ds.jsonschema.parser.namespacePrefix_, path, text));
        }
      });
    }));
  });
  return goog.Promise.all(promises);
};

_.invoke(process.argv[2], process.argv[3], process.argv[4]);