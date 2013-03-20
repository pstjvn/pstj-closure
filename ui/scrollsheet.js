goog.provide('pstj.ui.ScrollSheet');

goog.require('goog.style');
goog.require('pstj.ui.ISheet');
goog.require('pstj.ui.Templated');

/**
 * @fileoverview Provides a sheet that uses the native scroll of the browser
 *   to implement its hidden larger sizes. The presumtion here is that the
 *   native scroll is accelerated and is accessible (i.e. touch devices for
 *   all directions scrolling or scrolling only vertically for mouse devices.)
 *
 *  TODO: Add fake scrollbars on hover for complete experience.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * A sheet that is using the native scrolling capabilities of the browser.
 * @constructor
 * @extends {pstj.ui.Templated}
 * @implements {pstj.ui.ISheet}
 */
pstj.ui.ScrollSheet = function() {
  goog.base(this);
};
goog.inherits(pstj.ui.ScrollSheet, pstj.ui.Templated);

/**
 * The scroll bar width in the current browser.
 * @type {number}
 */
pstj.ui.ScrollSheet.scrollBarWidth = goog.style.getScrollbarWidth();

/**
 * Here we actually want to hide the scroll bars at all time, thus we skip the
 *   asynchroniousity and directly alter the styling.
 * @override
 */
pstj.ui.ScrollSheet.prototype.updateParentSize = function(size) {
  var newSize = size.clone();
  newSize.width = newSize.width + pstj.ui.ScrollSheet.scrollBarWidth;
  newSize.height = newSize.height + pstj.ui.ScrollSheet.scrollBarWidth;
  this.getElement().style.width = newSize.width + 'px';
  this.getElement().style.height = newSize.height + 'px';
};
