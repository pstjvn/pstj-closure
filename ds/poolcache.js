goog.provide('pstj.ds.PoolCache');

goog.require('pstj.ds.Cache');



/**
 * Provides cache that releases the object in the pool when it is removed from
 * the cache.
 * @constructor
 * @extends {pstj.ds.Cache}
 * @param {!goog.structs.Pool} pool The pool to use in the cache.
 */
pstj.ds.PoolCache = function(pool) {
  goog.base(this);
  /**
   * @type {goog.structs.Pool}
   * @private
   */
  this.pool_ = pool;
};
goog.inherits(pstj.ds.PoolCache, pstj.ds.Cache);


goog.scope(function() {

var _ = pstj.ds.PoolCache.prototype;


/** @inheritDoc */
_.remove = function(key) {
  if (this.has(key)) {
    this.pool_.releaseObject(goog.asserts.assertObject(this.get(key)));
  }
  goog.base(this, 'remove', key);
};

});  // goog.scope
