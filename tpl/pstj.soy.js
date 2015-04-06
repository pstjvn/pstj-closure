// This file was automatically generated from pstj.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace pstj.templates.
 */

goog.provide('pstj.templates');

goog.require('soy');
goog.require('soydata');
goog.require('goog.asserts');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.CustomScrollArea = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('custom-scroll-area') + '"><div class="' + goog.getCssName('custom-scroll-internal') + '"><div class="' + goog.getCssName('custom-scroll-div') + '"></div></div><div class="' + goog.getCssName('custom-scroll-bar') + ' ' + goog.getCssName('goog-slider') + '"><div class="' + goog.getCssName('custom-scroll-bar-line') + '"></div><div class="' + goog.getCssName('goog-slider-thumb') + ' ' + goog.getCssName('custom-scroll-bar-thumb') + '"></div></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.CustomScrollArea.soyTemplateName = 'pstj.templates.CustomScrollArea';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.page = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-pager-item') + '"><div class="' + goog.getCssName('pstj-pager-item-vertical-adjustment') + '"><div class="' + goog.getCssName('pstj-pager-item-text') + '" data-model="description"></div></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.page.soyTemplateName = 'pstj.templates.page';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.pager = function(opt_data, opt_ignored) {
  var output = '<div class="' + goog.getCssName('pstj-pager-wrapper') + '"><div class="' + goog.getCssName('pstj-pager-items') + '">';
  var itemLimit380 = opt_data.itemsCount;
  for (var item380 = 0; item380 < itemLimit380; item380++) {
    output += pstj.templates.page(null);
  }
  output += '</div><div class="' + goog.getCssName('pstj-pager-page-indicator') + '">Page <span class="' + goog.getCssName('pstj-pager-page') + '"></span> of <span class="' + goog.getCssName('pstj-pager-pages') + '"></span></div></div>';
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  pstj.templates.pager.soyTemplateName = 'pstj.templates.pager';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.listitem = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-list-item') + '"><div class="' + goog.getCssName('pstj-list-item-container') + '"><div class="' + goog.getCssName('pstj-list-item-image-holder') + '"><img src="' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(opt_data.thumbnail)) + '" class="' + goog.getCssName('pstj-list-item-thumbnail') + '" /></div><div class="' + goog.getCssName('pstj-list-item-name') + '">' + soy.$$escapeHtml(opt_data.name) + '</div></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.listitem.soyTemplateName = 'pstj.templates.listitem';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.list = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-list') + '"><div class="' + goog.getCssName('pstj-list-container') + '"><span class="' + goog.getCssName('pstj-list-notice') + '"></span></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.list.soyTemplateName = 'pstj.templates.list';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.upload = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-upload-form') + '"><form method="post" enctype="multipart/form-data" action="' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(opt_data.url)) + '" name="uploadform"><input id="attachment" name="' + soy.$$escapeHtmlAttribute(opt_data.inputname) + '" type="file" style="display:none" class="' + goog.getCssName('pstj-upload-form-input') + '" /></form></div>');
};
if (goog.DEBUG) {
  pstj.templates.upload.soyTemplateName = 'pstj.templates.upload';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.controlgroup = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-control-group') + ' ' + goog.getCssName('d-table') + '"><div class="' + goog.getCssName('pstj-control-group-button') + ' ' + goog.getCssName('d-table-cell') + '" data-action="namedaction"><div class="' + goog.getCssName('d-table') + ' ' + goog.getCssName('margin-auto') + '"><img src="assets/left-arrow.png" class="' + goog.getCssName('d-table-cell') + ' ' + goog.getCssName('pstj-control-group-button-image') + '" /></div></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.controlgroup.soyTemplateName = 'pstj.templates.controlgroup';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.progress = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-widget-progress') + '">' + ((opt_data.text != '') ? '<div class="' + goog.getCssName('pstj-widget-progress-text') + '">' + soy.$$escapeHtml(opt_data.text) + '</div>' : '') + '<div class="' + goog.getCssName('pstj-widget-progress-container') + '"><div class="' + goog.getCssName('pstj-widget-progress-bar') + '"></div></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.progress.soyTemplateName = 'pstj.templates.progress';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.select = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-widget-select') + '"><div class="' + goog.getCssName('pstj-widget-select-view') + '"><div class="' + goog.getCssName('pstj-widget-select-title') + '">Select item</div><div class="' + goog.getCssName('pstj-widget-select-body') + '">' + pstj.templates.list(null) + '</div><div class="' + goog.getCssName('pstj-widget-select-footer') + '"><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('pstj-widget-select-text-button') + ' ' + goog.getCssName('pstj-action-select') + '" data-action="select">Select</div><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('pstj-widget-select-text-button') + ' ' + goog.getCssName('pstj-action-cancel') + '" data-action="cancel">Cancel</div></div></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.select.soyTemplateName = 'pstj.templates.select';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.popover = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-popover-event-blocker') + '"><div class="' + goog.getCssName('pstj-popover-frame') + '"></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.popover.soyTemplateName = 'pstj.templates.popover';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.Control = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div></div>');
};
if (goog.DEBUG) {
  pstj.templates.Control.soyTemplateName = 'pstj.templates.Control';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.clock = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-widget-clock') + '"><div class="' + goog.getCssName('pstj-widget-clock-time') + '" data-model="time" data-filter="datetime(HH:mm:ss)"></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.clock.soyTemplateName = 'pstj.templates.clock';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.TableViewItem = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('tableviewitem') + '"><div data-model="id"></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.TableViewItem.soyTemplateName = 'pstj.templates.TableViewItem';
}


/**
 * @param {{
 *    src: string,
 *    text: (null|string|undefined)
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.Swipetile = function(opt_data, opt_ignored) {
  goog.asserts.assert(goog.isString(opt_data.src) || (opt_data.src instanceof goog.soy.data.SanitizedContent), "expected param 'src' of type string|goog.soy.data.SanitizedContent.");
  var src = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.src);
  goog.asserts.assert(opt_data.text == null || (opt_data.text instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.text), "expected param 'text' of type null|string|undefined.");
  var text = /** @type {null|string|undefined} */ (opt_data.text);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('pstj-swipetile') + '"><div class="' + goog.getCssName('pstj-swipetile-image') + '" style="background-image: url(' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(src)) + ')">' + ((text) ? '<div class="' + goog.getCssName('pstj-swipetile-text-container') + '"><div class="' + goog.getCssName('pstj-swipetile-text') + '">' + soy.$$escapeHtml(text) + '</div></div>' : '') + '</div></div>');
};
if (goog.DEBUG) {
  pstj.templates.Swipetile.soyTemplateName = 'pstj.templates.Swipetile';
}


/**
 * @param {{
 *    items: !Array.<?>
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.Swiper = function(opt_data, opt_ignored) {
  var items = goog.asserts.assertArray(opt_data.items, "expected parameter 'items' of type list<unknown>.");
  var output = '<div is class="' + goog.getCssName('pstj-swiper') + ' ' + goog.getCssName('core-swipe') + '" use-pointer>';
  var itemList549 = items;
  var itemListLen549 = itemList549.length;
  for (var itemIndex549 = 0; itemIndex549 < itemListLen549; itemIndex549++) {
    var itemData549 = itemList549[itemIndex549];
    output += pstj.templates.Swipetile(itemData549);
  }
  output += '</div>';
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  pstj.templates.Swiper.soyTemplateName = 'pstj.templates.Swiper';
}
