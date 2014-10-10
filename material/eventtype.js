goog.provide('pstj.material.EventType');

goog.require('goog.events');


/**
 * Defines the names of all custom events in the custom element tree.
 *
 * @enum {string}
 */
pstj.material.EventType = {
  RESPONSIVE_CHANGE: goog.events.getUniqueId('responsive-change'),
  MEDIA_CHANGE: goog.events.getUniqueId('media-change'),
  RIPPLE_END: goog.events.getUniqueId('ripple-end')
};

