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
goog.require('pstj.debug');



/**
 * Provides simple abstraction over regular object, but is useful to measure
 * the amount of items stored.
 *
 * @constructor
 * @param {string=} opt_name Optional, name of the cache, used only for debug
 *    and to notify the number ot items.
 * @template T
 */
pstj.ds.Cache = function(opt_name) {
  /**
   * @type {!string}
   * @private
   */
  this.name_ = opt_name || 'Unnamed cache';

  /**
   * The actual object we will use to store the key/value pairs.
   *
   * @type {Object.<string, T>}
   * @private
   */
  this.cache_ = {};

  /**
   * How many objects are stored in the cache.
   *
   * @type {number}
   * @private
   */
  this.count_ = 0;

  if (goog.DEBUG) {
    pstj.debug.bus.subscribe(pstj.debug.Topic.DUMP, function() {
      console.log('Cache name:' + this.name_ + ' -- ' + this.count_);
    }, this);
  }
};


/**
 * Creates a new record in the cache or updates existing one.
 *
 * @param {!string} key The key.
 * @param {T} data The data.
 */
pstj.ds.Cache.prototype.set = function(key, data) {
  if (goog.DEBUG) {
    if (!this.has(key)) {
      this.count_++;
    }
  }
  goog.object.set(this.cache_, key, data);
};


/**
 * Checks if the key exists in the cache.
 *
 * @param {string} key The key.
 * @return {boolean}
 */
pstj.ds.Cache.prototype.has = function(key) {
  return goog.object.containsKey(this.cache_, key);
};


/**
 * Retrieves a previously stored value by its key. If the key does not
 * exists null is returned.
 *
 * @param {!string} key The key to lookup.
 * @return {T}
 */
pstj.ds.Cache.prototype.get = function(key) {
  if (this.has(key)) {
    return goog.object.get(this.cache_, key);
  }
  return null;
};


/**
 * Deletes the key/value pair from the cache. If the key does not exists
 * nothing is changed.
 *
 * @param {!string} key The key to look up for.
 */
pstj.ds.Cache.prototype.remove = function(key) {
  if (this.has(key)) {
    if (goog.DEBUG) {
      this.count_--;
    }
    goog.object.remove(this.cache_, key);
  }
};


/**
 * Checks if the cache is currently empty.
 * @return {boolean}
 */
pstj.ds.Cache.prototype.isEmpty = function() {
  return goog.object.isEmpty(this.cache_);
};


/**
 * Wraps the library object call to always point to the right object.
 *
 * @param {?function(this:THIS,T,string,Object.<string,T>):boolean} f The
 *    function to call for every element. This function takes 3 arguments
 *    (the element, the index and the object) and should return a boolean.
 * @param {THIS=} opt_obj This is used as the 'this' object within f.
 * @return {boolean} false if any element fails the test.
 * @template THIS, T
 */
pstj.ds.Cache.prototype.every = function(f, opt_obj) {
  return goog.object.every(this.cache_, f, opt_obj);
};


/**
 * Helper counter to determine the number of cach instances used in the
 * application.
 *
 * @type {number}
 * @private
 */
pstj.ds.Cache.count_ = 0;


/**
 * Creates a new cache with the desired name.
 *
 * @param {string=} opt_name OPtional name of the cache (for debug only).
 * @return {pstj.ds.Cache}
 */
pstj.ds.Cache.create = function(opt_name) {
  if (goog.DEBUG) {
    pstj.ds.Cache.count_++;
    console.log('Cache containers count:' + pstj.ds.Cache.count_);
  }
  return new pstj.ds.Cache(opt_name);
};
