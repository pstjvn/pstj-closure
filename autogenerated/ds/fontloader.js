
// This code is auto generate, please do not edit.

goog.provide('pstj.gen.dto.FontLoaderOptions');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * DTO configuring font loader.
 * @extends {pstj.ds.DtoBase}
 */
pstj.gen.dto.FontLoaderOptions = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /**
     * The amount of milliseconds to wait before the font is considered
     *  failed to load
     * @type {!number}
     */
    this.timeout = 1000;
    /**
     * Testing default string
     * @type {!string}
     */
    this.fontname = 'String test';
    /**
     * Testing boolean
     * @type {!boolean}
     */
    this.force = !!true;
  },

  /** @override */
  fromJSON: function(map) {
    this.timeout = a.assertNumber(map['timeout']);
    this.fontname = a.assertString(map['fontname']);
    this.force = a.assertBoolean(map['force']);
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'timeout': this.timeout,
      'fontname': this.fontname,
      'force': this.force
    };
  }
});
});  // goog.scope

