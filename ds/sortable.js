/**
 * @fileoverview Provides base class for sortable lists implementations.
 *
 * The design is as follows:
 *
 * On construction time you provide an instance of the dto base class. Automatic
 * listeners are bound to monitor changes in that instance while providing a
 * reflective copy of the original DTO data that the user can sort.
 *
 * Users should listen on the sortable instance as it is always the source of
 * truth and it will automatically reflect and sort any changed in the
 * original DTO.
 *
 * Implementors should override the list getter (to provide access to the
 * actual DTO array) and the internal sorting mechanics (to match the
 * actual data types in the DTO's list).
 *
 * The class is generic and subclasses should honour this using
 * explicit type when subclassing and / or instanciating.
 *
 * For an example take a look at #longa.com/js/ds/sellers.js file.
 */

goog.provide('pstj.ds.Sortable');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('pstj.ds.DtoBase.EventType');


/**
 * @extends {goog.events.EventTarget}
 * @template TYPE
 */
pstj.ds.Sortable = goog.defineClass(goog.events.EventTarget, {
  /**
   * @param {!pstj.ds.DtoBase} data_source The data source to sync to.
   */
  constructor: function(data_source) {
    goog.events.EventTarget.call(this);
    /**
     * Reference to the original data source.
     * @type {!pstj.ds.DtoBase}
     * @protected
     */
    this.dataSource = data_source;
    /**
     * Current sort key used. -1 => unsorted (as received from server).
     * @type {!number}
     * @private
     */
    this.sortKey_ = -1;
    /**
     * If the ordering is ascending or descending.
     * @type {!boolean}
     * @private
     */
    this.asc_ = true;
    /**
     * The data to operate on. It should be a copy of the original data.
     * @type {!Array<TYPE>}
     */
    this.list = [];

    goog.events.listen(this.dataSource, pstj.ds.DtoBase.EventType.CHANGE,
        this.handleSourceDataChange, false, this);
    // Initialize the reflective list in case the source data
    // already has items.
    this.handleSourceDataChange(null);
  },

  /** @inheritDoc */
  disposeInternal: function() {
    goog.base(this, 'disposeInternal');
    goog.events.listen(this.dataSource, pstj.ds.DtoBase.EventType.CHANGE,
        this.handleSourceDataChange, false, this);
  },

  /**
   * Getter for the current sorting order.
   * @return {boolean}
   */
  getAsc: function() {
    return this.asc_;
  },

  /**
   * Getter forthe key index currently applied.
   * @return {!number}
   */
  getKey: function() {
    return this.sortKey_;
  },

  /**
   * Implement this method to make sure that indeed the listing is returned.
   * @protected
   * @return {!Array<TYPE>}
   */
  getList: function() {
    throw new Error('Not implemented');
  },

  /**
   * @protected
   * @param {goog.events.Event} e
   */
  handleSourceDataChange: function(e) {
    // The server has changed data, for now just copy it over.
    goog.array.clear(this.list);
    goog.array.forEach(this.getList(), function(seller) {
      this.list.push(seller);
    }, this);
    if (this.sortKey_ != -1) {
      this.sort_(this.sortKey_, this.asc_);
    } else {
      this.dispatchEvent(pstj.ds.DtoBase.EventType.CHANGE);
    }
  },

  /**
   * Applies new sorting on the data. If the sortkey is the same the
   * sorting will be reversed.
   * @param {!number} key The sortkey.
   * @return {boolean} True if new sorting was applied, false if sorting
   *                        was only reversed.
   */
  sort: function(key) {
    if (key == this.sortKey_) {
      this.sort_(key, !this.asc_);
      return false;
    } else {
      this.sort_(key, true);
      return true;
    }
  },

  /**
   * @private
   * @param {!number} key
   * @param {!boolean} asc
   */
  sort_: function(key, asc) {
    if (this.sortKey_ != key || this.asc_ != asc) {
      this.sortKey_ = key;
      this.asc_ = asc;
      this.sortInternal(key, asc);
      this.dispatchEvent(pstj.ds.DtoBase.EventType.CHANGE);
    }
  },

  /**
   * The actual sorting mechanizm used. Note that you should overide this
   * method so the sorting can match your data structure types.
   *
   * @protected
   * @param {!number} key The sort key, it will be the index of the
   *                      list header child used to sort.
   * @param {!boolean} asc If the ordering should be ascending or not.
   */
  sortInternal: function(key, asc) {
    throw new Error('Not implemented!');
  }
});
