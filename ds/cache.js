/**
 * @fileoverview Provides simplistic convenience key / value pair caching
 * implemented as literal object hash. The wrapper is only used for convenience
 * and does not provide any advantage over using literal object for storing the
 * values. Use it only to simplify your code where simple key / value pair
 * storage is used.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('pstj.ds.Cache');

goog.require('goog.object');



/**
 * Provides wrapper for the literal object hash table metaphor. Used to maintain
 * cache of key/value pairs.
 *
 * @constructor
 */
pstj.ds.Cache = function() {
  /**
   * @type {Object.<string, *>}
   * @private
   */
  this.cache_ = {};
};


/**
 * Sets the cache for key.
 * @param {string} key The key.
 * @param {*} data The data.
 */
pstj.ds.Cache.prototype.set = function(key, data) {
  goog.object.set(this.cache_, key, data);
};


/**
 * Checks if the key exists in the cache.
 * @param {string} key The key.
 * @return {boolean}
 */
pstj.ds.Cache.prototype.has = function(key) {
  return goog.object.containsKey(this.cache_, key);
};


/**
 * Getter for cached values.
 * @param {string} key The key to lookup.
 * @return {*}
 */
pstj.ds.Cache.prototype.get = function(key) {
  if (this.has(key)) {
    return goog.object.get(this.cache_, key);
  }
  return null;
};


/**
 * Removes the cache for key.
 * @param {string} key The key to lookup.
 */
pstj.ds.Cache.prototype.remove = function(key) {
  if (this.has(key)) {
    goog.object.remove(this.cache_, key);
  }
};


/**
 * Wraps the library object call to always point to the right object.
 * @param {?function(this:T,V,string,Object.<string,V>):boolean} f The function
 * to call for every element. This function takes 3 arguments (the element,
 * the index and the object) and should return a boolean.
 * @param {T=} opt_obj This is used as the 'this' object within f.
 * @return {boolean} false if any element fails the test.
 * @template T,V
 */
pstj.ds.Cache.prototype.every = function(f, opt_obj) {
  return goog.object.every(this.cache_, f, opt_obj);
};
