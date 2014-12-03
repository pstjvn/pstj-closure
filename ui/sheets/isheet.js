/**
 * @fileoverview Provides the sheet interface. This is designed to give
 *   interface for the sheet-frame implementors.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.ISheet');

goog.require('goog.math.Size');



/**
 * This is the interface to implement if a component wants to be used in a
 *   sheet-frame.
 * @interface
 */
pstj.ui.ISheet = function() {};


/**
 * Updates the record for the bounding parent size.
 * @param {goog.math.Size} size The repoter parent size bounding rect.
 */
pstj.ui.ISheet.prototype.updateParentSize = goog.abstractMethod;
