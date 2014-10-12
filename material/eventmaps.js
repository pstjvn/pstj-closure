/**
 * @fileoverview Collection of utilities for the renderers that provide mapping
 * from event flag to class names and vice versa.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.EventMap');

goog.require('goog.object');


goog.scope(function() {
var _ = pstj.material.EventMap;


/**
 * Provides bit mask-suitable event map that we use subsequently to determine
 * the automatic event bindings based on template. This is useful when we are
 * trying to build a component from a complex markup (usually a soy template)
 * and we do not want to 'program' the events that should be attached to the
 * component.
 * Setting up the class names in the desired places will enable those event for
 * the decorated component.
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
 * DOM should we enable 'event reflection'.
 *
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
 * Map of class name to event flag - used to determine the flag(s) that should
 * be set up for automatic event subscription of the elements on decoration
 * time.
 * The class name for a particular event will make the component
 * subscribe to that event(s) after it enters the document.
 * Example:
 *
 * <code>
 *  <div class="{css core-swipe}"></div>
 * </code>
 * @type {Object}
 */
_.EventByClass = goog.object.transpose(_.ClassByEvent);


/**
 * Returns the event flag matching a class name. If the class name does not
 * corresponds to a flag the NONE flag is returned.
 * @param {string} className The class name, possible representing a desired
 * auto event.
 * @return {_.EventFlag}
 */
_.getEventFlagForClass = function(className) {
  var flag = parseInt(_.EventByClass[className], 10);
  return /** @type {_.EventFlag} */(isNaN(flag) ? _.EventFlag.NONE : flag);
};


/**
 * Returns the class name that corresponds to a particular event flag. If no
 * class name exists for that flag undefined is returned.
 * @param {_.EventFlag} flag The flag.
 * @return {string|undefined}
 */
_.getClassForEventFlag = function(flag) {
  return _.EventFlag[flag];
};

});  // goog.scope

