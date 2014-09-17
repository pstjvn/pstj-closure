goog.provide('pstj.ui.element.EventType');

goog.require('goog.events');


/**
 * Defines the names of all custom events in the custom element tree.
 *
 * @enum {string}
 */
pstj.ui.element.EventType = {
  RESPONSIVE_CHANGE: goog.events.getUniqueId('responsive-change'),
  MEDIA_CHANGE: goog.events.getUniqueId('media-change'),
  PRESS: goog.events.getUniqueId('press'),
  MOVE: goog.events.getUniqueId('move'),
  RELEASE: goog.events.getUniqueId('release'),
  LONGPRESS: goog.events.getUniqueId('longpress'),
  TAP: goog.events.getUniqueId('tap')
};
