goog.provide('pstj.ds.jsonschema.parser');

goog.require('goog.Promise');
goog.require('goog.array');
goog.require('goog.labs.net.xhr');
goog.require('pstj.ds.jsonschema.Class');
goog.require('pstj.ds.jsonschema.Property');
goog.require('pstj.ds.jsonschema.resolver');

goog.scope(function() {
var _ = pstj.ds.jsonschema.parser;
var xhr = goog.labs.net.xhr;


/**
 * Prefix to use when resolving paths.
 * @type {string}
 * @private
 */
_.prefix_ = '';


/**
 * The namespace to use globally for all classes generated on a single pass.
 * @type {string}
 * @private
 */
_.namespacePrefix_ = 'pstj.ds.dto';


/**
 * Maps of 'path' to actual classes.
 * @type {Object<string, pstj.ds.jsonschema.Class>}
 * @private
 */
_.map_ = {};


/**
 * Starts the loading of the JSONSchema definitions. Will return a promise
 * that resolves to all parsers as a list.
 *
 * @param {!Array<string>} paths The paths to load.
 * @return {goog.Promise<Array<pstj.ds.jsonschema.Parser>>}
 */
_.load = function(paths) {
  var promises = [];
  goog.array.forEach(paths, function(path) {
    promises.push(
        xhr.get(_.prefix_ + path + '.json').then(
            goog.partial(_.handleSingleLoad, _.namespacePrefix_, path)
        ));
  });
  return goog.Promise.all(promises);
};


/**
 * Special function to apply partially for handling load of files.
 * @param {string} namespaceprefix
 * @param {string} path The name of the file.
 * @param {string} jsonstring The serialized object.
 * @return {!pstj.ds.jsonschema.Class}
 */
_.handleSingleLoad = function(namespaceprefix, path, jsonstring) {
  var obj = goog.json.parse(jsonstring);
  var klass = new pstj.ds.jsonschema.Class(namespaceprefix);
  klass.setSourceDefinition(obj);
  goog.object.set(_.map_, path, klass);
  return klass;
};


/**
 * Uses global registry to resolve reference types.
 * @param {string} ref The reference string usually a path.
 * @return {string}
 */
_.getTypeForReference = function(ref) {
  return '';
};


/**
 * Sets the global prefix for resolving file paths.
 * @param {string} prefix
 */
_.setGlobalPrefix = function(prefix) {
  _.prefix_ = prefix;
};


/**
 * Sets the namespace to be used for generated classes.
 * For example if you set this prefix to 'myapp.dto' and
 * you have s JSONSchema with 'title' == 'User' the
 * generated class will be 'myapp.dto.User'
 *
 * @param {string} prefix
 */
_.setGlobalNamespacePrefix = function(prefix) {
  _.namespacePrefix_ = prefix;
};


/**
 * Resets the resolver fn.
 */
pstj.ds.jsonschema.resolver.setResolveFunction(function(name) {
  // name should be the path
  var klass = _.map_[name];
  if (klass) {
    return klass;
  } else {
    throw new Error('Cannot resolve class for path: ' + name);
  }
});


});  // goog.scope
