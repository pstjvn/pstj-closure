goog.provide('pstj.ds.jstype.Constructor');

goog.require('pstj.ds.jstype.Function');
goog.require('pstj.ds.jstype.Type');

goog.scope(function() {
var Func = pstj.ds.jstype.Function;
var Type = pstj.ds.jstype.Type;


/** Provides the constructor JSType */
pstj.ds.jstype.Constructor = goog.defineClass(Func, {
  /**
   * @constructor
   * @extends {Func}
   */
  constructor: function() {
    Func.call(this);
    this.setTypeInternal(Type.CONSTRUCTOR);
    /**
     * List of class properties.
     * @type {Array<pstj.ds.jstype.Property>}
     * @protected
     */
    this.properties = [];
    /**
     * List of class methods.
     * @type {Array<pstj.ds.jstype.Method>}
     * @protected
     */
    this.methods = [];
  },


  /** @inheritDoc */
  getType: function() {
    return '@constructor';
  },


  /**
   * Add new property to the class record.
   * @param {pstj.ds.jstype.Property} prop
   */
  addProperty: function(prop) {
    prop.setNamespace(this.name);
    this.properties.push(prop);
  },


  /**
   * Add new method to the class record.
   * @param {pstj.ds.jstype.Method} method
   */
  addMethod: function(method) {
    method.setNamespace(this.name);
    this.methods.push(method);
  },


  textile: function() {
    var rows = goog.base(this, 'textile');
    goog.array.forEach(this.properties, function(prop) {
      rows.push('\n');
      var a = prop.textile();
      // console.log(a);
      goog.array.forEach(a, function(row) {
        rows.push(row);
      });
    });

    goog.array.forEach(this.methods, function(method) {
      rows.push('\n');
      var a = method.textile();
      goog.array.forEach(a, function(row) {
        rows.push(row);
      });
    });
    return rows;
  },


  /** @inheritDoc */
  addJSDocs: function(list) {
    list.push('\n');
    goog.base(this, 'addJSDocs', list);
  }

});

});  // goog.scope

