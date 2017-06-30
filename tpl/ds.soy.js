// This file was automatically generated from ds.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace pstj.ds.template.
 * @public
 */

goog.provide('pstj.ds.template');

goog.require('goog.soy.data.SanitizedContent');
goog.require('soy');
goog.require('soy.asserts');
goog.require('soydata');
goog.require('soydata.VERY_UNSAFE');


/**
 * @param {pstj.ds.template.IconRenderer.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.ds.template.IconRenderer = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var className = soy.asserts.assertType(goog.isString(opt_data.className) || opt_data.className instanceof goog.soy.data.SanitizedContent, 'className', opt_data.className, '!goog.soy.data.SanitizedContent|string');
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var iconName = soy.asserts.assertType(goog.isString(opt_data.iconName) || opt_data.iconName instanceof goog.soy.data.SanitizedContent, 'iconName', opt_data.iconName, '!goog.soy.data.SanitizedContent|string');
  /** @type {!Array<!goog.soy.data.SanitizedContent|string>} */
  var icons = soy.asserts.assertType(goog.isArray(opt_data.icons), 'icons', opt_data.icons, '!Array<!goog.soy.data.SanitizedContent|string>');
  var output = (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.ds.template.IconRenderer, templates/ds.soy, 5)-->' : '') + '\n// File auto-generated, please do not edit\ngoog.provide(\'pstj.autogen.iconrenderer.' + soy.$$escapeHtml(className) + '\');\n\ngoog.require(\'pstj.autogen.template.icons\');\ngoog.require(\'pstj.material.IconRenderer\');\ngoog.require(\'pstj.material.icons.registry\');\n\ngoog.scope(function() {\nvar IR = pstj.material.IconRenderer;\nvar registry = pstj.material.icons.registry;\n\n\n/** Renderer for \'' + soy.$$escapeHtml(iconName) + '\' icon */\npstj.autogen.iconrenderer.' + soy.$$escapeHtml(className) + ' = goog.defineClass(IR, {\n  constructor: function() {\n    IR.call(this);\n  },\n\n  /** @inheritDoc */\n  getTemplate: function(model) {\n    return pstj.autogen.template.icons.' + soy.$$escapeHtml(className) + '(model);\n  }\n});\ngoog.addSingletonGetter(icons.' + soy.$$escapeHtml(className) + ');\n\n\n// Register the renderer for icon name\n';
  var iconname18List = icons;
  var iconname18ListLen = iconname18List.length;
  for (var iconname18Index = 0; iconname18Index < iconname18ListLen; iconname18Index++) {
      var iconname18Data = iconname18List[iconname18Index];
      output += 'registry.setRenderer(\'' + soy.$$escapeHtml(iconname18Data) + '\', icons.' + soy.$$escapeHtml(className) + '.getInstance());\n';
    }
  output += '\n});  // goog.scope\n\n' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.ds.template.IconRenderer)-->' : '');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
/**
 * @typedef {{
 *  className: (!goog.soy.data.SanitizedContent|string),
 *  iconName: (!goog.soy.data.SanitizedContent|string),
 *  icons: !Array<!goog.soy.data.SanitizedContent|string>,
 * }}
 */
pstj.ds.template.IconRenderer.Params;
if (goog.DEBUG) {
  pstj.ds.template.IconRenderer.soyTemplateName = 'pstj.ds.template.IconRenderer';
}


/**
 * @param {pstj.ds.template.IconTemplate.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.UnsanitizedText}
 * @suppress {checkTypes}
 */
pstj.ds.template.IconTemplate = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!Array<!goog.soy.data.SanitizedContent|string>} */
  var templates = soy.asserts.assertType(goog.isArray(opt_data.templates), 'templates', opt_data.templates, '!Array<!goog.soy.data.SanitizedContent|string>');
  /** @type {!Array<!goog.soy.data.SanitizedContent|string>} */
  var names = soy.asserts.assertType(goog.isArray(opt_data.names), 'names', opt_data.names, '!Array<!goog.soy.data.SanitizedContent|string>');
  var output = '\n{namespace pstj.autogen.template.icons}\n';
  var t31List = templates;
  var t31ListLen = t31List.length;
  for (var t31Index = 0; t31Index < t31ListLen; t31Index++) {
      var t31Data = t31List[t31Index];
      output += '\n\n\n/** Template for icon */\n{template .' + '' + names[t31Index] + '}\n' + '' + t31Data + '\n{/template}\n';
    }
  return soydata.markUnsanitizedText(output);
};
/**
 * @typedef {{
 *  templates: !Array<!goog.soy.data.SanitizedContent|string>,
 *  names: !Array<!goog.soy.data.SanitizedContent|string>,
 * }}
 */
pstj.ds.template.IconTemplate.Params;
if (goog.DEBUG) {
  pstj.ds.template.IconTemplate.soyTemplateName = 'pstj.ds.template.IconTemplate';
}


/**
 * @param {pstj.ds.template.IconNames.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.ds.template.IconNames = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!Array<!goog.soy.data.SanitizedContent|string>} */
  var names = soy.asserts.assertType(goog.isArray(opt_data.names), 'names', opt_data.names, '!Array<!goog.soy.data.SanitizedContent|string>');
  /** @type {!Array<!goog.soy.data.SanitizedContent|string>} */
  var symbols = soy.asserts.assertType(goog.isArray(opt_data.symbols), 'symbols', opt_data.symbols, '!Array<!goog.soy.data.SanitizedContent|string>');
  var output = (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_of(pstj.ds.template.IconNames, templates/ds.soy, 74)-->' : '') + '\n// File auto-generated, please do not edit!\ngoog.provide(\'pstj.autogen.icons.names\');\n\n\n/**\n * Provides the name of known icons.\n *\n * Note that those are automatically extracted from the source svg file(s).\n *\n * @enum {string}\n */\npstj.autogen.icons.names = {\n  NONE: \'none\',\n';
  var name44List = names;
  var name44ListLen = name44List.length;
  for (var name44Index = 0; name44Index < name44ListLen; name44Index++) {
      var name44Data = name44List[name44Index];
      output += '  ' + soy.$$escapeHtml(symbols[name44Index]) + ': \'' + soy.$$escapeHtml(name44Data) + '\',\n';
    }
  output += '  NONEXISTING: \'nonexisting\'\n};\n' + (goog.DEBUG && (opt_ijData && opt_ijData.debug_soy_template_info) ? '<!--dta_cf(pstj.ds.template.IconNames)-->' : '');
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
/**
 * @typedef {{
 *  names: !Array<!goog.soy.data.SanitizedContent|string>,
 *  symbols: !Array<!goog.soy.data.SanitizedContent|string>,
 * }}
 */
pstj.ds.template.IconNames.Params;
if (goog.DEBUG) {
  pstj.ds.template.IconNames.soyTemplateName = 'pstj.ds.template.IconNames';
}
