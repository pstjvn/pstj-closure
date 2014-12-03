/**
 * @fileoverview Provides the definitions for the custom events that are
 * dispatched by the material design elements and utilities.
 *
 * We define them separately to avoid circular dependencies in the
 * implementation file.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.EventType');

goog.require('goog.events');


/**
 * Defines the names of all custom events used by the material design
 * implementation classes.
 *
 * @enum {string}
 */
pstj.material.EventType = {
  RESPONSIVE_CHANGE: goog.events.getUniqueId('responsive-change'),
  MEDIA_CHANGE: goog.events.getUniqueId('media-change'),
  RIPPLE_END: goog.events.getUniqueId('ripple-end'),
  LOAD_START: goog.events.getUniqueId('load-start'),
  LOAD_END: goog.events.getUniqueId('load-end')
};

