// TODO: rename this to a sane namespace (pstj.ds.CyclicMap)
goog.provide('pstj.ds.MapRotator');

goog.require('goog.Disposable');

/**
 * @fileoverview Provides cyclic mapping for value retrieval. Use case would
 *   be to have a limited set of values we want to assign to unlimited number
 *   of entities, once the available values are depleted, the values are
 *   reused in the same order.
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Provides means the use a limited number of record items to populate over a
 *   larger list mapping the longer list ids to the shorter list of available
 *   values on a rotational basis.
 * @param {Array.<number|string>=} list The list of value to use to assign to
 *   the id map.
 * @constructor
 * @extends {goog.Disposable}
 */
pstj.ds.MapRotator = function(list) {
  goog.base(this);
  /**
   * The internal map instance.
   * @type {Object}
   * @private
   */
  this.map_ = {};
  /**
   * Points to the next index to use in the list of values.
   * @type {number}
   * @private
   */
  this.listIndex_ = 0;
  /**
   * Contains the map to use and rotate over.
   * @type {Array.<number|string>}
   * @private
   */
  this.list_ = null;

  if (goog.isArray(list)) {
    this.loadMap(list);
  }
};
goog.inherits(pstj.ds.MapRotator, goog.Disposable);

/**
 * Loads a map to be used by the instance.
 * @param {Array.<number|string>} list The map to rotate over.
 */
pstj.ds.MapRotator.prototype.loadMap = function(list) {
  this.list_ = list;
};

/**
 * Registers an ID and maps a value from the list to it.
 * @param {string|number} id The ID to register for a value.
 */
pstj.ds.MapRotator.prototype.register = function(id) {
  if (goog.isNull(this.list_)) {
    throw new Error('The list of values have not been loaded');
  }
  if (!this.map_[id]) {
    this.map_[id] = this.list_[this.listIndex_];
    this.listIndex_++;
    if (this.listIndex_ >= this.list_.length) {
      this.listIndex_ = 0;
    }
  }
};

/**
 * Gets the mapped value for an ID.
 * @param {number|string} id The id to retrieve value for.
 * @return {number|string} The value that matched the ID.
 */
pstj.ds.MapRotator.prototype.get = function(id) {
  this.register(id);
  return this.map_[id];
};

/** @inheritDoc */
pstj.ds.MapRotator.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.list_ = null;
  this.map_ = null;
};
