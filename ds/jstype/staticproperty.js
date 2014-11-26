goog.provide('pstj.ds.jstype.StaticProperty');

goog.require('pstj.ds.jstype.Property');
goog.require('pstj.ds.jstype.Type');

goog.scope(function() {
var P = pstj.ds.jstype.Property;
var Type = pstj.ds.jstype.Type;


/** Implements the static property jstype. */
pstj.ds.jstype.StaticProperty = goog.defineClass(P, {
  /**
   * @constructor
   * @extends {P}
   */
  constructor: function() {
    P.call(this);
    this.setTypeInternal(Type.STATIC_PROPERTY);
  },


  /** @inheritDoc */
  setName: function(name) {
    this.name = name.split(' ')[1];
  }
});

});  // goog.scope
