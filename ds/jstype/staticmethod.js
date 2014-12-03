goog.provide('pstj.ds.jstype.StaticMethod');

goog.require('pstj.ds.jstype.Method');

goog.scope(function() {
var Method = pstj.ds.jstype.Method;


/** Implements the static methods */
pstj.ds.jstype.StaticMethod = goog.defineClass(Method, {
  /**
   * @constructor
   * @extends {Method}
   */
  constructor: function() {
    Method.call(this);
  },


  /** @inheritDoc */
  setName: function(name) {
    var names = name.split(' ');
    this.type = names[1];
    this.name = names[2].split('(')[0];
  }

});

});  // goog.scope
