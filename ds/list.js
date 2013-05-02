goog.provide('pstj.ds.List');
goog.provide('pstj.ds.List.Event');
goog.provide('pstj.ds.List.EventType');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('pstj.ds.ListItem');

/**
 * @fileoverview Provides class that presents a list of pstj.ds.ListItem's.
 * This is inspired by the goog.datasource package, however it does not
 * support nested lists. So it is basically one fold list of items.
 *
 * @author  regardingscot@gmail.com (Peter StJ)
 */

/**
 * List that keeps track of the current index. Access is optimized with maps
 *   of the indexes and ids. This means that the list does not support
 *   duplicates, error is throwsn if you attempt to add items with ID that is
 *   already in the list.
 * @constructor
 * @param {Array.<pstj.ds.ListItem>|Array.<Object>=} opt_nodes Optionally,
 *   array of list items to initialize the list with or array of literal
 *   record objects to convert to list items.
 * @extends {goog.events.EventTarget}
 */
pstj.ds.List = function(opt_nodes) {
  goog.base(this);
  this.list_ = [];
  this.map_ = {};
  this.indexMap_ = {};
  var convert = false;
  if (opt_nodes) {
    if (opt_nodes.length > 0 && !(opt_nodes[0] instanceof pstj.ds.ListItem)) {
      convert = true;
    }
    for (var i = 0, len = opt_nodes.length; i < len; i++) {
      if (convert) {
        this.add(new pstj.ds.ListItem(opt_nodes[i]));
      } else {
        this.add(/** @type {!pstj.ds.ListItem} */ (opt_nodes[i]));
      }
    }
  }
};
goog.inherits(pstj.ds.List, goog.events.EventTarget);

/**
 * The events that the listing can emit.
 * @enum {string}
 */
pstj.ds.List.EventType = {
  ADD: goog.events.getUniqueId('add'),
  UPDATE: goog.events.getUniqueId('update'),
  DELETE: goog.events.getUniqueId('delete')
};

// Implement list interface.

/**
 * The list of items.
 * @type {!Array.<pstj.ds.ListItem>}
 * @private
 */
pstj.ds.List.prototype.list_;

/**
 * The id -> item map, stores the id as a key and the item as value.
 * @type {!Object}
 * @private
 */
pstj.ds.List.prototype.map_;

/**
 * Map of id pointing to indexes. The id is stored as a key and the index of
 *   the item in the list is stored as value.
 * @type {!Object}
 * @private
 */
pstj.ds.List.prototype.indexMap_;

/**
 * The list of indexes that are currently filtered out.
 * @type {Array.<number>}
 * @private
 */
pstj.ds.List.prototype.filteredOutIndexes_;

/**
 * The filter function.
 * @type {function(pstj.ds.ListItem): boolean|null}
 * @private
 */
pstj.ds.List.prototype.filterFn_ = null;

/**
 * Hold reference to the node that is currently interpreted as active.
 * @type {number}
 * @private
 */
pstj.ds.List.prototype.currentIndex_ = 0;

/**
 * If the list can be rewinded, i.e. if the end is reached, it should start
 * again from the other end.
 * @type {boolean}
 * @private
 */
pstj.ds.List.prototype.canRewind_ = false;

/**
 * Add a node to the list. Use dataId for map.
 * @param {!pstj.ds.ListItem} node The node to add.
 * @param {boolean=} reverse If the addition should be perfoemed in reverse (
 *   i.e. put the element on the first place instead of last).
 */
pstj.ds.List.prototype.add = function(node, reverse) {
  var index = null;
  var dataName = node.getId();
  if (!goog.isNull(this.getById(dataName))) {
    throw new Error('Item is duplicate in the list: ' + dataName);
  }
  if (reverse) {
    this.list_.unshift(node);
    if (dataName && dataName != '') {
      this.map_[dataName] = node;
      for (index in this.indexMap_) {
        this.indexMap_[index]++;
      }
      this.indexMap_[dataName] = 0;
    }
  } else {
    this.list_.push(node);
    if (dataName && dataName != '') {
      this.map_[dataName] = node;
      this.indexMap_[dataName] = this.list_.length - 1;
    }
  }
  this.applyFilter_();
  this.dispatchEvent(new pstj.ds.List.Event(this, node));
};

/**
 * Deletes a node from the list. If deletion happened the delete event will be
 *   dispatched.
 * @param  {pstj.ds.ListItem|pstj.ds.RecordID} node The node to delete. Note
 *   that it can be a node that is already in the list or a node with the same
 *   ID.
 * @return {boolean} True if the node was deleted. False otherwise.
 */
pstj.ds.List.prototype.deleteNode = function(node) {
  var i = null;
  var id = /** @type {pstj.ds.RecordID} */ ((node instanceof pstj.ds.ListItem) ?
    node.getId() : node);

  var listnode = this.getById(id);
  if (!goog.isNull(listnode)) {
    listnode.dispose();
    var index = this.getIndexById(id);
    goog.array.removeAt(this.list_, index);
    for (i in this.indexMap_) {
      if (this.indexMap_[i] > index) {
        this.indexMap_[i]--;
      }
    }
    delete this.map_[id];
    this.applyFilter_();
    this.dispatchEvent(pstj.ds.List.EventType.DELETE);
    return true;
  }
  return false;
};

/**
 * Handles a node update. Note that if the data node is not found in the list
 *   it will be added as first item.
 * @param  {!pstj.ds.ListItem} node The node to update.
 * @return {boolean} True if an update happened, false otherwise.
 */
pstj.ds.List.prototype.update = function(node) {
  var id = node.getId();
  var inlist = this.getById(id);
  if (!goog.isNull(inlist)) {
    var res = inlist.update(node);
    if (res) this.applyFilter_();
    return res;
  }
  return false;
};

/**
 * Getter for the item by its ID.
 * @param  {pstj.ds.RecordID} id The id of the data to retrieve.
 * @return {?pstj.ds.ListItem} The item that matches this id or null.
 */
pstj.ds.List.prototype.getById = function(id) {
  return this.map_[id] || null;
};

/**
 * Getter for the items by its index in the list.
 * @param  {!number} index The index of the item in the list.
 * @return {pstj.ds.ListItem} The item that matches the index in the list or
 *   null.
 */
pstj.ds.List.prototype.getByIndex = function(index) {
  var result = this.list_[index];
  if (goog.isDef(result)) {
    return result;
  }
  return null;
};

/**
 * The number of items in the list.
 * @return {number} The length of the list.
 */
pstj.ds.List.prototype.getCount = function() {
  return this.list_.length;
};

/**
 * Getter for the index of an item.
 * @param {!pstj.ds.ListItem} node The node to find the index of.
 * @return {number} The index of the item in the list.
 */
pstj.ds.List.prototype.getIndexByItem = function(node) {
  return this.getIndexById(node.getId());
};

/**
 * Getter for the index of an item by its id.
 * @param {pstj.ds.RecordID} id The id of the item to figure out the index of.
 * @return {number} The item index.
 */
pstj.ds.List.prototype.getIndexById = function(id) {
  var res = this.indexMap_[id];
  if (goog.isNumber(res)) return res;
  return -1;
};

/**
 * Enables or disables the rewind functionality in the list.
 * @param  {boolean} enable True if the list should be able to skip to the
 *   other end when rear is reached.
 */
pstj.ds.List.prototype.enableListRewind = function(enable) {
  this.canRewind_ = enable;
};

/**
 * Getter for the current item.
 * @return {pstj.ds.ListItem} The item that is currently appointed as active
 *   in this list.
 */
pstj.ds.List.prototype.getCurrent = function() {
  return this.getByIndex(this.getCurrentIndex());
};

/**
 * TODO: finish filtering
 * @param {function(pstj.ds.ListItem): boolean=} fn The function to use for
 *   filtering out elements from the list. Note that after the new filter is
 *   set the list will be filtered out and you can get the indexes of the
 *   filtered out elements with #getFilteredOut.
 */
pstj.ds.List.prototype.setFilter = function(fn) {
  if (goog.isFunction(fn)) {
    this.filterFn_ = fn;
  } else {
    this.filterFn_ = null;
  }
  this.applyFilter_();
};

/**
 * Getter for the indexes that have been filtered out.
 * @return {Array.<number>} The list of indexes of items that are filtered
 *   out, potentially an empty array.
 */
pstj.ds.List.prototype.getFilteredIndexes = function() {
  return this.filteredOutIndexes_;
};

/**
 * Sets the current item in the list.
 * @param {!pstj.ds.ListItem} item The node to become the active one, its
 *   index will be recorded in the structure as current index.
 */
pstj.ds.List.prototype.setCurrent = function(item) {
  var index = this.getIndexById(item.getId());
  if (goog.isNumber(index)) {
    this.currentIndex_ = index;
  }
};

/**
 * Getter for the index marked as current in the list.
 * @return {number} The index marked as current.
 */
pstj.ds.List.prototype.getCurrentIndex = function() {
  return this.currentIndex_;
};

/**
 * Gets the next item in the list as +1 offset of the item considered current.
 * @return {?pstj.ds.ListItem} The next item in the list or null if list
 *   boundary is reached and the list is not set as able to rewind.
 */
pstj.ds.List.prototype.getNext = function() {
  var nextIndex = this.getCurrentIndex() + 1;
  if (nextIndex >= this.list_.length) {
    if (this.canRewind_) {
      nextIndex = 0;
    } else {
      return null;
    }
  }
  return this.getByIndex(nextIndex);
};

/**
 * Gets the previous item in the list as -1 offset of the item considered as
 *   current one.
 * @return {?pstj.ds.ListItem} The previous item in the list or null if list
 *   boundary is reached and the list is not set as able to rewind.
 */
pstj.ds.List.prototype.getPrevious = function() {
  var nextIndex = this.getCurrentIndex() - 1;
  if (nextIndex < 0) {
      if (this.canRewind_) {
          nextIndex = this.list_.length - 1;
      } else {
          return null;
      }
  }
  return this.getByIndex(nextIndex);
};

/**
 * Executes a function for each item in the list.
 * @param {function(this: S, pstj.ds.ListItem, number,
 *   Array.<pstj.ds.ListItem>): ?} fn The function to execute.
 * @param {S=} opt_obj The object in which context to execute the function.
 * @template S
 */
pstj.ds.List.prototype.forEach = function(fn, opt_obj) {
  goog.array.forEach(this.list_, fn, opt_obj);
};

/** @inheritDoc */
pstj.ds.List.prototype['toJSON'] = function() {
  return this.list_;
};

/** @inheritDoc */
pstj.ds.List.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  delete this.map_;
  delete this.indexMap_;
  delete this.list_;
  delete this.canRewind_;
  delete this.currentIndex_;
};

/**
 * Applies the filter on the current list.
 * @private
 */
pstj.ds.List.prototype.applyFilter_ = function() {
  if (!goog.isArray(this.filteredOutIndexes_)) this.filteredOutIndexes_ = [];
  goog.array.clear(this.filteredOutIndexes_);
  if (goog.isFunction(this.filterFn_)) {
    goog.array.forEach(this.list_, function(item, index) {
      if (this.filterFn_(item)) this.filteredOutIndexes_.push(index);
    }, this);
  }
};

/**
 * Custom event that should be fired when a node is added to the list. It will
 *   contain reference to the newly added node. This event will be fired for
 *   each new node, so listening code should throttle the handlers if needed.
 * @constructor
 * @param {!pstj.ds.List} target The target of the event.
 * @param {!pstj.ds.ListItem} node The node that has been added.
 * @extends {goog.events.Event}
 */
pstj.ds.List.Event = function(target, node) {
  goog.base(this, pstj.ds.List.EventType.ADD, target);
  this.node_ = node;
};
goog.inherits(pstj.ds.List.Event, goog.events.Event);

/**
 * Getter for the new node. Always returns the new node that was added to the
 *   list.
 * @return {!pstj.ds.ListItem} The node just added to the list.
 */
pstj.ds.List.Event.prototype.getNode = function() {
  return this.node_;
};
