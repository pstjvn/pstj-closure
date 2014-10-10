goog.provide('pstj.material.EventMap');

goog.require('goog.object');


goog.scope(function() {
var _ = pstj.material.EventMap;


/**
 * State list of the event, used to set the event state of the elements.
 * @enum {number}
 */
_.EventFlag = {
  NONE: 0,
  PRESS: 1,
  MOVE: 2,
  RELEASE: 4,
  TAP: 8,
  LONGPRESS: 16,
  SCROLL: 32,
  SWIPE: 64,
  RIPPLE: 128
};


/**
 * Map of event types to class names to set up on the element when creating the
 * dom,
 * @type {Object}
 */
_.ClassByEvent = goog.object.create(
    _.EventFlag.PRESS, goog.getCssName('core-press'),
    _.EventFlag.MOVE, goog.getCssName('core-move'),
    _.EventFlag.RELEASE, goog.getCssName('core-release'),
    _.EventFlag.TAP, goog.getCssName('core-tap'),
    _.EventFlag.LONGPRESS, goog.getCssName('core-longpress'),
    _.EventFlag.SCROLL, goog.getCssName('core-scroll'),
    _.EventFlag.SWIPE, goog.getCssName('core-swipe'),
    _.EventFlag.RIPPLE, goog.getCssName('core-ripple'));


/**
 * Map to obtain the event to set up by the class name that is present
 * on the element's root DOM node when decorating.
 * @type {Object}
 */
_.EventByClass = goog.object.transpose(_.ClassByEvent);


/**
 * Figureout the event state flag based on a class name in the DOM.
 * @param {string} className The class name, possible representing a desired
 * auto event.
 * @return {_.EventFlag}
 */
_.getEventFlagForClass = function(className) {
  var flag = parseInt(_.EventByClass[className], 10);
  return /** @type {_.EventFlag} */(isNaN(flag) ? _.EventFlag.NONE : flag);
};


/**
 * Retrieves class name for particular event flag.
 * @param {_.EventFlag} flag The flag.
 * @return {string|undefined}
 */
_.getClassForEventFlag = function(flag) {
  return _.EventFlag[flag];
};

});  // goog.scope

