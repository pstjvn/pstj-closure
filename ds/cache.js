goog.provide('pstj.ds.Cache');

goog.require('goog.object');

/**
 * Provides conventient cache object.
 * @constructor
 */
pstj.ds.Cache = function() {
  this.cache_ = {};
};

goog.scope(function() {

  var _ = pstj.ds.Cache.prototype;

  /**
   * Sets the cache for key.
   * @param {string} key The key.
   * @param {*} data The data.
   */
  _.set = function(key, data) {
    goog.object.set(this.cache_, key, data);
  };

  /**
   * Checks if the key exists in the cache.
   * @param {string} key The key.
   * @return {boolean}
   */
  _.has = function(key) {
    return goog.object.containsKey(this.cache_, key);
  };

  /**
   * Getter for cached values.
   * @param {string} key The key to lookup.
   * @return {*}
   */
  _.get = function(key) {
    if (this.has(key)) {
      return goog.object.get(this.cache_, key);
    }
    return null;
  };

  /**
   * Removes the cache for key.
   * @param {string} key The key to lookup.
   */
  _.remove = function(key) {
    if (this.has(key)) {
      goog.object.remove(this.cache_, key);
    }
  };

});
