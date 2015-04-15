/**
 * @fileoverview Implements custom scroll area designed to handle lists.
 * Lists can be sorted or not. Lists are expected to be filtered and will be
 * created as substitute (i.e. data source).
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */
goog.provide('pstj.ui.ScrollList');

goog.require('goog.style');
goog.require('pstj.ui.CustomScrollArea');
goog.require('pstj.ui.IdGenerator');



/**
 * Class that provides scrollable user interface for list of items. The
 * construct will aim to fit all list items in such a way so to always make
 * the width filled with items. For do this the minimum possible width for
 * each item will be calculated (using parameter) and if needed the width of
 * the elements will be corrected in order to fill each row of elements to fit
 * them all and make them equal.
 *
 * Example: minimal width = 100;
 * area width 450 item width will be calculated as
 * (450 / ((450 / 100) << 0)) << 0
 * item with style will be set to the result.
 *
 * Scroll area size change events are registered and the item with is
 * recalculated if needed.
 *
 * @constructor
 * @extends {pstj.ui.CustomScrollArea}
 * @param {number=} opt_minimalItemWidth The minimum width list item could
 * have.
 * @param {goog.dom.DomHelper=} opt_odh Optional, dom helper instance.
 */
pstj.ui.ScrollList = function(opt_minimalItemWidth, opt_odh) {
  goog.base(this, opt_odh);
  this.scrollDivId_ = pstj.ui.IdGenerator.getInstance().getNextUniqueId();
  if (goog.isNumber(opt_minimalItemWidth)) {
    this.minimalRequiredItemWidth_ = opt_minimalItemWidth;
  }
};
goog.inherits(pstj.ui.ScrollList, pstj.ui.CustomScrollArea);


/**
 * The style sheet that will be installed to adjust the list items to the
 * scroll width.
 * @type {Element|StyleSheet}
 * @private
 */
pstj.ui.ScrollList.prototype.itemWidthStyleElement_;


/**
 * The ID of the scroll DIV element. Uniquely generated for each instance.
 * Used to create the CSS text for the item width styling.
 * @type {!string}
 * @private
 */
pstj.ui.ScrollList.prototype.scrollDivId_ = '';


/**
 * Number of elements that can currently fit on one raw. This is used with
 * floating elements.
 * @type {!number}
 * @private
 */
pstj.ui.ScrollList.prototype.itemsPerRaw_ = 0;


/**
 * Currently applied item width. This is used for floating list items, when
 * the desired behaviour is to always fit inside the scroll container.
 * @type {!number}
 * @private
 */
pstj.ui.ScrollList.prototype.appliedItemWidth_ = 0;


/**
 * The minimal required item width (in pixels).
 * @type {!number}
 * @private
 */
pstj.ui.ScrollList.prototype.minimalRequiredItemWidth_ = 128;


/**
 * Calculates suitable item width in respect of the minimal required item
 * width. The calculated width is used to fill a row in the scroll area.
 * @protected
 * @return {!number} The calculated item width.
 */
pstj.ui.ScrollList.prototype.calculateItemWidth = function() {
  return this.calculateScrollNominalWidth() /
      this.calculateNumberOfItemsPerRow() << 0;
};


/**
 * Calculates how many items can fit on a single row in the container based on
 * the currently available width in it. It also records the value in the
 * itemsPerRaw_ property, however it is not used in the default
 * implementation.
 * @protected
 * @return {!number} The number of items that can be put on a single row.
 */
pstj.ui.ScrollList.prototype.calculateNumberOfItemsPerRow = function() {
  this.itemsPerRaw_ = (this.calculateScrollNominalWidth() /
      this.minimalRequiredItemWidth_) << 0;
  return this.itemsPerRaw_;
};


/**
 * Sets the item width according to the minimal item width. Note that the
 * child component should not set its own width in order for this to work.
 * @protected
 */
pstj.ui.ScrollList.prototype.setItemWidth = function() {
  var newItemWidth = this.calculateItemWidth();
  if (this.appliedItemWidth_ != newItemWidth) {
    this.appliedItemWidth_ = newItemWidth;
    this.applyItemWidthStyle();
  }
};


/**
 * Override the onResize method to handle the case where the item width should
 * be adjusted based on the new width of the scrolled area.
 * @inheritDoc
 */
pstj.ui.ScrollList.prototype.onResize = function() {
  goog.base(this, 'onResize');
  this.setItemWidth();
};


/**
 * Override the decorate method, because we need to have a unique id stored in
 * the class that will be used to set the styling for the items. The ID will be
 * assigned to the scroll DIV element.
 * @inheritDoc
 */
pstj.ui.ScrollList.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);
  var div = this.getContentElement();
  if (!goog.isNull(div)) {
    div.id = this.scrollDivId_;
  }
};


/**
 * This method will apply the calculated item width to the children of the
 * container via style sheet. Note that this implementation will use the ID of
 * the containing DIV element and the class name of the first item in it to
 * compose the cssText.
 * @protected
 */
pstj.ui.ScrollList.prototype.applyItemWidthStyle = function() {
  var csstext = '#' + this.scrollDivId_ + ' .' +
      pstj.ui.ScrollList.Classes.ListItem + '{';
  csstext += 'width:' + this.appliedItemWidth_ + 'px;';
  csstext += '}';

  if (!this.itemWidthStyleElement_) {
    this.itemWidthStyleElement_ = goog.style.installStyles(csstext);
  } else {
    goog.style.setStyles(this.itemWidthStyleElement_, csstext);
  }
};


/**
 * Enumerates the class names that are used in the class.
 * @enum {string}
 */
pstj.ui.ScrollList.Classes = {
  ListItem: goog.getCssName('scroll-list-item')
};
