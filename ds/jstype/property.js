goog.provide('pstj.ds.jstype.Property');

goog.require('pstj.ds.jstype.Record');
goog.require('pstj.ds.jstype.Type');

goog.scope(function() {
var Type = pstj.ds.jstype.Type;
var Record = pstj.ds.jstype.Record;


/** Implements the property of class JSType. */
pstj.ds.jstype.Property = goog.defineClass(Record, {
  /**
   * @constructor
   * @extends {Record}
   */
  constructor: function() {
    Record.call(this);
    /**
     * Properties belong to the constructor's namespace's prototype.
     * @type {string}
     * @protected
     */
    this.namespace = '';
    this.setTypeInternal(Type.PROPERTY);
  },


  /**
   * Sets the namespace of the property. Prope are treated like regular records
   * with the difference that they actually belong to the namespace of the
   * constructor function (class) prototype.
   * @param {string} ns
   */
  setNamespace: function(ns) {
    this.namespace = ns;
  },


  /** @inheritDoc */
  getName: function() {
    var res = (this.namespace == '') ? '' : this.namespace + '.prototype.';
    return res + goog.base(this, 'getName');
  }
});
});  // goog.scope

