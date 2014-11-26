goog.provide('pstj.ds.jstype.Parameter');

goog.require('goog.string');
goog.require('pstj.ds.jstype.Record');
goog.require('pstj.ds.jstype.Type');

goog.scope(function() {
var Record = pstj.ds.jstype.Record;
var Type = pstj.ds.jstype.Type;


/** Implements the JSType parameter. */
pstj.ds.jstype.Parameter = goog.defineClass(Record, {
  /**
   * @constructor
   * @extends {Record}
   */
  constructor: function() {
    Record.call(this);
    this.setTypeInternal(Type.PARAMETER);
  },


  /**
   * Parameters have no assignment text.
   * @override
   */
  getAssignment: function() {
    return '';
  },


  /** @inheritDoc */
  textile: function() {
    var result = [];
    this.addJSDocDescription(result);
    return result;
  },


  /** @inheritDoc */
  getType: function() {
    var type = this.determineJSType();
    if (goog.string.startsWith(this.name, 'opt_')) {
      type = type + '=';
    }
    return type;
  },


  /** @inheritDoc */
  parseDescriptionToList: function(desc, width) {
    desc = '@param {' + this.getType() + '} ' + this.getName() + ' ' +
        desc;
    return goog.base(this, 'parseDescriptionToList', desc, width);
  }
});

});  // goog.scope
