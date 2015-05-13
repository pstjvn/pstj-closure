
// This code is auto generate, please do not edit.

goog.provide('pstj.gen.dto.BaseReq');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');
goog.require('pstj.gen.dto.ForExtend');


goog.scope(function() {
var a = goog.asserts;


/**
 * Basic test
 * @extends {pstj.ds.DtoBase}
 */
pstj.gen.dto.BaseReq = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /**
     * Number
     * @type {!number}
     */
    this.prop1 = 0;
    /**
     * Number to string
     * @type {!string}
     */
    this.prop2 = '';
    /**
     * Number to Date
     * @type {!Date}
     */
    this.prop3 = new Date();
    /**
     * Number (alternate name)
     * @type {!number}
     */
    this.custom4 = 0;
    /**
     * Number to boolean
     * @type {!boolean}
     */
    this.prop5 = false;
    /**
     * String
     * @type {!string}
     */
    this.prop6 = '';
    /**
     * String to number
     * @type {!number}
     */
    this.prop7 = 0;
    /**
     * String to Date
     * @type {!Date}
     */
    this.prop8 = new Date();
    /**
     * String to boolean
     * @type {!boolean}
     */
    this.prop9 = false;
    /**
     * String (alternate name)
     * @type {!string}
     */
    this.custom10 = '';
    /**
     * Boolean
     * @type {!boolean}
     */
    this.prop11 = false;
    /**
     * Boolean (alternate name)
     * @type {!boolean}
     */
    this.custom12 = false;
    /**
     * Array with template number
     * @type {!Array<number>}
     */
    this.prop13 = [];
    /**
     * Array with template string
     * @type {!Array<string>}
     */
    this.prop14 = [];
    /**
     * Array with template boolean
     * @type {!Array<boolean>}
     */
    this.prop15 = [];
    /**
     * Array with template of Named Type
     * @type {!Array<pstj.gen.dto.ForExtend>}
     */
    this.prop16 = [];
    /**
     * Object with template named type
     * @type {!pstj.gen.dto.ForExtend}
     */
    this.prop17 = new pstj.gen.dto.ForExtend();
  },

  /**@override */
  fromJSON: function(map) {
    this.prop1 = a.assertNumber(map['prop1']);
    this.prop2 = a.assertNumber(map['prop2']).toString();
    this.prop3 = (new Date(a.assertNumber(map['prop3']))) || this.prop3;
    this.custom4 = a.assertNumber(map['prop4']);
    this.prop5 = !!(a.assertNumber(map['prop5']));
    this.prop6 = a.assertString(map['prop6']);
    this.prop7 = parseFloat(a.assertString(map['prop7']));
    this.prop8 = (new Date(a.assertString(map['prop8']))) || this.prop8;
    this.prop9 = !!(a.assertString(map['prop9']));
    this.custom10 = a.assertString(map['prop10']);
    this.prop11 = a.assertBoolean(map['prop11']);
    this.custom12 = a.assertBoolean(map['prop12']);
    goog.array.clear(this.prop13);
    goog.array.forEach(a.assertArray(map['prop13']), function(item) {
      this.prop13.push(a.assertNumber(item));
    }, this);
    goog.array.clear(this.prop14);
    goog.array.forEach(a.assertArray(map['prop14']), function(item) {
      this.prop14.push(a.assertString(item));
    }, this);
    goog.array.clear(this.prop15);
    goog.array.forEach(a.assertArray(map['prop15']), function(item) {
      this.prop15.push(a.assertBoolean(item));
    }, this);
    goog.array.clear(this.prop16);
    goog.array.forEach(a.assertArray(map['prop16']), function(item) {
      var i = new pstj.gen.dto.ForExtend();
      i.fromJSON(a.assertObject(item));
      this.prop16.push(item);
    }, this);
    this.prop17.fromJSON(a.assertObject(map['prop17']));
    goog.base(this, 'fromJSON', map);
  },

  /**@override */
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

