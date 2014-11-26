goog.provide('pstj.ds.jstype.Namespace');

goog.require('pstj.ds.jstype.Record');

goog.scope(function() {
var Record = pstj.ds.jstype.Record;


/** Implements the enumeration type of properties. */
pstj.ds.jstype.Namespace = goog.defineClass(Record, {
  /**
   * @constructor
   * @extends {Record}
   */
  constructor: function() {
    Record.call(this);
  },


  /** @inheritDoc */
  getType: function() {
    return '@constructor';
  },


  /** @inheritDoc */
  getAssignment: function() {
    return ' = function() {};';
  }
});

});  // goog.scope
