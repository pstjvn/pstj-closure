// This file was automatically generated from material.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace pstj.material.template.
 * @public
 */

goog.provide('pstj.material.template');

goog.require('goog.soy.data.SanitizedContent');
goog.require('soy');
goog.require('soy.asserts');
goog.require('soydata.VERY_UNSAFE');


/**
 * @param {pstj.material.template.CoreElement.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.CoreElement = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  opt_data = opt_data || {};
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var content = soy.asserts.assertType(opt_data.content == null || (goog.isString(opt_data.content) || opt_data.content instanceof goog.soy.data.SanitizedContent), 'content', opt_data.content, '!goog.soy.data.SanitizedContent|null|string|undefined');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.CoreElement, templates/material.soy, 5)-->' : '') + '<div is class="' + goog.getCssName('core-element') + '">' + (content ? soy.$$escapeHtml(content) : '') + '</div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.CoreElement)-->' : ''));
};
/**
 * @typedef {{
 *  content: (!goog.soy.data.SanitizedContent|null|string|undefined),
 * }}
 */
pstj.material.template.CoreElement.Params;
if (goog.DEBUG) {
  pstj.material.template.CoreElement.soyTemplateName = 'pstj.material.template.CoreElement';
}


/**
 * @param {pstj.material.template.Item.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Item = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  opt_data = opt_data || {};
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var content = soy.asserts.assertType(opt_data.content == null || (goog.isString(opt_data.content) || opt_data.content instanceof goog.soy.data.SanitizedContent), 'content', opt_data.content, '!goog.soy.data.SanitizedContent|null|string|undefined');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.Item, templates/material.soy, 12)-->' : '') + '<div is class="' + goog.getCssName('core-item') + '">' + (content ? soy.$$escapeHtml(content) : '') + '</div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.Item)-->' : ''));
};
/**
 * @typedef {{
 *  content: (!goog.soy.data.SanitizedContent|null|string|undefined),
 * }}
 */
pstj.material.template.Item.Params;
if (goog.DEBUG) {
  pstj.material.template.Item.soyTemplateName = 'pstj.material.template.Item';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Panel = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.Panel, templates/material.soy, 22)-->' : '') + '<div is class="' + goog.getCssName('material-panel') + '">' + pstj.material.template.Shadow(null, null, opt_ijData) + '<div class="' + goog.getCssName('material-panel-content-holder') + '"></div><div is class="' + goog.getCssName('core-element') + ' ' + goog.getCssName('material-panel-overlay') + '"></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.Panel)-->' : ''));
};
if (goog.DEBUG) {
  pstj.material.template.Panel.soyTemplateName = 'pstj.material.template.Panel';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.DrawerPanel = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.DrawerPanel, templates/material.soy, 39)-->' : '') + '<div is class="' + goog.getCssName('material-drawer-panel') + '" use-pointer>' + pstj.material.template.Panel(null, null, opt_ijData) + '<div class="' + goog.getCssName('material-drawer-panel-sidebar') + '">' + pstj.material.template.Panel(null, null, opt_ijData) + '</div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.DrawerPanel)-->' : ''));
};
if (goog.DEBUG) {
  pstj.material.template.DrawerPanel.soyTemplateName = 'pstj.material.template.DrawerPanel';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.HeaderPanelMain = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.HeaderPanelMain, templates/material.soy, 50)-->' : '') + '<div is class="' + goog.getCssName('material-header-panel-main') + '" use-scroll><div class="' + goog.getCssName('material-header-panel-main-container') + '"><div class="' + goog.getCssName('material-header-panel-main-content') + '"></div></div><div class="' + goog.getCssName('material-drop-shadow') + '"></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.HeaderPanelMain)-->' : ''));
};
if (goog.DEBUG) {
  pstj.material.template.HeaderPanelMain.soyTemplateName = 'pstj.material.template.HeaderPanelMain';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.HeaderPanelHeader = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.HeaderPanelHeader, templates/material.soy, 61)-->' : '') + '<div is class="' + goog.getCssName('material-header-panel-header') + '"></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.HeaderPanelHeader)-->' : ''));
};
if (goog.DEBUG) {
  pstj.material.template.HeaderPanelHeader.soyTemplateName = 'pstj.material.template.HeaderPanelHeader';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.HeaderPanel = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.HeaderPanel, templates/material.soy, 71)-->' : '') + '<div is class="' + goog.getCssName('material-header-panel') + '"><div class="' + goog.getCssName('material-header-panel-outer-container') + '">' + pstj.material.template.HeaderPanelHeader(null, null, opt_ijData) + pstj.material.template.HeaderPanelMain(null, null, opt_ijData) + '</div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.HeaderPanel)-->' : ''));
};
if (goog.DEBUG) {
  pstj.material.template.HeaderPanel.soyTemplateName = 'pstj.material.template.HeaderPanel';
}


/**
 * @param {pstj.material.template.Ripple.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Ripple = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  opt_data = opt_data || {};
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var content = soy.asserts.assertType(opt_data.content == null || (goog.isString(opt_data.content) || opt_data.content instanceof goog.soy.data.SanitizedContent), 'content', opt_data.content, '!goog.soy.data.SanitizedContent|null|string|undefined');
  /** @type {boolean|null|undefined} */
  var circle = soy.asserts.assertType(opt_data.circle == null || (goog.isBoolean(opt_data.circle) || opt_data.circle === 1 || opt_data.circle === 0), 'circle', opt_data.circle, 'boolean|null|undefined');
  /** @type {boolean|null|undefined} */
  var recenter = soy.asserts.assertType(opt_data.recenter == null || (goog.isBoolean(opt_data.recenter) || opt_data.recenter === 1 || opt_data.recenter === 0), 'recenter', opt_data.recenter, 'boolean|null|undefined');
  /** @type {null|number|undefined} */
  var opacity = soy.asserts.assertType(opt_data.opacity == null || goog.isNumber(opt_data.opacity), 'opacity', opt_data.opacity, 'null|number|undefined');
  /** @type {boolean|null|undefined} */
  var usepointer = soy.asserts.assertType(opt_data.usepointer == null || (goog.isBoolean(opt_data.usepointer) || opt_data.usepointer === 1 || opt_data.usepointer === 0), 'usepointer', opt_data.usepointer, 'boolean|null|undefined');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.Ripple, templates/material.soy, 83)-->' : '') + '<div is class="' + goog.getCssName('ripple') + (circle ? ' ' + goog.getCssName('ripple-circle') : '') + '"' + (recenter ? ' recenter' : '') + (opacity ? ' opacity="' + soy.$$escapeHtmlAttribute(opacity) + '"' : '') + (usepointer ? ' use-pointer' : '') + '><div class="' + goog.getCssName('ripple-bg') + '"></div><div class="' + goog.getCssName('ripple-waves') + '"></div><div class="' + goog.getCssName('ripple-content') + '">' + (content ? soy.$$escapeHtml(content) : '') + '</div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.Ripple)-->' : ''));
};
/**
 * @typedef {{
 *  content: (!goog.soy.data.SanitizedContent|null|string|undefined),
 *  circle: (boolean|null|undefined),
 *  recenter: (boolean|null|undefined),
 *  opacity: (null|number|undefined),
 *  usepointer: (boolean|null|undefined),
 * }}
 */
pstj.material.template.Ripple.Params;
if (goog.DEBUG) {
  pstj.material.template.Ripple.soyTemplateName = 'pstj.material.template.Ripple';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.FloatingLabel = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.FloatingLabel, templates/material.soy, 101)-->' : '') + '<div class="' + goog.getCssName('floating-label') + '"><span class="' + goog.getCssName('floating-label-text') + '">' + soy.$$escapeHtml(opt_data.label) + '</span></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.FloatingLabel)-->' : ''));
};
if (goog.DEBUG) {
  pstj.material.template.FloatingLabel.soyTemplateName = 'pstj.material.template.FloatingLabel';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.InputUnderline = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.InputUnderline, templates/material.soy, 111)-->' : '') + '<div class="' + goog.getCssName('material-input-underline') + '"><div class="' + goog.getCssName('material-input-underline-unfocused') + '"></div><div class="' + goog.getCssName('material-input-underline-focused') + '"></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.InputUnderline)-->' : ''));
};
if (goog.DEBUG) {
  pstj.material.template.InputUnderline.soyTemplateName = 'pstj.material.template.InputUnderline';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.InputError = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.InputError, templates/material.soy, 123)-->' : '') + '<div class="' + goog.getCssName('material-input-error') + '"><div class="' + goog.getCssName('material-input-error-text') + '" role="alert">' + soy.$$escapeHtml(opt_data.error) + '</div><div is class="' + goog.getCssName('material-icon') + ' ' + goog.getCssName('material-input-error-icon') + '" icon="warning" size="20"></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.InputError)-->' : ''));
};
if (goog.DEBUG) {
  pstj.material.template.InputError.soyTemplateName = 'pstj.material.template.InputError';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.InputElement = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.InputElement, templates/material.soy, 138)-->' : '') + '<div is class="' + goog.getCssName('material-input-body') + '"><div class="' + goog.getCssName('material-input-body-label') + '"><span class="' + goog.getCssName('material-input-body-label-text') + '">' + soy.$$escapeHtml(opt_data.label) + '</span></div><div is class="' + goog.getCssName('core-element') + ' ' + goog.getCssName('material-input-body-cursor') + '"></div><div class="' + goog.getCssName('material-input-body-container') + '"><input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" type="' + soy.$$escapeHtmlAttribute(opt_data.type) + '" value="' + soy.$$escapeHtmlAttribute(opt_data.value) + '" name="' + soy.$$escapeHtmlAttribute(opt_data.name) + '"></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.InputElement)-->' : ''));
};
if (goog.DEBUG) {
  pstj.material.template.InputElement.soyTemplateName = 'pstj.material.template.InputElement';
}


/**
 * @param {pstj.material.template.RadioButton.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.RadioButton = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  opt_data = opt_data || {};
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var content = soy.asserts.assertType(opt_data.content == null || (goog.isString(opt_data.content) || opt_data.content instanceof goog.soy.data.SanitizedContent), 'content', opt_data.content, '!goog.soy.data.SanitizedContent|null|string|undefined');
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var name = soy.asserts.assertType(opt_data.name == null || (goog.isString(opt_data.name) || opt_data.name instanceof goog.soy.data.SanitizedContent), 'name', opt_data.name, '!goog.soy.data.SanitizedContent|null|string|undefined');
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var value = soy.asserts.assertType(opt_data.value == null || (goog.isString(opt_data.value) || opt_data.value instanceof goog.soy.data.SanitizedContent), 'value', opt_data.value, '!goog.soy.data.SanitizedContent|null|string|undefined');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.RadioButton, templates/material.soy, 167)-->' : '') + '<div is class="' + goog.getCssName('material-radio-button') + '" use-pointer role="radio" tabindex="0" name="' + soy.$$escapeHtmlAttribute(name) + '" value="' + soy.$$escapeHtmlAttribute(value) + '"><div class="' + goog.getCssName('material-radio-button-container') + '"><div class="' + goog.getCssName('material-radio-button-off') + '"></div><div class="' + goog.getCssName('material-radio-button-on') + '"></div>' + pstj.material.template.Ripple({circle: true, recenter: true, usepointer: false}, null, opt_ijData) + '</div><div class="' + goog.getCssName('material-radio-button-content') + '" aria-hidden="true">' + (content ? soy.$$escapeHtml(content) : '') + '</div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.RadioButton)-->' : ''));
};
/**
 * @typedef {{
 *  content: (!goog.soy.data.SanitizedContent|null|string|undefined),
 *  name: (!goog.soy.data.SanitizedContent|null|string|undefined),
 *  value: (!goog.soy.data.SanitizedContent|null|string|undefined),
 * }}
 */
pstj.material.template.RadioButton.Params;
if (goog.DEBUG) {
  pstj.material.template.RadioButton.soyTemplateName = 'pstj.material.template.RadioButton';
}


/**
 * @param {pstj.material.template.ToggleButton.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.ToggleButton = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  opt_data = opt_data || {};
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var content = soy.asserts.assertType(opt_data.content == null || (goog.isString(opt_data.content) || opt_data.content instanceof goog.soy.data.SanitizedContent), 'content', opt_data.content, '!goog.soy.data.SanitizedContent|null|string|undefined');
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var name = soy.asserts.assertType(opt_data.name == null || (goog.isString(opt_data.name) || opt_data.name instanceof goog.soy.data.SanitizedContent), 'name', opt_data.name, '!goog.soy.data.SanitizedContent|null|string|undefined');
  /** @type {boolean|null|undefined} */
  var disabled = soy.asserts.assertType(opt_data.disabled == null || (goog.isBoolean(opt_data.disabled) || opt_data.disabled === 1 || opt_data.disabled === 0), 'disabled', opt_data.disabled, 'boolean|null|undefined');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.ToggleButton, templates/material.soy, 188)-->' : '') + '<div is class="' + goog.getCssName('material-toggle-button') + (disabled ? ' ' + goog.getCssName('material-toggle-button-disabled') : '') + '" role="button" name="' + soy.$$escapeHtmlAttribute(name) + '" use-pointer><div class="' + goog.getCssName('material-toggle-button-container') + '"><div class="' + goog.getCssName('material-toggle-button-bar') + '"></div>' + pstj.material.template.RadioButton({label: ''}, null, opt_ijData) + '</div><div class="' + goog.getCssName('material-toggle-button-content') + '">' + (content ? soy.$$escapeHtml(content) : '') + '</div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.ToggleButton)-->' : ''));
};
/**
 * @typedef {{
 *  content: (!goog.soy.data.SanitizedContent|null|string|undefined),
 *  name: (!goog.soy.data.SanitizedContent|null|string|undefined),
 *  disabled: (boolean|null|undefined),
 * }}
 */
pstj.material.template.ToggleButton.Params;
if (goog.DEBUG) {
  pstj.material.template.ToggleButton.soyTemplateName = 'pstj.material.template.ToggleButton';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.RadioGroup = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.RadioGroup, templates/material.soy, 209)-->' : '') + '<div is class="' + goog.getCssName('material-radio-group') + '"></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.RadioGroup)-->' : ''));
};
if (goog.DEBUG) {
  pstj.material.template.RadioGroup.soyTemplateName = 'pstj.material.template.RadioGroup';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Progressbar = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.Progressbar, templates/material.soy, 215)-->' : '') + '<div class="' + goog.getCssName('material-progress-bar') + '"><div class="' + goog.getCssName('material-progress-bar-inner') + '"></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.Progressbar)-->' : ''));
};
if (goog.DEBUG) {
  pstj.material.template.Progressbar.soyTemplateName = 'pstj.material.template.Progressbar';
}


/**
 * @param {pstj.material.template.Shadow.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Shadow = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  opt_data = opt_data || {};
  /** @type {null|number|undefined} */
  var depth = soy.asserts.assertType(opt_data.depth == null || goog.isNumber(opt_data.depth), 'depth', opt_data.depth, 'null|number|undefined');
  var $tmp = null;
  if (depth == 1) {
    $tmp = goog.getCssName('material-shadow-1');
  } else if (depth == 2) {
    $tmp = goog.getCssName('material-shadow-2');
  } else if (depth == 3) {
    $tmp = goog.getCssName('material-shadow-3');
  } else if (depth == 4) {
    $tmp = goog.getCssName('material-shadow-4');
  } else if (depth == 5) {
    $tmp = goog.getCssName('material-shadow-5');
  } else {
    $tmp = goog.getCssName('material-shadow-0');
  }
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.Shadow, templates/material.soy, 223)-->' : '') + '<div is class="' + goog.getCssName('material-shadow') + ' ' + $tmp + '"><div class="' + goog.getCssName('material-shadow-bottom') + '"></div><div class="' + goog.getCssName('material-shadow-top') + '"></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.Shadow)-->' : ''));
};
/**
 * @typedef {{
 *  depth: (null|number|undefined),
 * }}
 */
pstj.material.template.Shadow.Params;
if (goog.DEBUG) {
  pstj.material.template.Shadow.soyTemplateName = 'pstj.material.template.Shadow';
}


/**
 * @param {pstj.material.template.ButtonContent.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.ButtonContent = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  opt_data = opt_data || {};
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var content = soy.asserts.assertType(opt_data.content == null || (goog.isString(opt_data.content) || opt_data.content instanceof goog.soy.data.SanitizedContent), 'content', opt_data.content, '!goog.soy.data.SanitizedContent|null|string|undefined');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.ButtonContent, templates/material.soy, 246)-->' : '') + '<div is class="' + goog.getCssName('core-element') + ' ' + goog.getCssName('relative') + '"><div class="' + goog.getCssName('material-button-label') + '">' + (content ? soy.$$escapeHtml(content) : '') + '</div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.ButtonContent)-->' : ''));
};
/**
 * @typedef {{
 *  content: (!goog.soy.data.SanitizedContent|null|string|undefined),
 * }}
 */
pstj.material.template.ButtonContent.Params;
if (goog.DEBUG) {
  pstj.material.template.ButtonContent.soyTemplateName = 'pstj.material.template.ButtonContent';
}


/**
 * @param {pstj.material.template.Button.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Button = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var icon = soy.asserts.assertType(goog.isString(opt_data.icon) || opt_data.icon instanceof goog.soy.data.SanitizedContent, 'icon', opt_data.icon, '!goog.soy.data.SanitizedContent|string');
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var content = soy.asserts.assertType(goog.isString(opt_data.content) || opt_data.content instanceof goog.soy.data.SanitizedContent, 'content', opt_data.content, '!goog.soy.data.SanitizedContent|string');
  /** @type {boolean|null|undefined} */
  var ink = soy.asserts.assertType(opt_data.ink == null || (goog.isBoolean(opt_data.ink) || opt_data.ink === 1 || opt_data.ink === 0), 'ink', opt_data.ink, 'boolean|null|undefined');
  /** @type {boolean|null|undefined} */
  var recenter = soy.asserts.assertType(opt_data.recenter == null || (goog.isBoolean(opt_data.recenter) || opt_data.recenter === 1 || opt_data.recenter === 0), 'recenter', opt_data.recenter, 'boolean|null|undefined');
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var action = soy.asserts.assertType(opt_data.action == null || (goog.isString(opt_data.action) || opt_data.action instanceof goog.soy.data.SanitizedContent), 'action', opt_data.action, '!goog.soy.data.SanitizedContent|null|string|undefined');
  /** @type {boolean|null|undefined} */
  var tactile = soy.asserts.assertType(opt_data.tactile == null || (goog.isBoolean(opt_data.tactile) || opt_data.tactile === 1 || opt_data.tactile === 0), 'tactile', opt_data.tactile, 'boolean|null|undefined');
  /** @type {boolean|null|undefined} */
  var disabled = soy.asserts.assertType(opt_data.disabled == null || (goog.isBoolean(opt_data.disabled) || opt_data.disabled === 1 || opt_data.disabled === 0), 'disabled', opt_data.disabled, 'boolean|null|undefined');
  /** @type {boolean|null|undefined} */
  var raised = soy.asserts.assertType(opt_data.raised == null || (goog.isBoolean(opt_data.raised) || opt_data.raised === 1 || opt_data.raised === 0), 'raised', opt_data.raised, 'boolean|null|undefined');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.Button, templates/material.soy, 258)-->' : '') + '<div is class="' + goog.getCssName('material-button') + (tactile ? ' ' + goog.getCssName('material-button-tactile') : '') + (disabled ? ' ' + goog.getCssName('material-button-disabled') : '') + (raised ? ' ' + goog.getCssName('material-button-raised') : '') + '"' + (ink ? ' ink' : '') + ' use-pointer icon="' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(icon)) + '"' + (action ? ' action="' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(action)) + '"' : '') + '>' + pstj.material.template.Shadow(null, null, opt_ijData) + pstj.material.template.IconContainer({type: icon}, null, opt_ijData) + pstj.material.template.ButtonContent(opt_data, null, opt_ijData) + pstj.material.template.Ripple({recenter: recenter, opacity: 0.3}, null, opt_ijData) + '</div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.Button)-->' : ''));
};
/**
 * @typedef {{
 *  icon: (!goog.soy.data.SanitizedContent|string),
 *  content: (!goog.soy.data.SanitizedContent|string),
 *  ink: (boolean|null|undefined),
 *  recenter: (boolean|null|undefined),
 *  action: (!goog.soy.data.SanitizedContent|null|string|undefined),
 *  tactile: (boolean|null|undefined),
 *  disabled: (boolean|null|undefined),
 *  raised: (boolean|null|undefined),
 * }}
 */
pstj.material.template.Button.Params;
if (goog.DEBUG) {
  pstj.material.template.Button.soyTemplateName = 'pstj.material.template.Button';
}


/**
 * @param {pstj.material.template.IconButton.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.IconButton = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var icon = soy.asserts.assertType(goog.isString(opt_data.icon) || opt_data.icon instanceof goog.soy.data.SanitizedContent, 'icon', opt_data.icon, '!goog.soy.data.SanitizedContent|string');
  /** @type {boolean|null|undefined} */
  var tactile = soy.asserts.assertType(opt_data.tactile == null || (goog.isBoolean(opt_data.tactile) || opt_data.tactile === 1 || opt_data.tactile === 0), 'tactile', opt_data.tactile, 'boolean|null|undefined');
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var action = soy.asserts.assertType(opt_data.action == null || (goog.isString(opt_data.action) || opt_data.action instanceof goog.soy.data.SanitizedContent), 'action', opt_data.action, '!goog.soy.data.SanitizedContent|null|string|undefined');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.IconButton, templates/material.soy, 286)-->' : '') + '<div is class="' + goog.getCssName('material-icon-button') + (tactile ? ' ' + goog.getCssName('material-button-tactile') : '') + '" use-pointer icon="' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(icon)) + '"' + (action ? ' action="' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(action)) + '"' : '') + '>' + pstj.material.template.IconContainer({type: icon}, null, opt_ijData) + '</div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.IconButton)-->' : ''));
};
/**
 * @typedef {{
 *  icon: (!goog.soy.data.SanitizedContent|string),
 *  tactile: (boolean|null|undefined),
 *  action: (!goog.soy.data.SanitizedContent|null|string|undefined),
 * }}
 */
pstj.material.template.IconButton.Params;
if (goog.DEBUG) {
  pstj.material.template.IconButton.soyTemplateName = 'pstj.material.template.IconButton';
}


/**
 * @param {pstj.material.template.IconContainer.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.IconContainer = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var type = soy.asserts.assertType(goog.isString(opt_data.type) || opt_data.type instanceof goog.soy.data.SanitizedContent, 'type', opt_data.type, '!goog.soy.data.SanitizedContent|string');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.IconContainer, templates/material.soy, 300)-->' : '') + '<div is class="' + goog.getCssName('material-icon-container') + ' ' + goog.getCssName('material-icon-container-empty') + '" type="' + soy.$$escapeHtmlAttribute(type) + '"></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.IconContainer)-->' : ''));
};
/**
 * @typedef {{
 *  type: (!goog.soy.data.SanitizedContent|string),
 * }}
 */
pstj.material.template.IconContainer.Params;
if (goog.DEBUG) {
  pstj.material.template.IconContainer.soyTemplateName = 'pstj.material.template.IconContainer';
}


/**
 * @param {pstj.material.template.Fab.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Fab = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var icon = soy.asserts.assertType(goog.isString(opt_data.icon) || opt_data.icon instanceof goog.soy.data.SanitizedContent, 'icon', opt_data.icon, '!goog.soy.data.SanitizedContent|string');
  /** @type {boolean|null|undefined} */
  var tactile = soy.asserts.assertType(opt_data.tactile == null || (goog.isBoolean(opt_data.tactile) || opt_data.tactile === 1 || opt_data.tactile === 0), 'tactile', opt_data.tactile, 'boolean|null|undefined');
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var action = soy.asserts.assertType(opt_data.action == null || (goog.isString(opt_data.action) || opt_data.action instanceof goog.soy.data.SanitizedContent), 'action', opt_data.action, '!goog.soy.data.SanitizedContent|null|string|undefined');
  /** @type {boolean|null|undefined} */
  var raised = soy.asserts.assertType(opt_data.raised == null || (goog.isBoolean(opt_data.raised) || opt_data.raised === 1 || opt_data.raised === 0), 'raised', opt_data.raised, 'boolean|null|undefined');
  /** @type {boolean|null|undefined} */
  var transition = soy.asserts.assertType(opt_data.transition == null || (goog.isBoolean(opt_data.transition) || opt_data.transition === 1 || opt_data.transition === 0), 'transition', opt_data.transition, 'boolean|null|undefined');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.Fab, templates/material.soy, 307)-->' : '') + '<div is class="' + goog.getCssName('material-fab') + (tactile ? ' ' + goog.getCssName('material-button-tactile') : '') + (raised ? ' ' + goog.getCssName('material-fab-raised') : '') + (transition ? ' ' + goog.getCssName('material-raf-transition') : '') + '" icon="' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(icon)) + '" use-pointer ink' + (action ? ' action="' + soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(action)) + '"' : '') + '>' + pstj.material.template.Shadow(null, null, opt_ijData) + pstj.material.template.IconContainer({type: icon}, null, opt_ijData) + pstj.material.template.Ripple({recenter: true}, null, opt_ijData) + '</div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.Fab)-->' : ''));
};
/**
 * @typedef {{
 *  icon: (!goog.soy.data.SanitizedContent|string),
 *  tactile: (boolean|null|undefined),
 *  action: (!goog.soy.data.SanitizedContent|null|string|undefined),
 *  raised: (boolean|null|undefined),
 *  transition: (boolean|null|undefined),
 * }}
 */
pstj.material.template.Fab.Params;
if (goog.DEBUG) {
  pstj.material.template.Fab.soyTemplateName = 'pstj.material.template.Fab';
}


/**
 * @param {pstj.material.template.Checkbox.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Checkbox = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var content = soy.asserts.assertType(goog.isString(opt_data.content) || opt_data.content instanceof goog.soy.data.SanitizedContent, 'content', opt_data.content, '!goog.soy.data.SanitizedContent|string');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.Checkbox, templates/material.soy, 329)-->' : '') + '<div is class="' + goog.getCssName('material-checkbox') + '" role="checkbox" use-pointer><div class="' + goog.getCssName('material-checkbox-container') + '"><div class="' + goog.getCssName('material-checkbox-icon') + '"></div>' + pstj.material.template.Ripple({circle: true, recenter: true}, null, opt_ijData) + '</div><div class="' + goog.getCssName('material-checkbox-content') + '">' + (content ? soy.$$escapeHtml(content) : '') + '</div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.Checkbox)-->' : ''));
};
/**
 * @typedef {{
 *  content: (!goog.soy.data.SanitizedContent|string),
 * }}
 */
pstj.material.template.Checkbox.Params;
if (goog.DEBUG) {
  pstj.material.template.Checkbox.soyTemplateName = 'pstj.material.template.Checkbox';
}


/**
 * @param {pstj.material.template.MenuItem.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.MenuItem = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var icon = soy.asserts.assertType(goog.isString(opt_data.icon) || opt_data.icon instanceof goog.soy.data.SanitizedContent, 'icon', opt_data.icon, '!goog.soy.data.SanitizedContent|string');
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var content = soy.asserts.assertType(opt_data.content == null || (goog.isString(opt_data.content) || opt_data.content instanceof goog.soy.data.SanitizedContent), 'content', opt_data.content, '!goog.soy.data.SanitizedContent|null|string|undefined');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.MenuItem, templates/material.soy, 345)-->' : '') + '<div is class="' + goog.getCssName('material-menu-item') + ' ' + goog.getCssName('core-tap') + '" use-pointer>' + pstj.material.template.IconContainer({type: icon}, null, opt_ijData) + '<div class="' + goog.getCssName('material-menu-item-content') + '">' + pstj.material.template.Item(opt_data, null, opt_ijData) + '</div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.MenuItem)-->' : ''));
};
/**
 * @typedef {{
 *  icon: (!goog.soy.data.SanitizedContent|string),
 *  content: (!goog.soy.data.SanitizedContent|null|string|undefined),
 * }}
 */
pstj.material.template.MenuItem.Params;
if (goog.DEBUG) {
  pstj.material.template.MenuItem.soyTemplateName = 'pstj.material.template.MenuItem';
}


/**
 * @param {pstj.material.template.InputBase.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.InputBase = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var label = soy.asserts.assertType(opt_data.label == null || (goog.isString(opt_data.label) || opt_data.label instanceof goog.soy.data.SanitizedContent), 'label', opt_data.label, '!goog.soy.data.SanitizedContent|null|string|undefined');
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var error = soy.asserts.assertType(opt_data.error == null || (goog.isString(opt_data.error) || opt_data.error instanceof goog.soy.data.SanitizedContent), 'error', opt_data.error, '!goog.soy.data.SanitizedContent|null|string|undefined');
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var name = soy.asserts.assertType(goog.isString(opt_data.name) || opt_data.name instanceof goog.soy.data.SanitizedContent, 'name', opt_data.name, '!goog.soy.data.SanitizedContent|string');
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var type = soy.asserts.assertType(goog.isString(opt_data.type) || opt_data.type instanceof goog.soy.data.SanitizedContent, 'type', opt_data.type, '!goog.soy.data.SanitizedContent|string');
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var value = soy.asserts.assertType(goog.isString(opt_data.value) || opt_data.value instanceof goog.soy.data.SanitizedContent, 'value', opt_data.value, '!goog.soy.data.SanitizedContent|string');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.InputBase, templates/material.soy, 361)-->' : '') + '<div is class="' + goog.getCssName('material-base-input') + '"><label>' + (label ? soy.$$escapeHtml(label) : '') + '</label><input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value="' + soy.$$escapeHtmlAttribute(value) + '" type="' + soy.$$escapeHtmlAttribute(type) + '" name="' + soy.$$escapeHtmlAttribute(name) + '"><div class="' + goog.getCssName('material-base-input-error') + '">' + (error ? soy.$$escapeHtml(error) : '') + '</div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.InputBase)-->' : ''));
};
/**
 * @typedef {{
 *  label: (!goog.soy.data.SanitizedContent|null|string|undefined),
 *  error: (!goog.soy.data.SanitizedContent|null|string|undefined),
 *  name: (!goog.soy.data.SanitizedContent|string),
 *  type: (!goog.soy.data.SanitizedContent|string),
 *  value: (!goog.soy.data.SanitizedContent|string),
 * }}
 */
pstj.material.template.InputBase.Params;
if (goog.DEBUG) {
  pstj.material.template.InputBase.soyTemplateName = 'pstj.material.template.InputBase';
}


/**
 * @param {pstj.material.template.Input.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Input = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var label = soy.asserts.assertType(opt_data.label == null || (goog.isString(opt_data.label) || opt_data.label instanceof goog.soy.data.SanitizedContent), 'label', opt_data.label, '!goog.soy.data.SanitizedContent|null|string|undefined');
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var error = soy.asserts.assertType(opt_data.error == null || (goog.isString(opt_data.error) || opt_data.error instanceof goog.soy.data.SanitizedContent), 'error', opt_data.error, '!goog.soy.data.SanitizedContent|null|string|undefined');
  /** @type {boolean|null|undefined} */
  var required = soy.asserts.assertType(opt_data.required == null || (goog.isBoolean(opt_data.required) || opt_data.required === 1 || opt_data.required === 0), 'required', opt_data.required, 'boolean|null|undefined');
  /** @type {!goog.soy.data.SanitizedContent|null|string|undefined} */
  var pattern = soy.asserts.assertType(opt_data.pattern == null || (goog.isString(opt_data.pattern) || opt_data.pattern instanceof goog.soy.data.SanitizedContent), 'pattern', opt_data.pattern, '!goog.soy.data.SanitizedContent|null|string|undefined');
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var name = soy.asserts.assertType(goog.isString(opt_data.name) || opt_data.name instanceof goog.soy.data.SanitizedContent, 'name', opt_data.name, '!goog.soy.data.SanitizedContent|string');
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var type = soy.asserts.assertType(goog.isString(opt_data.type) || opt_data.type instanceof goog.soy.data.SanitizedContent, 'type', opt_data.type, '!goog.soy.data.SanitizedContent|string');
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var value = soy.asserts.assertType(goog.isString(opt_data.value) || opt_data.value instanceof goog.soy.data.SanitizedContent, 'value', opt_data.value, '!goog.soy.data.SanitizedContent|string');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.Input, templates/material.soy, 387)-->' : '') + '<div is class="' + goog.getCssName('material-input') + '" use-pointer' + (required ? ' required' : '') + (pattern ? ' pattern="' + soy.$$escapeHtmlAttribute(pattern) + '"' : '') + '><div class="' + goog.getCssName('material-input-floated-label') + '" aria-hidden="true"><!-- needed for floating label animation measurement --><span class="' + goog.getCssName('material-input-floated-label-text') + '">' + soy.$$escapeHtml(label) + '</span></div><div class="' + goog.getCssName('material-input-body') + '"><div class="' + goog.getCssName('material-input-body-label') + '"><!-- needed for floating label animation measurement --><span class="' + goog.getCssName('material-input-body-label-text') + '">' + soy.$$escapeHtml(label) + '</span></div><input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value="' + soy.$$escapeHtmlAttribute(value) + '" type="' + soy.$$escapeHtmlAttribute(type) + '" name="' + soy.$$escapeHtmlAttribute(name) + '"/></div><div class="' + goog.getCssName('material-input-underline') + '"><div class="' + goog.getCssName('material-input-not-focused-underline') + '"></div><div class="' + goog.getCssName('material-input-focused-underline') + '"></div></div><div class="' + goog.getCssName('material-input-footer') + '"><div class="' + goog.getCssName('material-input-footer-error') + '"><div class="' + goog.getCssName('material-input-footer-error-text') + '" role="alert">' + soy.$$escapeHtml(error) + '</div>' + pstj.material.template.IconContainer({type: 'warning'}, null, opt_ijData) + '</div></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.Input)-->' : ''));
};
/**
 * @typedef {{
 *  label: (!goog.soy.data.SanitizedContent|null|string|undefined),
 *  error: (!goog.soy.data.SanitizedContent|null|string|undefined),
 *  required: (boolean|null|undefined),
 *  pattern: (!goog.soy.data.SanitizedContent|null|string|undefined),
 *  name: (!goog.soy.data.SanitizedContent|string),
 *  type: (!goog.soy.data.SanitizedContent|string),
 *  value: (!goog.soy.data.SanitizedContent|string),
 * }}
 */
pstj.material.template.Input.Params;
if (goog.DEBUG) {
  pstj.material.template.Input.soyTemplateName = 'pstj.material.template.Input';
}


/**
 * @param {pstj.material.template.Toast.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.Toast = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var text = soy.asserts.assertType(goog.isString(opt_data.text) || opt_data.text instanceof goog.soy.data.SanitizedContent, 'text', opt_data.text, '!goog.soy.data.SanitizedContent|string');
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var label = soy.asserts.assertType(goog.isString(opt_data.label) || opt_data.label instanceof goog.soy.data.SanitizedContent, 'label', opt_data.label, '!goog.soy.data.SanitizedContent|string');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.Toast, templates/material.soy, 427)-->' : '') + '<div is class="' + goog.getCssName('material-toast') + '" use-pointer><div class="' + goog.getCssName('material-toast-container') + '"><div class="' + goog.getCssName('material-toast-text') + '">' + soy.$$escapeHtml(text) + '</div>' + pstj.material.template.Button({icon: 'none', content: label}, null, opt_ijData) + '</div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.Toast)-->' : ''));
};
/**
 * @typedef {{
 *  text: (!goog.soy.data.SanitizedContent|string),
 *  label: (!goog.soy.data.SanitizedContent|string),
 * }}
 */
pstj.material.template.Toast.Params;
if (goog.DEBUG) {
  pstj.material.template.Toast.soyTemplateName = 'pstj.material.template.Toast';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.material.template.List = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml((goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.material.template.List, templates/material.soy, 442)-->' : '') + '<div is class="' + goog.getCssName('material-list') + '"><div class="' + goog.getCssName('material-list-scroll-target') + '"></div></div>' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.material.template.List)-->' : ''));
};
if (goog.DEBUG) {
  pstj.material.template.List.soyTemplateName = 'pstj.material.template.List';
}
