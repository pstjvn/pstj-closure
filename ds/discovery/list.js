/**
 * @fileoverview Provides parsing for list responses in discovery documents.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('pstj.ds.discovery.List');


/** Implementation */
pstj.ds.discovery.List = goog.defineClass(null, {
  constructor: function(name, scheme) {
    /**
     * The name of the list generator.
     * @type {string}
     */
    this.name = name;
    /**
     * The list type. It could be one of the native types or a reference
     * type.
     * @type {?string}
     */
    this.type = null;
    /**
     * If the list type is a reference type.
     * @type {boolean}
     * @private
     */
    this.isreference_ = false;
    /**
     * The format that is used to transmit the data.
     * @type {?string}
     */
    this.format = null;

    // Call actual scheme processing.
    this.process(scheme);
  },

  process: function(scheme) {
    if (!goog.isDef(scheme['items'])) {
      throw new Error('Cannot determine list type');
    }

    var items = scheme['items'];
    if (goog.isString(items['type'])) {
      this.type = items['type'];
    } else if (goog.isString(items['$ref'])) {
      this.isreference_ = true;
      this.type = items['$ref'];
    }

    if (goog.isString(items['format'])) {
      this.format = items['format'];
    }
  },

  /**
   * If the type of the array item is reference type or a native type.
   * @return {boolean}
   */
  isReferenceType: function() {
    return this.isreference_;
  },

  /**
   * Determines and returns the closure JS type for the array item type.
   * @return {string}
   */
  getClosureType: function() {
    if (this.isReferenceType()) {
      return goog.asserts.assertString(this.type);
    }

    switch (this.type) {
      case 'integer': return 'number';
      case 'boolean': return 'boolean';
      case 'string':
        if (this.format == 'date' || this.format == 'date-time') {
          return 'Date';
        } else {
          return 'string';
        }
        break;
      case 'number': return 'number';
      default: return '';
    }
  }
});
