// This file was automatically generated from ds.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace pstj.ds.template.
 * @public
 */

goog.provide('pstj.ds.template');

/** @suppress {extraRequire} */
goog.require('soy');
/** @suppress {extraRequire} */
goog.require('soydata');
/** @suppress {extraRequire} */
goog.require('goog.asserts');
/** @suppress {extraRequire} */
goog.require('soy.asserts');


/**
 * @param {{
 *    className: string,
 *    iconName: string,
 *    icons: !Array<string>
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.ds.template.IconRenderer = function(opt_data, opt_ignored, opt_ijData) {
  soy.asserts.assertType(goog.isString(opt_data.className) || (opt_data.className instanceof goog.soy.data.SanitizedContent), 'className', opt_data.className, 'string|goog.soy.data.SanitizedContent');
  var className = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.className);
  soy.asserts.assertType(goog.isString(opt_data.iconName) || (opt_data.iconName instanceof goog.soy.data.SanitizedContent), 'iconName', opt_data.iconName, 'string|goog.soy.data.SanitizedContent');
  var iconName = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.iconName);
  var icons = goog.asserts.assertArray(opt_data.icons, "expected parameter 'icons' of type list<string>.");
  var output = '\n// File auto-generated, please do not edit\ngoog.provide(\'pstj.autogen.iconrenderer.' + soy.$$escapeHtml(className) + '\');\n\ngoog.require(\'pstj.autogen.template.icons\');\ngoog.require(\'pstj.material.IconRenderer\');\ngoog.require(\'pstj.material.icons.registry\');\n\ngoog.scope(function() {\nvar IR = pstj.material.IconRenderer;\nvar registry = pstj.material.icons.registry;\n\n\n/** Renderer for \'' + soy.$$escapeHtml(iconName) + '\' icon */\npstj.autogen.iconrenderer.' + soy.$$escapeHtml(className) + ' = goog.defineClass(IR, {\n  constructor: function() {\n    IR.call(this);\n  },\n\n  /** @inheritDoc */\n  getTemplate: function(model) {\n    return pstj.autogen.template.icons.' + soy.$$escapeHtml(className) + '(model);\n  }\n});\ngoog.addSingletonGetter(icons.' + soy.$$escapeHtml(className) + ');\n\n\n// Register the renderer for icon name\n';
  var iconnameList19 = icons;
  var iconnameListLen19 = iconnameList19.length;
  for (var iconnameIndex19 = 0; iconnameIndex19 < iconnameListLen19; iconnameIndex19++) {
    var iconnameData19 = iconnameList19[iconnameIndex19];
    output += 'registry.setRenderer(\'' + soy.$$escapeHtml(iconnameData19) + '\', icons.' + soy.$$escapeHtml(className) + '.getInstance());\n';
  }
  output += '\n});  // goog.scope\n\n';
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  pstj.ds.template.IconRenderer.soyTemplateName = 'pstj.ds.template.IconRenderer';
}


/**
 * @param {{
 *    templates: !Array<string>,
 *    names: !Array<string>
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.UnsanitizedText}
 * @suppress {checkTypes}
 */
pstj.ds.template.IconTemplate = function(opt_data, opt_ignored, opt_ijData) {
  var templates = goog.asserts.assertArray(opt_data.templates, "expected parameter 'templates' of type list<string>.");
  var names = goog.asserts.assertArray(opt_data.names, "expected parameter 'names' of type list<string>.");
  var output = '\n{namespace pstj.autogen.template.icons}\n';
  var tList29 = templates;
  var tListLen29 = tList29.length;
  for (var tIndex29 = 0; tIndex29 < tListLen29; tIndex29++) {
    var tData29 = tList29[tIndex29];
    output += '\n\n\n/** Template for icon */\n{template .' + ('' + names[tIndex29]) + '}\n' + ('' + tData29) + '\n{/template}\n';
  }
  return soydata.markUnsanitizedText(output);
};
if (goog.DEBUG) {
  pstj.ds.template.IconTemplate.soyTemplateName = 'pstj.ds.template.IconTemplate';
}


/**
 * @param {{
 *    names: !Array<string>,
 *    symbols: !Array<string>
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
pstj.ds.template.IconNames = function(opt_data, opt_ignored, opt_ijData) {
  var names = goog.asserts.assertArray(opt_data.names, "expected parameter 'names' of type list<string>.");
  var symbols = goog.asserts.assertArray(opt_data.symbols, "expected parameter 'symbols' of type list<string>.");
  var output = '\n// File auto-generated, please do not edit!\ngoog.provide(\'pstj.autogen.icons.names\');\n\n\n/**\n * Provides the name of known icons.\n *\n * Note that those are automatically extracted from the source svg file(s).\n *\n * @enum {string}\n */\npstj.autogen.icons.names = {\n  NONE: \'none\',\n';
  var nameList38 = names;
  var nameListLen38 = nameList38.length;
  for (var nameIndex38 = 0; nameIndex38 < nameListLen38; nameIndex38++) {
    var nameData38 = nameList38[nameIndex38];
    output += '  ' + soy.$$escapeHtml(symbols[nameIndex38]) + ': \'' + soy.$$escapeHtml(nameData38) + '\',\n';
  }
  output += '  NONEXISTING: \'nonexisting\'\n};\n';
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(output);
};
if (goog.DEBUG) {
  pstj.ds.template.IconNames.soyTemplateName = 'pstj.ds.template.IconNames';
}
