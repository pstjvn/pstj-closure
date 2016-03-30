'use strict';

goog.provide('pstj.ds.DoubleBufferedList');

goog.require('goog.array');



/**
 * Implements usable double buffered list.
 * @constructor
 * @template T
 */
pstj.ds.DoubleBufferedList = class {
  constructor() {
    /**
     * The backing store for the listings.
     *
     * @type {!Array<!Array<T>>}
     * @private
     */
    this.lists_ = [[], []];
    /**
     * Internal index to use when switching backing store.
     *
     * @type {number}
     * @private
     */
    this.index_ = 0;
    /**
     * Pointer to the curent list used.
     *
     * @type {Array<T>}
     * @private
     */
    this.list_ = this.lists_[this.index_];
  }

  /**
   * @return {number}
   */
  get length() {
    return this.list_.length;
  }

  /**
   * @param  {number} len The new lenght to set.
   */
  set length(len) {
    this.list_.length = len;
  }

  /**
   * Add an item in the list at the end of it.
   *
   * @param {T} item
   */
  add(item) {
    this.list_.push(item);
  }

  /**
   * Getter by index (similar to [i])
   *
   * @param  {number} index The index access.
   * @return {T}
   */
  item(index) {
    if (index < 0 || index > this.list_.length) {
      throw new Error('Index out of bound');
    }
    return this.list_[index];
  }

  /**
   * Clears/null out the list. This will affect only the current list and
   * will swithc to the next in the backing store.
   */
  clear() {
    this.list_.length = 0;
    this.alter_();
  }

  /**
   * Implements iteration as {@see goog.array.forEach}.
   *
   * @param {function(this: C, T, number, Array<T>): void} fn The function to
   * execute for each item in the list.
   * @param {C=} context The context in which to execute the fucntion.
   * @template C
   */
  forEach(fn, context) {
    var list = this.list_;
    this.alter_();
    goog.array.forEach(list, fn, context);
    this.alter_();
  }

  /** @private */
  alter_() {
    this.index_ = (this.index_ + 1) % 2;
    this.list_ = this.lists_[this.index_];
  }
};
