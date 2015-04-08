
// This code is auto generate, please do not edit.

goog.provide('pstj.ds.dto.BaseExt');

goog.require('goog.asserts');
goog.require('goog.object');
goog.require('pstj.ds.dto.Base');


goog.scope(function() {
var a = goog.asserts;


/** 
 * Extends the base object
 * @extends {pstj.ds.dto.Base}
 */
pstj.ds.dto.BaseExt = goog.defineClass(pstj.ds.dto.Base, {
  constructor: function() {
    pstj.ds.dto.Base.call(this);
    /** 
     * Additional string property
     * @type {string}
     */
    this.prop100 = null;
  },

  /** @override */
  fromJSON: function(map) {
    this.prop100 = map['prop100'] || '';
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    var exports = {
      'prop100': this.prop100
    };
    return goog.object.extend(exports, goog.base(this, 'toJSON'));
  }
});
});  // goog.scope

