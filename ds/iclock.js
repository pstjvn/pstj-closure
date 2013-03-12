goog.provide('pstj.ds.IClock');

/**
 * @fileoverview Provides the interface for a clock instance implementation.
 *   If a class implements this interface it will be able to subscribe for
 *   time updates with the global time provider and will be notified every
 *   time interval for the new time. An instance implementing this interface
 *   is guaranteed to receive the same time as all other instances that
 *   implement it and subscribe to the time provider as well. {@see
 *   pstj.ds.TimeProvider}
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * @interface
 */
pstj.ds.IClock = function() {};


/**
 * This method will receive the new time from the time provider based on the
 *   compiled in interval. The time will be provided in milliseconds offset
 *   from 1970/1/1 0:00.
 * @param {!number} time The time to set in the object.
 * @return {void} Should return nothing.
 */
pstj.ds.IClock.prototype.setTime;
