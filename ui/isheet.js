goog.provide('pstj.ui.ISheet');

/**
 * @fileoverview Provides the sheet interface. This is designed to give
 *   interface for the sheetframe implementors.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * This is the interface to implement if a component wants to be used in a
 *   sheetframe.
 * @interface
 */
pstj.ui.ISheet = function() {};

/**
 * Updates the record for the bounding parent size.
 * @param {goog.math.Size} size The repoter parent size bounding rect.
 */
pstj.ui.ISheet.prototype.updateParentSize = goog.abstractMethod;
