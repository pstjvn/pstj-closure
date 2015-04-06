goog.provide('pstj.ds.dto.Swipetile');
goog.provide('pstj.ds.dto.SwipetileList');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');

goog.scope(function() {
var DTO = pstj.ds.DtoBase;
var a = goog.asserts;


/** @extends {DTO} */
pstj.ds.dto.Swipetile = goog.defineClass(DTO, {
  constructor: function() {
    DTO.call(this);
    /** @type {string} */
    this.src = '';
    /** @type {string} */
    this.text = '';
  },

  /** @override */
  fromJSON: function(map) {
    this.src = a.assertString(map['src']);
    this.text = a.assertString(map['text']);
    goog.base(this, 'fromJSON', map);
  }
});


/** @extends {DTO} */
pstj.ds.dto.SwipetileList = goog.defineClass(DTO, {
  constructor: function() {
    DTO.call(this);
    /** @type {Array<pstj.ds.dto.Swipetile>} */
    this.tiles = [];
  },

  /** @override */
  fromJSON: function(map) {
    goog.asserts.assertArray(map);
    goog.array.forEach(map, function(item) {
      var st = new pstj.ds.dto.Swipetile();
      st.fromJSON(item);
      this.tiles.push(st);
    }, this);
    goog.base(this, 'fromJSON', map);
  }
});
});  // goog.scope
