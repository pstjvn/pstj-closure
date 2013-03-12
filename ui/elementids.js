/**
 * @fileoverview Provides global getter for element IDs, tat are guarantieed to
 * be unique. This is a rip off of the goog.ui.IdGenerator, however the IDs work
 * with styles, i.e. an ID ':0' is not really a valid ID (the colon sign) and
 * breaks styles as well as querySelector*.
 *
 * @author  regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.IdGenerator');


/**
 * Creates a new generator for IDs. Unless you know what you are going, use the
 * instance getter.
 * @constructor
 */
pstj.ui.IdGenerator = function() {};
goog.addSingletonGetter(pstj.ui.IdGenerator);


/**
 * Next available ID suffix to use.
 * @type {number}
 * @private
 */
pstj.ui.IdGenerator.prototype.nextId_ = 0;


/**
 * Gets the next unique ID.
 * @return {string} The next unique element id.
 */
pstj.ui.IdGenerator.prototype.getNextUniqueId = function() {
  return 'elid_' + (this.nextId_++).toString(36);
};
