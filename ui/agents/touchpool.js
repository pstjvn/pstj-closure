goog.provide('pstj.ui.Touch');
goog.provide('pstj.ui.TouchPool');

goog.require('goog.math.Coordinate');
goog.require('goog.structs.Pool');



/**
 * Conveniently wraps the touch in a nice object that can be pooled.
 * @constructor
 * @extends {goog.math.Coordinate}
 */
pstj.ui.Touch = function() {
  goog.base(this, 0, 0);
  this.timeStamp = 0;
};
goog.inherits(pstj.ui.Touch, goog.math.Coordinate);


goog.scope(function() {
var _ = pstj.ui.Touch.prototype;


/**
 * Populates the pooled object with new data.
 * @param {number} x The X of the touch point to recreate.
 * @param {number} y The Y value of the touch point to recreate.
 * @param {number=} opt_time_stamp The timestamp if provided.
 */
_.setTouch = function(x, y, opt_time_stamp) {
  this.timeStamp = opt_time_stamp || 0;
  this.x = x;
  this.y = y;
};

});  // goog.scope



/**
 * Provides the pool for the touch objects we want to be able to provide to
 * the users. They should be returned to the pool at the end of the dispatch
 * cycle.
 *
 * @constructor
 * @extends {goog.structs.Pool}
 */
pstj.ui.TouchPool = function() {
  // We can have up to 10 touches, right?
  goog.base(this, 0, 10);
};
goog.inherits(pstj.ui.TouchPool, goog.structs.Pool);
goog.addSingletonGetter(pstj.ui.TouchPool);


goog.scope(function() {
var _ = pstj.ui.TouchPool.prototype;


/**
 * @override
 * @return {pstj.ui.Touch} The new touch object.
 */
_.createObject = function() {
  return new pstj.ui.Touch();
};

});  // goog.scope
