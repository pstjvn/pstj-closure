// This file was automatically generated from pstj.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace pstj.templates.
 * @public
 */

goog.provide('pstj.templates');

goog.require('soy');
goog.require('soydata');
/** @suppress {extraRequire} */
goog.require('goog.asserts');
goog.require('pstj.material.template');


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.CustomScrollArea = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('custom-scroll-area') + '"><div class="' + goog.getCssName('custom-scroll-internal') + '"><div class="' + goog.getCssName('custom-scroll-div') + '"></div></div><div class="' + goog.getCssName('custom-scroll-bar') + ' ' + goog.getCssName('goog-slider') + '"><div class="' + goog.getCssName('custom-scroll-bar-line') + '"></div><div class="' + goog.getCssName('goog-slider-thumb') + ' ' + goog.getCssName('custom-scroll-bar-thumb') + '"></div></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.CustomScrollArea.soyTemplateName = 'pstj.templates.CustomScrollArea';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.page = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-pager-item') + '"><div class="' + goog.getCssName('pstj-pager-item-vertical-adjustment') + '"><div class="' + goog.getCssName('pstj-pager-item-text') + '" data-model="description"></div></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.page.soyTemplateName = 'pstj.templates.page';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.pager = function(opt_data, opt_ignored, opt_ijData) {
  var output = '<div class="' + goog.getCssName('pstj-pager-wrapper') + '"><div class="' + goog.getCssName('pstj-pager-items') + '">';
  var itemLimit626 = opt_data.itemsCount;
  for (var item626 = 0; item626 < itemLimit626; item626++) {
    output += pstj.templates.page(null, null, opt_ijData);
  }
  output += '</div><div class="' + goog.getCssName('pstj-pager-page-indicator') + '">Page <span class="' + goog.getCssName('pstj-pager-page') + '"></span> of <span class="' + goog.getCssName('pstj-pager-pages') + '"></span></div></div>';
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  pstj.templates.pager.soyTemplateName = 'pstj.templates.pager';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.listitem = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-list-item') + '"><div class="' + goog.getCssName('pstj-list-item-container') + '"><div class="' + goog.getCssName('pstj-list-item-image-holder') + '"><img src="' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeMediaUri(opt_data.thumbnail)) + '" class="' + goog.getCssName('pstj-list-item-thumbnail') + '" /></div><div class="' + goog.getCssName('pstj-list-item-name') + '">' + soy.$$escapeHtml(opt_data.name) + '</div></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.listitem.soyTemplateName = 'pstj.templates.listitem';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.list = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-list') + '"><div class="' + goog.getCssName('pstj-list-container') + '"><span class="' + goog.getCssName('pstj-list-notice') + '"></span></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.list.soyTemplateName = 'pstj.templates.list';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.upload = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-upload-form') + '"><form method="post" enctype="multipart/form-data" action="' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(opt_data.url)) + '" name="uploadform"><input id="attachment" name="' + soy.$$escapeHtmlAttribute(opt_data.inputname) + '" type="file" style="display:none" class="' + goog.getCssName('pstj-upload-form-input') + '" /></form></div>');
};
if (goog.DEBUG) {
  pstj.templates.upload.soyTemplateName = 'pstj.templates.upload';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.controlgroup = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-control-group') + ' ' + goog.getCssName('d-table') + '"><div class="' + goog.getCssName('pstj-control-group-button') + ' ' + goog.getCssName('d-table-cell') + '" data-action="namedaction"><div class="' + goog.getCssName('d-table') + ' ' + goog.getCssName('margin-auto') + '"><img src="assets/left-arrow.png" class="' + goog.getCssName('d-table-cell') + ' ' + goog.getCssName('pstj-control-group-button-image') + '" /></div></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.controlgroup.soyTemplateName = 'pstj.templates.controlgroup';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.progress = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-widget-progress') + '">' + ((opt_data.text != '') ? '<div class="' + goog.getCssName('pstj-widget-progress-text') + '">' + soy.$$escapeHtml(opt_data.text) + '</div>' : '') + '<div class="' + goog.getCssName('pstj-widget-progress-container') + '"><div class="' + goog.getCssName('pstj-widget-progress-bar') + '"></div></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.progress.soyTemplateName = 'pstj.templates.progress';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.select = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-widget-select') + '"><div class="' + goog.getCssName('pstj-widget-select-view') + '"><div class="' + goog.getCssName('pstj-widget-select-title') + '">Select item</div><div class="' + goog.getCssName('pstj-widget-select-body') + '">' + pstj.templates.list(null, null, opt_ijData) + '</div><div class="' + goog.getCssName('pstj-widget-select-footer') + '"><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('pstj-widget-select-text-button') + ' ' + goog.getCssName('pstj-action-select') + '" data-action="select">Select</div><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('pstj-widget-select-text-button') + ' ' + goog.getCssName('pstj-action-cancel') + '" data-action="cancel">Cancel</div></div></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.select.soyTemplateName = 'pstj.templates.select';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.popover = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-popover-event-blocker') + '"><div class="' + goog.getCssName('pstj-popover-frame') + '"></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.popover.soyTemplateName = 'pstj.templates.popover';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.Control = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div></div>');
};
if (goog.DEBUG) {
  pstj.templates.Control.soyTemplateName = 'pstj.templates.Control';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.clock = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-widget-clock') + '"><div class="' + goog.getCssName('pstj-widget-clock-time') + '" data-model="time" data-filter="datetime(HH:mm:ss)"></div></div>');
};
if (goog.DEBUG) {
  pstj.templates.clock.soyTemplateName = 'pstj.templates.clock';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.TableViewItem = function(opt_data, opt_ignored, opt_ijData) {
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
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.Swipetile = function(opt_data, opt_ignored, opt_ijData) {
  soy.asserts.assertType(goog.isString(opt_data.src) || (opt_data.src instanceof goog.soy.data.SanitizedContent), 'src', opt_data.src, 'string|goog.soy.data.SanitizedContent');
  var src = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.src);
  soy.asserts.assertType(opt_data.text == null || (opt_data.text instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.text), 'text', opt_data.text, 'null|string|undefined');
  var text = /** @type {null|string|undefined} */ (opt_data.text);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('pstj-swipetile') + '"><div class="' + goog.getCssName('pstj-swipetile-image') + '" style="background-image: url(' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeMediaUri(src)) + ')">' + ((text) ? '<div class="' + goog.getCssName('pstj-swipetile-text-container') + '"><div class="' + goog.getCssName('pstj-swipetile-text') + '">' + soy.$$escapeHtml(text) + '</div></div>' : '') + '</div></div>');
};
if (goog.DEBUG) {
  pstj.templates.Swipetile.soyTemplateName = 'pstj.templates.Swipetile';
}


/**
 * @param {{
 *    items: !Array<(?)>
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.Swiper = function(opt_data, opt_ignored, opt_ijData) {
  var items = goog.asserts.assertArray(opt_data.items, "expected parameter 'items' of type list<?>.");
  var output = '<div is class="' + goog.getCssName('pstj-swiper') + ' ' + goog.getCssName('core-swipe') + '" use-pointer>';
  var itemList796 = items;
  var itemListLen796 = itemList796.length;
  for (var itemIndex796 = 0; itemIndex796 < itemListLen796; itemIndex796++) {
    var itemData796 = itemList796[itemIndex796];
    output += pstj.templates.Swipetile(itemData796, null, opt_ijData);
  }
  output += '</div>';
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  pstj.templates.Swiper.soyTemplateName = 'pstj.templates.Swiper';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.AppPage = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('app-page') + '"></div>');
};
if (goog.DEBUG) {
  pstj.templates.AppPage.soyTemplateName = 'pstj.templates.AppPage';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.AppPages = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('app-pages') + '"></div>');
};
if (goog.DEBUG) {
  pstj.templates.AppPages.soyTemplateName = 'pstj.templates.AppPages';
}


/**
 * @param {{
 *    delay: (null|number|undefined),
 *    auto: (boolean|null|undefined)
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.ErrorMsg = function(opt_data, opt_ignored, opt_ijData) {
  opt_data = opt_data || {};
  soy.asserts.assertType(opt_data.delay == null || goog.isNumber(opt_data.delay), 'delay', opt_data.delay, 'null|number|undefined');
  var delay = /** @type {null|number|undefined} */ (opt_data.delay);
  soy.asserts.assertType(opt_data.auto == null || goog.isBoolean(opt_data.auto) || opt_data.auto === 1 || opt_data.auto === 0, 'auto', opt_data.auto, 'boolean|null|undefined');
  var auto = /** @type {boolean|null|undefined} */ (opt_data.auto);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('error-msg') + '" ' + ((auto == true) ? 'auto ' : '') + ((delay) ? 'delay="' + soy.$$escapeHtmlAttribute(delay) + '"' : '') + '></div>');
};
if (goog.DEBUG) {
  pstj.templates.ErrorMsg.soyTemplateName = 'pstj.templates.ErrorMsg';
}


/**
 * @param {{
 *    label: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.ListHeaderCell = function(opt_data, opt_ignored, opt_ijData) {
  soy.asserts.assertType(goog.isString(opt_data.label) || (opt_data.label instanceof goog.soy.data.SanitizedContent), 'label', opt_data.label, 'string|goog.soy.data.SanitizedContent');
  var label = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.label);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('list-header-cell') + '" use-pointer><div class="' + goog.getCssName('flex-1') + '">' + soy.$$escapeHtml(label) + '</div><div class="' + goog.getCssName('list-header-icon') + '">' + pstj.material.template.IconContainer({type: 'none'}, null, opt_ijData) + '</div></div>');
};
if (goog.DEBUG) {
  pstj.templates.ListHeaderCell.soyTemplateName = 'pstj.templates.ListHeaderCell';
}


/**
 * @param {{
 *    cells: !Array<string>,
 *    flexes: !Array<number>
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.templates.ListHeader = function(opt_data, opt_ignored, opt_ijData) {
  var $$temp;
  var cells = goog.asserts.assertArray(opt_data.cells, "expected parameter 'cells' of type list<string>.");
  var flexes = goog.asserts.assertArray(opt_data.flexes, "expected parameter 'flexes' of type list<float|int>.");
  var output = '<div is class="' + goog.getCssName('list-header') + ' ' + goog.getCssName('core-tap') + '"><div class="' + goog.getCssName('list-header-subhead') + '">';
  var labelList862 = cells;
  var labelListLen862 = labelList862.length;
  for (var labelIndex862 = 0; labelIndex862 < labelListLen862; labelIndex862++) {
    var labelData862 = labelList862[labelIndex862];
    output += '<div class="' + goog.getCssName('list-header-item');
    var local_index__soy843 = labelIndex862;
    if (flexes[local_index__soy843]) {
      var flex__soy846 = flexes[local_index__soy843];
      switch (flex__soy846) {
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
    output += '">' + pstj.templates.ListHeaderCell({label: labelData862}, null, opt_ijData) + '</div>';
  }
  output += '</div></div>';
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  pstj.templates.ListHeader.soyTemplateName = 'pstj.templates.ListHeader';
}
