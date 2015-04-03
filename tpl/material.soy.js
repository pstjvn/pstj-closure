// This file was automatically generated from material.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace pstj.material.template.
 */

goog.provide('pstj.material.template');

goog.require('soy');
goog.require('soydata');
goog.require('goog.asserts');


/**
 * @param {{
 *    content: (null|string|undefined)
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.CoreElement = function(opt_data, opt_ignored) {
  opt_data = opt_data || {};
  goog.asserts.assert(opt_data.content == null || (opt_data.content instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.content), "expected param 'content' of type null|string|undefined.");
  var content = /** @type {null|string|undefined} */ (opt_data.content);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('core-element') + '">' + ((content) ? soy.$$escapeHtml(content) : '') + '</div>');
};
if (goog.DEBUG) {
  pstj.material.template.CoreElement.soyTemplateName = 'pstj.material.template.CoreElement';
}


/**
 * @param {{
 *    content: (null|string|undefined)
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Item = function(opt_data, opt_ignored) {
  opt_data = opt_data || {};
  goog.asserts.assert(opt_data.content == null || (opt_data.content instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.content), "expected param 'content' of type null|string|undefined.");
  var content = /** @type {null|string|undefined} */ (opt_data.content);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('core-item') + '">' + ((content) ? soy.$$escapeHtml(content) : '') + '</div>');
};
if (goog.DEBUG) {
  pstj.material.template.Item.soyTemplateName = 'pstj.material.template.Item';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Panel = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-panel') + '">' + pstj.material.template.Shadow(null) + '<div class="' + goog.getCssName('material-panel-content-holder') + '"></div><div is class="' + goog.getCssName('core-element') + ' ' + goog.getCssName('material-panel-overlay') + '"></div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.Panel.soyTemplateName = 'pstj.material.template.Panel';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.DrawerPanel = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-drawer-panel') + '" use-pointer>' + pstj.material.template.Panel(null) + '<div class="' + goog.getCssName('material-drawer-panel-sidebar') + '">' + pstj.material.template.Panel(null) + '</div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.DrawerPanel.soyTemplateName = 'pstj.material.template.DrawerPanel';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.HeaderPanelMain = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-header-panel-main') + '" use-scroll><div class="' + goog.getCssName('material-header-panel-main-container') + '"><div class="' + goog.getCssName('material-header-panel-main-content') + '"></div></div><div class="' + goog.getCssName('material-drop-shadow') + '"></div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.HeaderPanelMain.soyTemplateName = 'pstj.material.template.HeaderPanelMain';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.HeaderPanelHeader = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-header-panel-header') + '"></div>');
};
if (goog.DEBUG) {
  pstj.material.template.HeaderPanelHeader.soyTemplateName = 'pstj.material.template.HeaderPanelHeader';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.HeaderPanel = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-header-panel') + '"><div class="' + goog.getCssName('material-header-panel-outer-container') + '">' + pstj.material.template.HeaderPanelHeader(null) + pstj.material.template.HeaderPanelMain(null) + '</div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.HeaderPanel.soyTemplateName = 'pstj.material.template.HeaderPanel';
}


/**
 * @param {{
 *    content: (null|string|undefined),
 *    circle: (boolean|null|undefined),
 *    recenter: (boolean|null|undefined),
 *    opacity: (null|number|undefined),
 *    usepointer: (boolean|null|undefined)
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Ripple = function(opt_data, opt_ignored) {
  opt_data = opt_data || {};
  goog.asserts.assert(opt_data.content == null || (opt_data.content instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.content), "expected param 'content' of type null|string|undefined.");
  var content = /** @type {null|string|undefined} */ (opt_data.content);
  goog.asserts.assert(opt_data.circle == null || goog.isBoolean(opt_data.circle), "expected param 'circle' of type boolean|null|undefined.");
  var circle = /** @type {boolean|null|undefined} */ (opt_data.circle);
  goog.asserts.assert(opt_data.recenter == null || goog.isBoolean(opt_data.recenter), "expected param 'recenter' of type boolean|null|undefined.");
  var recenter = /** @type {boolean|null|undefined} */ (opt_data.recenter);
  goog.asserts.assert(opt_data.opacity == null || goog.isNumber(opt_data.opacity), "expected param 'opacity' of type null|number|undefined.");
  var opacity = /** @type {null|number|undefined} */ (opt_data.opacity);
  goog.asserts.assert(opt_data.usepointer == null || goog.isBoolean(opt_data.usepointer), "expected param 'usepointer' of type boolean|null|undefined.");
  var usepointer = /** @type {boolean|null|undefined} */ (opt_data.usepointer);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('ripple') + ((circle) ? ' ' + goog.getCssName('ripple-circle') : '') + '"' + ((recenter) ? ' recenter' : '') + ((opacity) ? ' opacity="' + soy.$$escapeHtmlAttribute(opacity) + '"' : '') + ((usepointer) ? ' use-pointer' : '') + '><div class="' + goog.getCssName('ripple-bg') + '"></div><div class="' + goog.getCssName('ripple-waves') + '"></div><div class="' + goog.getCssName('ripple-content') + '">' + ((content) ? soy.$$escapeHtml(content) : '') + '</div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.Ripple.soyTemplateName = 'pstj.material.template.Ripple';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.FloatingLabel = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('floating-label') + '"><span class="' + goog.getCssName('floating-label-text') + '">' + soy.$$escapeHtml(opt_data.label) + '</span></div>');
};
if (goog.DEBUG) {
  pstj.material.template.FloatingLabel.soyTemplateName = 'pstj.material.template.FloatingLabel';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.InputUnderline = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('material-input-underline') + '"><div class="' + goog.getCssName('material-input-underline-unfocused') + '"></div><div class="' + goog.getCssName('material-input-underline-focused') + '"></div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.InputUnderline.soyTemplateName = 'pstj.material.template.InputUnderline';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.InputError = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('material-input-error') + '"><div class="' + goog.getCssName('material-input-error-text') + '" role="alert">' + soy.$$escapeHtml(opt_data.error) + '</div><div is class="' + goog.getCssName('material-icon') + ' ' + goog.getCssName('material-input-error-icon') + '" icon="warning" size="20"></div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.InputError.soyTemplateName = 'pstj.material.template.InputError';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.InputElement = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-input-body') + '"><div class="' + goog.getCssName('material-input-body-label') + '"><span class="' + goog.getCssName('material-input-body-label-text') + '">' + soy.$$escapeHtml(opt_data.label) + '</span></div><div is class="' + goog.getCssName('core-element') + ' ' + goog.getCssName('material-input-body-cursor') + '"></div><div class="' + goog.getCssName('material-input-body-container') + '"><input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" type="' + soy.$$escapeHtmlAttribute(opt_data.type) + '" value="' + soy.$$escapeHtmlAttribute(opt_data.value) + '" name="' + soy.$$escapeHtmlAttribute(opt_data.name) + '"></div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.InputElement.soyTemplateName = 'pstj.material.template.InputElement';
}


/**
 * @param {{
 *    content: (null|string|undefined),
 *    name: (null|string|undefined),
 *    value: (null|string|undefined)
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.RadioButton = function(opt_data, opt_ignored) {
  opt_data = opt_data || {};
  goog.asserts.assert(opt_data.content == null || (opt_data.content instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.content), "expected param 'content' of type null|string|undefined.");
  var content = /** @type {null|string|undefined} */ (opt_data.content);
  goog.asserts.assert(opt_data.name == null || (opt_data.name instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.name), "expected param 'name' of type null|string|undefined.");
  var name = /** @type {null|string|undefined} */ (opt_data.name);
  goog.asserts.assert(opt_data.value == null || (opt_data.value instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.value), "expected param 'value' of type null|string|undefined.");
  var value = /** @type {null|string|undefined} */ (opt_data.value);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-radio-button') + '" role="radio" tabindex="0" name="' + soy.$$escapeHtmlAttribute(name) + '" value="' + soy.$$escapeHtmlAttribute(value) + '"><div class="' + goog.getCssName('material-radio-button-container') + '"><div class="' + goog.getCssName('material-radio-button-off') + '"></div><div class="' + goog.getCssName('material-radio-button-on') + '"></div>' + pstj.material.template.Ripple({circle: true, recenter: true, usepointer: false}) + '</div><div class="' + goog.getCssName('material-radio-button-content') + '" aria-hidden="true">' + ((content) ? soy.$$escapeHtml(content) : '') + '</div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.RadioButton.soyTemplateName = 'pstj.material.template.RadioButton';
}


/**
 * @param {{
 *    name: (null|string|undefined)
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.ToggleButton = function(opt_data, opt_ignored) {
  opt_data = opt_data || {};
  goog.asserts.assert(opt_data.name == null || (opt_data.name instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.name), "expected param 'name' of type null|string|undefined.");
  var name = /** @type {null|string|undefined} */ (opt_data.name);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-toggle-button') + '" role="button" name="' + soy.$$escapeHtmlAttribute(name) + '"><div class="' + goog.getCssName('material-toggle-button-container') + '"><div class="' + goog.getCssName('material-toggle-button-bar') + '"></div>' + pstj.material.template.RadioButton({label: ''}) + '</div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.ToggleButton.soyTemplateName = 'pstj.material.template.ToggleButton';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.RadioGroup = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-radio-group') + '"></div>');
};
if (goog.DEBUG) {
  pstj.material.template.RadioGroup.soyTemplateName = 'pstj.material.template.RadioGroup';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Progressbar = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div class="' + goog.getCssName('material-progress-bar') + '"><div class="' + goog.getCssName('material-progress-bar-inner') + '"></div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.Progressbar.soyTemplateName = 'pstj.material.template.Progressbar';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Shadow = function(opt_data, opt_ignored) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-shadow') + ' ' + goog.getCssName('material-shadow-0') + '"><div class="' + goog.getCssName('material-shadow-bottom') + '"></div><div class="' + goog.getCssName('material-shadow-top') + '"></div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.Shadow.soyTemplateName = 'pstj.material.template.Shadow';
}


/**
 * @param {{
 *    content: (null|string|undefined)
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.ButtonContent = function(opt_data, opt_ignored) {
  opt_data = opt_data || {};
  goog.asserts.assert(opt_data.content == null || (opt_data.content instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.content), "expected param 'content' of type null|string|undefined.");
  var content = /** @type {null|string|undefined} */ (opt_data.content);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('core-element') + ' ' + goog.getCssName('relative') + '"><div class="' + goog.getCssName('material-button-label') + '">' + soy.$$escapeHtml(content) + '</div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.ButtonContent.soyTemplateName = 'pstj.material.template.ButtonContent';
}


/**
 * @param {{
 *    icon: string,
 *    content: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Button = function(opt_data, opt_ignored) {
  goog.asserts.assert(goog.isString(opt_data.icon) || (opt_data.icon instanceof goog.soy.data.SanitizedContent), "expected param 'icon' of type string|goog.soy.data.SanitizedContent.");
  var icon = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.icon);
  goog.asserts.assert(goog.isString(opt_data.content) || (opt_data.content instanceof goog.soy.data.SanitizedContent), "expected param 'content' of type string|goog.soy.data.SanitizedContent.");
  var content = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.content);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-button') + '">' + pstj.material.template.Shadow(null) + pstj.material.template.IconContainer({type: icon}) + pstj.material.template.ButtonContent(opt_data) + pstj.material.template.Ripple({recenter: false, opacity: 0.3}) + '</div>');
};
if (goog.DEBUG) {
  pstj.material.template.Button.soyTemplateName = 'pstj.material.template.Button';
}


/**
 * @param {{
 *    type: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.IconContainer = function(opt_data, opt_ignored) {
  goog.asserts.assert(goog.isString(opt_data.type) || (opt_data.type instanceof goog.soy.data.SanitizedContent), "expected param 'type' of type string|goog.soy.data.SanitizedContent.");
  var type = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.type);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-icon-container') + ' ' + goog.getCssName('material-icon-container-empty') + '" type="' + soy.$$escapeHtmlAttribute(type) + '"></div>');
};
if (goog.DEBUG) {
  pstj.material.template.IconContainer.soyTemplateName = 'pstj.material.template.IconContainer';
}


/**
 * @param {{
 *    icon: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Fab = function(opt_data, opt_ignored) {
  goog.asserts.assert(goog.isString(opt_data.icon) || (opt_data.icon instanceof goog.soy.data.SanitizedContent), "expected param 'icon' of type string|goog.soy.data.SanitizedContent.");
  var icon = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.icon);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-fab') + '">' + pstj.material.template.Shadow(null) + pstj.material.template.IconContainer({type: icon}) + pstj.material.template.Ripple({recenter: true}) + '</div>');
};
if (goog.DEBUG) {
  pstj.material.template.Fab.soyTemplateName = 'pstj.material.template.Fab';
}


/**
 * @param {{
 *    content: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Checkbox = function(opt_data, opt_ignored) {
  goog.asserts.assert(goog.isString(opt_data.content) || (opt_data.content instanceof goog.soy.data.SanitizedContent), "expected param 'content' of type string|goog.soy.data.SanitizedContent.");
  var content = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.content);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-checkbox') + '" role="checkbox"><div class="' + goog.getCssName('material-checkbox-container') + '"><div class="' + goog.getCssName('material-checkbox-icon') + '"></div>' + pstj.material.template.Ripple({circle: true, recenter: true}) + '</div><div class="' + goog.getCssName('material-checkbox-content') + '">' + ((content) ? soy.$$escapeHtml(content) : '') + '</div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.Checkbox.soyTemplateName = 'pstj.material.template.Checkbox';
}


/**
 * @param {{
 *    icon: string,
 *    content: (null|string|undefined)
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.MenuItem = function(opt_data, opt_ignored) {
  goog.asserts.assert(goog.isString(opt_data.icon) || (opt_data.icon instanceof goog.soy.data.SanitizedContent), "expected param 'icon' of type string|goog.soy.data.SanitizedContent.");
  var icon = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.icon);
  goog.asserts.assert(opt_data.content == null || (opt_data.content instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.content), "expected param 'content' of type null|string|undefined.");
  var content = /** @type {null|string|undefined} */ (opt_data.content);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-menu-item') + '">' + pstj.material.template.IconContainer({type: icon}) + '<div class="' + goog.getCssName('material-menu-item-content') + '">' + pstj.material.template.Item(opt_data) + '</div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.MenuItem.soyTemplateName = 'pstj.material.template.MenuItem';
}


/**
 * @param {{
 *    label: (null|string|undefined),
 *    error: (null|string|undefined),
 *    name: string,
 *    type: string,
 *    value: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.InputBase = function(opt_data, opt_ignored) {
  goog.asserts.assert(opt_data.label == null || (opt_data.label instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.label), "expected param 'label' of type null|string|undefined.");
  var label = /** @type {null|string|undefined} */ (opt_data.label);
  goog.asserts.assert(opt_data.error == null || (opt_data.error instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.error), "expected param 'error' of type null|string|undefined.");
  var error = /** @type {null|string|undefined} */ (opt_data.error);
  goog.asserts.assert(goog.isString(opt_data.name) || (opt_data.name instanceof goog.soy.data.SanitizedContent), "expected param 'name' of type string|goog.soy.data.SanitizedContent.");
  var name = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.name);
  goog.asserts.assert(goog.isString(opt_data.type) || (opt_data.type instanceof goog.soy.data.SanitizedContent), "expected param 'type' of type string|goog.soy.data.SanitizedContent.");
  var type = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.type);
  goog.asserts.assert(goog.isString(opt_data.value) || (opt_data.value instanceof goog.soy.data.SanitizedContent), "expected param 'value' of type string|goog.soy.data.SanitizedContent.");
  var value = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.value);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-base-input') + '"><label>' + ((label) ? soy.$$escapeHtml(label) : '') + '</label><input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value="' + soy.$$escapeHtmlAttribute(value) + '" type="' + soy.$$escapeHtmlAttribute(type) + '" name="' + soy.$$escapeHtmlAttribute(name) + '"><div class="' + goog.getCssName('material-base-input-error') + '">' + ((error) ? soy.$$escapeHtml(error) : '') + '</div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.InputBase.soyTemplateName = 'pstj.material.template.InputBase';
}


/**
 * @param {{
 *    label: (null|string|undefined),
 *    error: (null|string|undefined),
 *    name: string,
 *    type: string,
 *    value: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Input = function(opt_data, opt_ignored) {
  goog.asserts.assert(opt_data.label == null || (opt_data.label instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.label), "expected param 'label' of type null|string|undefined.");
  var label = /** @type {null|string|undefined} */ (opt_data.label);
  goog.asserts.assert(opt_data.error == null || (opt_data.error instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.error), "expected param 'error' of type null|string|undefined.");
  var error = /** @type {null|string|undefined} */ (opt_data.error);
  goog.asserts.assert(goog.isString(opt_data.name) || (opt_data.name instanceof goog.soy.data.SanitizedContent), "expected param 'name' of type string|goog.soy.data.SanitizedContent.");
  var name = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.name);
  goog.asserts.assert(goog.isString(opt_data.type) || (opt_data.type instanceof goog.soy.data.SanitizedContent), "expected param 'type' of type string|goog.soy.data.SanitizedContent.");
  var type = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.type);
  goog.asserts.assert(goog.isString(opt_data.value) || (opt_data.value instanceof goog.soy.data.SanitizedContent), "expected param 'value' of type string|goog.soy.data.SanitizedContent.");
  var value = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.value);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('material-input') + '"><label>' + soy.$$escapeHtml(label) + '</label><input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value="' + soy.$$escapeHtmlAttribute(value) + '" type="' + soy.$$escapeHtmlAttribute(type) + '" name="' + soy.$$escapeHtmlAttribute(name) + '"><div class="' + goog.getCssName('material-input-error') + '">' + soy.$$escapeHtml(error) + '</div></div>');
};
if (goog.DEBUG) {
  pstj.material.template.Input.soyTemplateName = 'pstj.material.template.Input';
}
