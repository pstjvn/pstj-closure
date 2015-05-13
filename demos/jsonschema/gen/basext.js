
// This code is auto generate, please do not edit.

goog.provide('pstj.gen.dto.BaseExt');

goog.require('goog.asserts');
goog.require('goog.object');
goog.require('pstj.gen.dto.Base');


goog.scope(function() {
var a = goog.asserts;


/**
 * Extends the base object
 * @extends {pstj.gen.dto.Base}
 */
pstj.gen.dto.BaseExt = goog.defineClass(pstj.gen.dto.Base, {
  constructor: function() {
    pstj.gen.dto.Base.call(this);
    /**
     * Additional string property
     * @type {string}
     */
    this.prop100 = null;
  },

  /**@override */
  fromJSON: function(map) {
    this.prop100 = map['prop100'] || '';
    goog.base(this, 'fromJSON', map);
  },

  /**@override */
  toJSON: function() {
    var exports = {
      'prop100': this.prop100
    };
    return goog.object.extend(exports,
        a.assertObject(goog.base(this, 'toJSON')));
  }
});
});  // goog.scope

