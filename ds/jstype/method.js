goog.provide('pstj.ds.jstype.Method');

goog.require('pstj.ds.jstype.Function');
goog.require('pstj.ds.jstype.Type');

goog.scope(function() {
var Func = pstj.ds.jstype.Function;
var Type = pstj.ds.jstype.Type;


/** Implementation of the method JSType. */
pstj.ds.jstype.Method = goog.defineClass(Func, {
  constructor: function() {
    Func.call(this);
    this.setTypeInternal(Type.METHOD);
    /**
     * Methods belong to the constructor's namespace's prototype.
     * @type {string}
     * @protected
     */
    this.namespace = '';
  },


  /**
   * Sets the namespace of the method. Methods are treated like functions with
   * the difference that they actually belong to the namespace of the
   * constructor function (class) prototype.
   * @param {string} ns
   */
  setNamespace: function(ns) {
    this.namespace = ns;
  },


  /** @inheritDoc */
  setName: function(name) {
    // should be with return here
    this.name = name.split(' ')[1].split('(')[0];
    this.type = name.split(' ')[0];
  },


  /** @inheritDoc */
  getName: function() {
    return ((this.namespace != '') ?
        (this.namespace + '.prototype.') :
        '') + goog.base(this, 'getName');
  }
});
});  // goog.scope
