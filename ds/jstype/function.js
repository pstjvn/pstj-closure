goog.provide('pstj.ds.jstype.Function');

goog.require('goog.array');
goog.require('pstj.ds.jstype.Record');
goog.require('pstj.ds.jstype.Type');

goog.scope(function() {
var Type = pstj.ds.jstype.Type;
var Record = pstj.ds.jstype.Record;


/** Provides the Function JSType implementation */
pstj.ds.jstype.Function = goog.defineClass(Record, {
  /**
   * @constructor
   * @extends {Recrod}
   */
  constructor: function() {
    Record.call(this);
    /**
     * @type {Array<pstj.ds.jstype.Parameter>}
     * @protected
     */
    this.parameters = [];
    this.setTypeInternal(Type.FUNCTION);
  },


  /** @inheritDoc */
  setName: function(name) {
    this.name = name.split('(')[0];
  },


  /** @inheritDoc */
  getType: function() {
    if (this.type != '') {
      return '@return {' + this.type + '}';
    } else {
      return '';
    }
  },


  /**
   * Add new parameter to the callable object.
   * @param {pstj.ds.jstype.Parameter} param
   */
  addParameter: function(param) {
    this.parameters.push(param);
  },


  /** @inheritDoc */
  addJSDocForParams: function(list) {
    goog.array.forEach(this.parameters, function(param) {
      goog.array.forEach(param.textile(), function(row) {
        list.push(row);
      });
    });
  },


  /** @inheritDoc */
  getAssignment: function() {
    return ' = function(' + this.getParametersAsNames().join(
        ',\n    ') + ') {};';
  },


  /**
   * Collects the names of all assigned parameters to a single list.
   * @return {Array<string>}
   * @protected
   */
  getParametersAsNames: function() {
    return goog.array.map(this.parameters, function(param) {
      return param.getName();
    });
  }
});

});  // goog.scope
