
// This code is auto generate, please do not edit.

goog.provide('pstj.ds.dto.Base');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');
goog.require('pstj.ds.dto.ForExtend');


goog.scope(function() {
var a = goog.asserts;


/** 
 * Basic test
 * @extends {pstj.ds.DtoBase}
 */
pstj.ds.dto.Base = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /** 
     * Number
     * @type {number}
     */
    this.prop1 = null;
    /** 
     * Number to string
     * @type {string}
     */
    this.prop2 = null;
    /** 
     * Number to Date
     * @type {Date}
     */
    this.prop3 = null;
    /** 
     * Number (alternate name)
     * @type {number}
     */
    this.custom4 = null;
    /** 
     * Number to boolean
     * @type {boolean}
     */
    this.prop5 = false;
    /** 
     * String
     * @type {string}
     */
    this.prop6 = null;
    /** 
     * String to number
     * @type {number}
     */
    this.prop7 = null;
    /** 
     * String to Date
     * @type {Date}
     */
    this.prop8 = null;
    /** 
     * String to boolean
     * @type {boolean}
     */
    this.prop9 = false;
    /** 
     * String (alternate name)
     * @type {string}
     */
    this.custom10 = null;
    /** 
     * Boolean
     * @type {boolean}
     */
    this.prop11 = false;
    /** 
     * Boolean (alternate name)
     * @type {boolean}
     */
    this.custom12 = false;
    /** 
     * Array with template number
     * @type {Array<number>}
     */
    this.prop13 = [];
    /** 
     * Array with template string
     * @type {Array<string>}
     */
    this.prop14 = [];
    /** 
     * Array with template boolean
     * @type {Array<boolean>}
     */
    this.prop15 = [];
    /** 
     * Array with template of Named Type
     * @type {Array<pstj.ds.dto.ForExtend>}
     */
    this.prop16 = [];
    /** 
     * Object with template named type
     * @type {pstj.ds.dto.ForExtend}
     */
    this.prop17 = new pstj.ds.dto.ForExtend();
  },

  /** @override */
  fromJSON: function(map) {
    this.prop1 = map['prop1'] || 0;
    this.prop2 = (goog.isNumber(map['prop2']) ? map['prop2'] : 0).toString();
    this.prop3 = (new Date((goog.isNumber(map['prop3']) ? map['prop3'] : 0))) || this.prop3;
    this.custom4 = map['prop4'] || 0;
    this.prop5 = !!((goog.isNumber(map['prop5']) ? map['prop5'] : 0));
    this.prop6 = map['prop6'] || '';
    this.prop7 = parseFloat((goog.isString(map['prop7']) ? map['prop7'] : ''));
    this.prop8 = (new Date((goog.isString(map['prop8']) ? map['prop8'] : ''))) || this.prop8;
    this.prop9 = !!((goog.isString(map['prop9']) ? map['prop9'] : ''));
    this.custom10 = map['prop10'] || '';
    this.prop11 = map['prop11'] || false;
    this.custom12 = map['prop12'] || false;
    goog.array.clear(this.prop13);
    if (goog.isArray(map['prop13'])) {
      goog.array.forEach(map['prop13'], function(item) {
        this.prop13.push(a.assertNumber(item));
      }, this);
    }
    goog.array.clear(this.prop14);
    if (goog.isArray(map['prop14'])) {
      goog.array.forEach(map['prop14'], function(item) {
        this.prop14.push(a.assertString(item));
      }, this);
    }
    goog.array.clear(this.prop15);
    if (goog.isArray(map['prop15'])) {
      goog.array.forEach(map['prop15'], function(item) {
        this.prop15.push(a.assertBoolean(item));
      }, this);
    }
    goog.array.clear(this.prop16);
    if (goog.isArray(map['prop16'])) {
      goog.array.forEach(map['prop16'], function(item) {
        var i = new pstj.ds.dto.ForExtend();
        i.fromJSON(a.assertObject(item));
        this.prop16.push(item);
      }, this);
    }
    if (goog.isDefAndNotNull(map['prop17'])) {
      this.prop17.fromJSON(a.assertObject(map['prop17']));
    }
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'prop1': this.prop1,
      'prop2': parseFloat(this.prop2),
      'prop3': parseFloat(this.prop3),
      'prop4': this.custom4,
      'prop5': parseFloat(this.prop5),
      'prop6': this.prop6,
      'prop7': this.prop7.toString(),
      'prop8': this.prop8.toString(),
      'prop9': this.prop9.toString(),
      'prop10': this.custom10,
      'prop11': this.prop11,
      'prop12': this.custom12,
      'prop13': this.prop13,
      'prop14': this.prop14,
      'prop15': this.prop15,
      'prop16': this.prop16,
      'prop17': this.prop17
    };
  }
});
});  // goog.scope

