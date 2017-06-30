// This file was automatically generated from pstj.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace pstj.templates.
 * @public
 */

goog.provide('pstj.templates');

goog.require('goog.soy.data.SanitizedContent');
goog.require('pstj.material.template');
goog.require('soy');
goog.require('soy.asserts');
goog.require('soydata.VERY_UNSAFE');


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.CustomScrollArea = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.CustomScrollArea, templates/pstj.soy, 9)-->' : '') + '<div class="' + goog.getCssName('custom-scroll-area') + '"><div class="' + goog.getCssName('custom-scroll-internal') + '"><div class="' + goog.getCssName('custom-scroll-div') + '"></div></div><div class="' + goog.getCssName('custom-scroll-bar') + ' ' + goog.getCssName('goog-slider') + '"><div class="' + goog.getCssName('custom-scroll-bar-line') + '"></div><div class="' + goog.getCssName('goog-slider-thumb') + ' ' + goog.getCssName('custom-scroll-bar-thumb') + '"></div></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.CustomScrollArea)-->' : ''));
};
if (goog.DEBUG) {
  pstj.templates.CustomScrollArea.soyTemplateName = 'pstj.templates.CustomScrollArea';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.page = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.page, templates/pstj.soy, 24)-->' : '') + '<div class="' + goog.getCssName('pstj-pager-item') + '"><div class="' + goog.getCssName('pstj-pager-item-vertical-adjustment') + '"><div class="' + goog.getCssName('pstj-pager-item-text') + '" data-model="description"></div></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.page)-->' : ''));
};
if (goog.DEBUG) {
  pstj.templates.page.soyTemplateName = 'pstj.templates.page';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.pager = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  var output = (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.pager, templates/pstj.soy, 37)-->' : '') + '<div class="' + goog.getCssName('pstj-pager-wrapper') + '"><div class="' + goog.getCssName('pstj-pager-items') + '">';
  var item2843Limit = opt_data.itemsCount;
  for (var item2843 = 0; item2843 < item2843Limit; item2843++) {
    output += pstj.templates.page(null, null, opt_ijData);
  }
  output += '</div><div class="' + goog.getCssName('pstj-pager-page-indicator') + '">Page <span class="' + goog.getCssName('pstj-pager-page') + '"></span> of <span class="' + goog.getCssName('pstj-pager-pages') + '"></span></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.pager)-->' : '');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  pstj.templates.pager.soyTemplateName = 'pstj.templates.pager';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.listitem = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.listitem, templates/pstj.soy, 58)-->' : '') + '<div class="' + goog.getCssName('pstj-list-item') + '"><div class="' + goog.getCssName('pstj-list-item-container') + '"><div class="' + goog.getCssName('pstj-list-item-image-holder') + '"><img src="' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeMediaUri(opt_data.thumbnail)) + '" class="' + goog.getCssName('pstj-list-item-thumbnail') + '"/></div><div class="' + goog.getCssName('pstj-list-item-name') + '">' + soy.$$escapeHtml(opt_data.name) + '</div></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.listitem)-->' : ''));
};
if (goog.DEBUG) {
  pstj.templates.listitem.soyTemplateName = 'pstj.templates.listitem';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.list = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.list, templates/pstj.soy, 72)-->' : '') + '<div class="' + goog.getCssName('pstj-list') + '"><div class="' + goog.getCssName('pstj-list-container') + '"><span class="' + goog.getCssName('pstj-list-notice') + '"></span></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.list)-->' : ''));
};
if (goog.DEBUG) {
  pstj.templates.list.soyTemplateName = 'pstj.templates.list';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.upload = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.upload, templates/pstj.soy, 86)-->' : '') + '<div class="' + goog.getCssName('pstj-upload-form') + '"><form method="post" enctype="multipart/form-data" action="' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(opt_data.url)) + '" name="uploadform"><input id="attachment" name="' + soy.$$escapeHtmlAttribute(opt_data.inputname) + '" type="file" style="display:none" class="' + goog.getCssName('pstj-upload-form-input') + '"/></form></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.upload)-->' : ''));
};
if (goog.DEBUG) {
  pstj.templates.upload.soyTemplateName = 'pstj.templates.upload';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.controlgroup = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.controlgroup, templates/pstj.soy, 100)-->' : '') + '<div class="' + goog.getCssName('pstj-control-group') + ' ' + goog.getCssName('d-table') + '"><div class="' + goog.getCssName('pstj-control-group-button') + ' ' + goog.getCssName('d-table-cell') + '" data-action="namedaction"><div class="' + goog.getCssName('d-table') + ' ' + goog.getCssName('margin-auto') + '"><img src="assets/left-arrow.png" class="' + goog.getCssName('d-table-cell') + ' ' + goog.getCssName('pstj-control-group-button-image') + '"/></div></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.controlgroup)-->' : ''));
};
if (goog.DEBUG) {
  pstj.templates.controlgroup.soyTemplateName = 'pstj.templates.controlgroup';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.progress = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.progress, templates/pstj.soy, 114)-->' : '') + '<div class="' + goog.getCssName('pstj-widget-progress') + '">' + (opt_data.text != '' ? '<div class="' + goog.getCssName('pstj-widget-progress-text') + '">' + soy.$$escapeHtml(opt_data.text) + '</div>' : '') + '<div class="' + goog.getCssName('pstj-widget-progress-container') + '"><div class="' + goog.getCssName('pstj-widget-progress-bar') + '"></div></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.progress)-->' : ''));
};
if (goog.DEBUG) {
  pstj.templates.progress.soyTemplateName = 'pstj.templates.progress';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.select = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.select, templates/pstj.soy, 131)-->' : '') + '<div class="' + goog.getCssName('pstj-widget-select') + '"><div class="' + goog.getCssName('pstj-widget-select-view') + '"><div class="' + goog.getCssName('pstj-widget-select-title') + '">Select item</div><div class="' + goog.getCssName('pstj-widget-select-body') + '">' + pstj.templates.list(null, null, opt_ijData) + '</div><div class="' + goog.getCssName('pstj-widget-select-footer') + '"><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('pstj-widget-select-text-button') + ' ' + goog.getCssName('pstj-action-select') + '" data-action="select">Select</div><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('pstj-widget-select-text-button') + ' ' + goog.getCssName('pstj-action-cancel') + '" data-action="cancel">Cancel</div></div></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.select)-->' : ''));
};
if (goog.DEBUG) {
  pstj.templates.select.soyTemplateName = 'pstj.templates.select';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.popover = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.popover, templates/pstj.soy, 150)-->' : '') + '<div class="' + goog.getCssName('pstj-popover-event-blocker') + '"><div class="' + goog.getCssName('pstj-popover-frame') + '"></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.popover)-->' : ''));
};
if (goog.DEBUG) {
  pstj.templates.popover.soyTemplateName = 'pstj.templates.popover';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.Control = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.Control, templates/pstj.soy, 159)-->' : '') + '<div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.Control)-->' : ''));
};
if (goog.DEBUG) {
  pstj.templates.Control.soyTemplateName = 'pstj.templates.Control';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.clock = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.clock, templates/pstj.soy, 168)-->' : '') + '<div class="' + goog.getCssName('pstj-widget-clock') + '"><div class="' + goog.getCssName('pstj-widget-clock-time') + '" data-model="time" data-filter="datetime(HH:mm:ss)"></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.clock)-->' : ''));
};
if (goog.DEBUG) {
  pstj.templates.clock.soyTemplateName = 'pstj.templates.clock';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.TableViewItem = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.TableViewItem, templates/pstj.soy, 177)-->' : '') + '<div class="' + goog.getCssName('tableviewitem') + '"><div data-model="id"></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.TableViewItem)-->' : ''));
};
if (goog.DEBUG) {
  pstj.templates.TableViewItem.soyTemplateName = 'pstj.templates.TableViewItem';
}


/**
 * @param {pstj.templates.Swipetile.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.Swipetile = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var src = soy.asserts.assertType(goog.isString(opt_data.src) || opt_data.src instanceof goog.soy.data.SanitizedContent, 'src', opt_data.src, '!goog.soy.data.SanitizedContent|string');
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var text = soy.asserts.assertType(opt_data.text == null || (goog.isString(opt_data.text) || opt_data.text instanceof goog.soy.data.SanitizedContent), 'text', opt_data.text, '!goog.soy.data.SanitizedContent|null|string|undefined');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.Swipetile, templates/pstj.soy, 185)-->' : '') + '<div is class="' + goog.getCssName('pstj-swipetile') + '"><div class="' + goog.getCssName('pstj-swipetile-image') + '" style="background-image: url(' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeMediaUri(src)) + ')">' + (text ? '<div class="' + goog.getCssName('pstj-swipetile-text-container') + '"><div class="' + goog.getCssName('pstj-swipetile-text') + '">' + soy.$$escapeHtml(text) + '</div></div>' : '') + '</div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.Swipetile)-->' : ''));
};
/**
 * @typedef {{
 *  src: (!goog.soy.data.SanitizedContent|string),
 *  text: (!goog.soy.data.SanitizedContent|null|string|undefined),
 * }}
 */
pstj.templates.Swipetile.Params;
if (goog.DEBUG) {
  pstj.templates.Swipetile.soyTemplateName = 'pstj.templates.Swipetile';
}


/**
 * @param {pstj.templates.Swiper.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.Swiper = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!Array<?>} */
  var items = soy.asserts.assertType(goog.isArray(opt_data.items), 'items', opt_data.items, '!Array<?>');
  var output = (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.Swiper, templates/pstj.soy, 200)-->' : '') + '<div is class="' + goog.getCssName('pstj-swiper') + ' ' + goog.getCssName('core-swipe') + '" use-pointer>';
  var item3029List = items;
  var item3029ListLen = item3029List.length;
  for (var item3029Index = 0; item3029Index < item3029ListLen; item3029Index++) {
      var item3029Data = item3029List[item3029Index];
      output += pstj.templates.Swipetile(item3029Data, null, opt_ijData);
    }
  output += '</div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.Swiper)-->' : '');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
/**
 * @typedef {{
 *  items: !Array<?>,
 * }}
 */
pstj.templates.Swiper.Params;
if (goog.DEBUG) {
  pstj.templates.Swiper.soyTemplateName = 'pstj.templates.Swiper';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.AppPage = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.AppPage, templates/pstj.soy, 213)-->' : '') + '<div is class="' + goog.getCssName('app-page') + '"></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.AppPage)-->' : ''));
};
if (goog.DEBUG) {
  pstj.templates.AppPage.soyTemplateName = 'pstj.templates.AppPage';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.AppPages = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.AppPages, templates/pstj.soy, 218)-->' : '') + '<div is class="' + goog.getCssName('app-pages') + '"></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.AppPages)-->' : ''));
};
if (goog.DEBUG) {
  pstj.templates.AppPages.soyTemplateName = 'pstj.templates.AppPages';
}


/**
 * @param {pstj.templates.ErrorMsg.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.ErrorMsg = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  opt_data = opt_data || {};
  /** @type {null|number|undefined} */
  var delay = soy.asserts.assertType(opt_data.delay == null || goog.isNumber(opt_data.delay), 'delay', opt_data.delay, 'null|number|undefined');
  /** @type {boolean|null|undefined} */
  var auto = soy.asserts.assertType(opt_data.auto == null || (goog.isBoolean(opt_data.auto) || opt_data.auto === 1 || opt_data.auto === 0), 'auto', opt_data.auto, 'boolean|null|undefined');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.ErrorMsg, templates/pstj.soy, 223)-->' : '') + '<div is class="' + goog.getCssName('error-msg') + ' ' + goog.getCssName('error-msg-disabled') + '"' + (auto == true ? ' auto' : '') + (delay ? ' delay="' + soy.$$escapeHtmlAttribute(delay) + '"' : '') + '></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.ErrorMsg)-->' : ''));
};
/**
 * @typedef {{
 *  delay: (null|number|undefined),
 *  auto: (boolean|null|undefined),
 * }}
 */
pstj.templates.ErrorMsg.Params;
if (goog.DEBUG) {
  pstj.templates.ErrorMsg.soyTemplateName = 'pstj.templates.ErrorMsg';
}


/**
 * @param {pstj.templates.ListHeaderCell.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.ListHeaderCell = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var label = soy.asserts.assertType(goog.isString(opt_data.label) || opt_data.label instanceof goog.soy.data.SanitizedContent, 'label', opt_data.label, '!goog.soy.data.SanitizedContent|string');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.ListHeaderCell, templates/pstj.soy, 230)-->' : '') + '<div is class="' + goog.getCssName('list-header-cell') + '" use-pointer><div class="' + goog.getCssName('flex-1') + '">' + soy.$$escapeHtml(label) + '</div><div class="' + goog.getCssName('list-header-icon') + '">' + pstj.material.template.IconContainer({type: 'none'}, null, opt_ijData) + '</div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.ListHeaderCell)-->' : ''));
};
/**
 * @typedef {{
 *  label: (!goog.soy.data.SanitizedContent|string),
 * }}
 */
pstj.templates.ListHeaderCell.Params;
if (goog.DEBUG) {
  pstj.templates.ListHeaderCell.soyTemplateName = 'pstj.templates.ListHeaderCell';
}


/**
 * @param {pstj.templates.ListHeader.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.ListHeader = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  var $$temp;
  /** @type {!Array<!goog.soy.data.SanitizedContent|string>} */
  var cells = soy.asserts.assertType(goog.isArray(opt_data.cells), 'cells', opt_data.cells, '!Array<!goog.soy.data.SanitizedContent|string>');
  /** @type {!Array<number>} */
  var flexes = soy.asserts.assertType(goog.isArray(opt_data.flexes), 'flexes', opt_data.flexes, '!Array<number>');
  var output = (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.templates.ListHeader, templates/pstj.soy, 244)-->' : '') + '<div is class="' + goog.getCssName('list-header') + ' ' + goog.getCssName('core-tap') + '"><div class="' + goog.getCssName('list-header-subhead') + '">';
  var label3089List = cells;
  var label3089ListLen = label3089List.length;
  for (var label3089Index = 0; label3089Index < label3089ListLen; label3089Index++) {
      var label3089Data = label3089List[label3089Index];
      output += '<div class="' + goog.getCssName('list-header-item');
      var local_index__soy3094 = label3089Index;
      if (flexes[local_index__soy3094]) {
        var flex__soy3099 = flexes[local_index__soy3094];
        switch (flex__soy3099) {
          case 1:
            output += goog.getCssName('flex-1');
            break;
          case 2:
            output += goog.getCssName('flex-2');
            break;
          case 3:
            output += goog.getCssName('flex-3');
            break;
          case 4:
            output += goog.getCssName('flex-4');
            break;
          case 5:
            output += goog.getCssName('flex-5');
            break;
        }
      }
      output += '">' + pstj.templates.ListHeaderCell({label: label3089Data}, null, opt_ijData) + '</div>';
    }
  output += '</div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.templates.ListHeader)-->' : '');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
/**
 * @typedef {{
 *  cells: !Array<!goog.soy.data.SanitizedContent|string>,
 *  flexes: !Array<number>,
 * }}
 */
pstj.templates.ListHeader.Params;
if (goog.DEBUG) {
  pstj.templates.ListHeader.soyTemplateName = 'pstj.templates.ListHeader';
}
