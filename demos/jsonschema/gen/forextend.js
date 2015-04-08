
// This code is auto generate, please do not edit.

goog.provide('pstj.ds.dto.ForExtend');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/** 
 * Simple type, used for testing references
 * @extends {pstj.ds.DtoBase}
 */
pstj.ds.dto.ForExtend = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /** @type {string} */
    this.id = null;
  },

  /** @override */
  fromJSON: function(map) {
    this.id = map['id'] || '';
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'id': this.id
    };
  }
});
});  // goog.scope

