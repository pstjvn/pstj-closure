goog.provide('pstj.ds.jsonschema.resolver');


goog.scope(function() {
var _ = pstj.ds.jsonschema.resolver;


/**
 * Attempts to resolve JSONSchema short name to an actual
 * Class instance.
 * @param {string} name The short name as seen in the $_reference or $_extends
 *    property in the JSON.
 * @return {pstj.ds.jsonschema.Class?}
 */
_.resolve = function(name) {
  if (_.resolveFn_) {
    return _.resolveFn_(name);
  } else {
    throw new Error('No resolver function set, consider setting one');
  }
};


/**
 * Setter for the resolver function.
 * @param {function(string): pstj.ds.jsonschema.Class?} fn The function.
 */
_.setResolveFunction = function(fn) {
  _.resolveFn_ = fn;
};


/**
 * References the resolved runction to be used as configured.
 * @private
 * @type {function(string): pstj.ds.jsonschema.Class?}
 */
_.resolveFn_ = null;

});  // goog.scope
