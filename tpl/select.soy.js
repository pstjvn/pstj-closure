// This file was automatically generated from select.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace pstj.select.
 */

goog.provide('pstj.select');

goog.require('soy');
goog.require('soydata');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.select.Select = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-select') + '"><div class="' + goog.getCssName('pstj-select-view') + '"><div class="' + goog.getCssName('pstj-select-title') + '">Select item</div><div class="' + goog.getCssName('pstj-select-body') + '"></div><div class="' + goog.getCssName('pstj-select-footer') + '"><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('pstj-select-text-button') + ' ' + goog.getCssName('pstj-action-select') + '">Select</div><div class="' + goog.getCssName('form-button') + ' ' + goog.getCssName('text-button') + ' ' + goog.getCssName('pstj-select-text-button') + ' ' + goog.getCssName('pstj-action-cancel') + '">Cancel</div></div></div></div>');
};
if (goog.DEBUG) {
  pstj.select.Select.soyTemplateName = 'pstj.select.Select';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.select.SelectionItem = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('pstj-select-item') + '"><div class="' + goog.getCssName('pstj-select-item-image-holder') + '"><img src="' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(opt_data.thumbnail)) + '" class="' + goog.getCssName('pstj-select-item-thumbnail') + '" /></div><div class="' + goog.getCssName('pstj-select-item-name') + '">' + soy.$$escapeHtml(opt_data.name) + '</div></div>');
};
if (goog.DEBUG) {
  pstj.select.SelectionItem.soyTemplateName = 'pstj.select.SelectionItem';
}
