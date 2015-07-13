/**
 * @fileoverview Provides class that presents a list of pstj.ds.ListItem's.
 * This is inspired by the goog.datasource package, however it does not
 * support nested lists. So it is basically one fold list of items.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */


goog.provide('pstj.ds.List');
goog.provide('pstj.ds.List.Event');
goog.provide('pstj.ds.List.EventType');

goog.require('goog.array');
goog.require('goog.async.Delay');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('pstj.ds.ListItem');



/**
 * List that keeps track of the current index. Access is optimized with maps
 *   of the indexes and ids. This means that the list does not support
 *   duplicates, error is throws if you attempt to add items with ID that is
 *   already in the list.
 * @constructor
 * @extends {goog.events.EventTarget}
 * @param {Array.<pstj.ds.ListItem>|Array.<Object>=} opt_nodes Optionally,
 *   array of list items to initialize the list with or array of literal
 *   record objects to convert to list items.
 */
pstj.ds.List = function(opt_nodes) {
  goog.base(this);
  /**
   * The list of items.
   * @type {!Array.<pstj.ds.ListItem>}
   * @protected
   */
  this.list = [];
  /**
   * The id -> item map, stores the id as a key and the item as value.
   * @type {!Object}
   * @protected
   */
  this.map = {};
  /**
   * Map of id pointing to indexes. The id is stored as a key and the index of
   *   the item in the list is stored as value.
   * @type {!Object}
   * @protected
   */
  this.indexMap = {};
  /**
   * The list of indexes that are currently filtered out.
   * @type {Array.<number>}
   * @private
   */
  this.filteredOutIndexes_ = [];
  /**
   * The filter function.
   * @type {?function(pstj.ds.ListItem): boolean}
   * @private
   */
  this.filterFn_ = null;
  /**
   * Hold reference to the node that is currently interpreted as active.
   * @type {number}
   * @private
   */
  this.currentIndex_ = 0;
  /**
   * If the list can be re-winded, i.e. if the end is reached, it should start
   * again from the other end.
   * @type {boolean}
   * @private
   */
  this.canRewind_ = false;
  /**
   * Flag: if the dispatching of the filter applied event should be delayed. By
   *   default the flag is down which means the event is dispatched right after
   *   the filter has been applied. However some applications tend to apply lots
   *   of filters in sequence and the components that utilize the data structure
   *   tend to bind the UI work to the event, in which case excessive work is
   *   done for no practical reason, this is why should the developer decide the
   *   event could be delayed and dispatched outside of the event loop.
   * @type {boolean}
   * @private
   */
  this.delayFilterAppliedEvent_ = true;
  this.dispatchFilterApplied_ = new goog.async.Delay(goog.bind(function() {
    this.dispatchEvent(pstj.ds.List.EventType.FILTERED);
  }, this), 100);
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
  DELETE: goog.events.getUniqueId('delete'),
  FILTERED: goog.events.getUniqueId('filtered'),
  SELECTED: goog.events.getUniqueId('selected')
};


/**
 * Sets the flag for delaying the filter applied event dispatching.
 * @param {boolean} delay True if the event should be delayed for this
 *   instance.
 */
pstj.ds.List.prototype.setDelayFilterAppliedEvent = function(delay) {
  this.delayFilterAppliedEvent_ = delay;
};


/**
 * Add a node to the list. Use dataId for map.
 *
 * @param {!pstj.ds.ListItem} node The node to add.
 * @param {boolean=} opt_reverse If the addition should be perfumed in reverse (
 * i.e. put the element on the first place instead of last).
 */
pstj.ds.List.prototype.add = function(node, opt_reverse) {
  this.addInternal(node, (opt_reverse) ? 0 : -1);
  this.applyFilter_();
  this.dispatchEvent(new pstj.ds.List.Event(this, node));
};


/**
 * Adds the node to the listing. This method is designed to be overriden by
 * subclasses allowing them to decide where to put the element.
 *
 * @protected
 * @param {!pstj.ds.ListItem} node The node to add to the listing.
 * @param {number=} opt_position Optional index that we want the node to be
 * inserted at. Note that the implementation might not use it! This
 * implementation uses -1 by default (add at the end of the list).
 */
pstj.ds.List.prototype.addInternal = function(node, opt_position) {
  var id = node.getId();

  if (!this.isAcceptableId(id)) {
    throw new Error('No acceptable ID found on record: ', + id);
  }

  // Make the insertion only if the item is not already in the list.
  if (goog.isNull(this.getById(id))) {

    // Check the indexes of insertion.
    if (!goog.isNumber(opt_position)) {
      opt_position = 0;
    } else if (opt_position < -1 || opt_position > this.getCount()) {
      // if the desired index is not in range we have a problem, fail early
      // and notify the developer instead of silently ignoring it. The getCount
      // method is intentinally used here as the plan is to support sparse
      // lists for lazy loading of data.
      throw new Error('Insertion index is out of bound: ' + opt_position +
          ', list length is ' + this.getCount());
    }

    // Do the actual insertion.
    if (opt_position == -1) {
      // add at the end of the list.
      this.list.push(node);
      this.map[id] = node;
      this.indexMap[id] = this.list.length - 1;
    } else if (opt_position == 0) {
      // the user wants the item at the head of the list.
      this.list.unshift(node);
      this.map[id] = node;
      // Increase the index of all other items by one.
      for (var key in this.indexMap) {
        this.indexMap[key]++;
      }
      this.indexMap[id] = node;
    } else {
      // attemp to use the index provided.
      goog.array.insertAt(this.list, node, opt_position);
      this.map[id] = node;

      // find all items that are behind the inserting in the list and increase
      // their mapped index value
      var len = this.getCount() + 1;

      for (opt_position++; opt_position < len; opt_position++) {
        this.indexMap[this.getByIndex(opt_position).getId()]++;
      }
    }
  } else {
    throw new Error('Duplicate ID in listing: ' + id);
  }
};


/**
 * Checks if an ID is an accceptable ID for the map.
 *
 * @param {?pstj.ds.RecordID} id The ID to check.
 * @return {boolean} True if the ID is a number or a string that is not empty.
 * @protected
 */
pstj.ds.List.prototype.isAcceptableId = function(id) {
  return (goog.isNumber(id) || (goog.isString(id) && !goog.string.isEmpty(id)));
};


/**
 * Deletes a node from the list. If deletion happened the delete event will be
 * dispatched.
 *
 * @param  {pstj.ds.ListItem|pstj.ds.RecordID} node The node to delete. Note
 * that it can be a node that is already in the list or a node with the same
 * ID.
 * @return {boolean} True if the node was deleted. False otherwise.
 */
pstj.ds.List.prototype.deleteNode = function(node) {
  var id = /** @type {pstj.ds.RecordID} */ ((node instanceof pstj.ds.ListItem) ?
      node.getId() : node);

  var listnode = this.getById(id);
  if (!goog.isNull(listnode)) {
    listnode.dispose();
    var index = this.getIndexById(id);
    goog.array.removeAt(this.list, index);
    for (var key in this.indexMap) {
      if (this.indexMap[key] > index) {
        this.indexMap[key]--;
      }
    }
    delete this.map[id];
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
 *
 * @param  {pstj.ds.RecordID} id The id of the data to retrieve.
 * @return {?pstj.ds.ListItem} The item that matches this id or null.
 */
pstj.ds.List.prototype.getById = function(id) {
  return this.map[id] || null;
};


/**
 * Getter for the items by its index in the list.
 *
 * @param  {!number} index The index of the item in the list.
 * @return {pstj.ds.ListItem} The item that matches the index in the list or
 * null.
 */
pstj.ds.List.prototype.getByIndex = function(index) {
  var result = this.list[index];
  if (goog.isDef(result)) {
    return result;
  }
  return null;
};


/**
 * The number of items in the list. Note that in this implementation the list
 * length is directly used. Sparse subclasses might need to return the full
 * length without it actually being loaded.
 *
 * @return {number} The length of the list.
 */
pstj.ds.List.prototype.getCount = function() {
  return this.list.length;
};


/**
 * Getter for the index of an item.
 * @param {pstj.ds.ListItem} node The node to find the index of.
 * @return {number} The index of the item in the list.
 */
pstj.ds.List.prototype.getIndexByItem = function(node) {
  if (goog.isNull(node)) return -1;
  return this.getIndexById(node.getId());
};


/**
 * Getter for the index of an item by its id.
 * @param {pstj.ds.RecordID} id The id of the item to figure out the index of.
 * @return {number} The item index.
 */
pstj.ds.List.prototype.getIndexById = function(id) {
  var res = this.indexMap[id];
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
 * Sets the filter function for the list. If the filter function returns true
 * the item should be filtered OUT, i.e. if true -> remove element.
 *
 * TODO: finish filtering
 * @param {function(pstj.ds.ListItem): boolean=} opt_fn The function to use for
 *   filtering out elements from the list. Note that after the new filter is
 *   set the list will be filtered out and you can get the indexes of the
 *   filtered out elements with #getFilteredOut.
 */
pstj.ds.List.prototype.setFilter = function(opt_fn) {
  if (goog.isFunction(opt_fn)) {
    this.filterFn_ = opt_fn;
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
 * @param {pstj.ds.ListItem} item The node to become the active one, its
 *   index will be recorded in the structure as current index.
 */
pstj.ds.List.prototype.setCurrent = function(item) {
  if (goog.isNull(item)) return;
  var index = this.getIndexById(item.getId());
  if (goog.isNumber(index)) {
    if (!goog.isNull(this.getCurrent())) {
      if (this.getCurrentIndex() == index) return;
    }
    this.currentIndex_ = index;
    this.dispatchEvent(pstj.ds.List.EventType.SELECTED);
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
  if (nextIndex >= this.list.length) {
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
      nextIndex = this.list.length - 1;
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
  goog.array.forEach(this.list, fn, opt_obj);
};


/** @inheritDoc */
pstj.ds.List.prototype['toJSON'] = function() {
  return this.list;
};


/** @inheritDoc */
pstj.ds.List.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  delete this.map;
  delete this.indexMap;
  delete this.list;
  delete this.canRewind_;
  delete this.currentIndex_;
};


/**
 * Disposes all the elements in the list. Note that if you reference these
 * elements elsewhere they will be disposed regardless of that reference and
 * you might corrupt your data!
 *
 * CAUTION: Use only if you are sure that none of the list elements are
 * referenced elsewhere!
 */
pstj.ds.List.prototype.free = function() {
  for (var i = 0; i < this.list.length; i++) {
    goog.dispose(this.list[i]);
  }
};


/**
 * Applies the filter on the current list. It executes the filter function and
 *   if the element matches the remove filter the function should return true
 *   to signify removing the item.
 * @private
 */
pstj.ds.List.prototype.applyFilter_ = function() {
  goog.array.clear(this.filteredOutIndexes_);
  if (goog.isFunction(this.filterFn_)) {
    goog.array.forEach(this.list, function(item, index) {
      if (this.filterFn_(item)) this.filteredOutIndexes_.push(index);
    }, this);
  }
  if (this.delayFilterAppliedEvent_) {
    this.dispatchFilterApplied_.start();
  } else {
    this.dispatchFilterApplied_.fire();
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
