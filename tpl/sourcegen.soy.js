// This file was automatically generated from sourcegen.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace pstj.sourcegen.template.
 * @public
 */

goog.provide('pstj.sourcegen.template');

goog.require('soy');
goog.require('soydata');
/** @suppress {extraRequire} */
goog.require('goog.asserts');


/**
 * @param {{
 *    namespace: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.UnsanitizedText}
 * @suppress {checkTypes}
 */
pstj.sourcegen.template.IntegerHelper = function(opt_data, opt_ignored) {
  soy.asserts.assertType(goog.isString(opt_data.namespace) || (opt_data.namespace instanceof goog.soy.data.SanitizedContent), 'namespace', opt_data.namespace, 'string|goog.soy.data.SanitizedContent');
  var namespace = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.namespace);
  return soydata.markUnsanitizedText('/**\n * Helper method for chekcing if the value is really an integer.\n *\n * @param {number} val\n * @return {number}\n */\n' + ('' + namespace) + ' = function(val) {\n  if (parseInt(val, 10) != val) {\n    throw new Error(\'The value is not an integer: \' + val);\n  }\n  return val;\n}');
};
if (goog.DEBUG) {
  pstj.sourcegen.template.IntegerHelper.soyTemplateName = 'pstj.sourcegen.template.IntegerHelper';
}


/**
 * @param {{
 *    namespace: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.UnsanitizedText}
 * @suppress {checkTypes}
 */
pstj.sourcegen.template.MinMaxHelper = function(opt_data, opt_ignored) {
  soy.asserts.assertType(goog.isString(opt_data.namespace) || (opt_data.namespace instanceof goog.soy.data.SanitizedContent), 'namespace', opt_data.namespace, 'string|goog.soy.data.SanitizedContent');
  var namespace = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.namespace);
  return soydata.markUnsanitizedText('/**\n * Helper function for managing min/max values of ints.\n *\n * @param {number} val\n * @param {?number} min\n * @param {?number} max\n * @return {number}\n */\n' + ('' + namespace) + ' = function(val, min, max) {\n  if ((min != null && val < min) || (max != null && val > max)) {\n    throw new Error(\n        \'Value out of range: \' + val + \', \' + min + \', \' + max);\n  }\n  return val;\n};\n');
};
if (goog.DEBUG) {
  pstj.sourcegen.template.MinMaxHelper.soyTemplateName = 'pstj.sourcegen.template.MinMaxHelper';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.UnsanitizedText}
 * @suppress {checkTypes}
 */
pstj.sourcegen.template.Warning = function(opt_data, opt_ignored) {
  return soydata.markUnsanitizedText('// This code is auto generate, please do not edit!');
};
if (goog.DEBUG) {
  pstj.sourcegen.template.Warning.soyTemplateName = 'pstj.sourcegen.template.Warning';
}


/**
 * @param {{
 *    namespace: string,
 *    base: string
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {!soydata.UnsanitizedText}
 * @suppress {checkTypes}
 */
pstj.sourcegen.template.RpcBaseUrl = function(opt_data, opt_ignored) {
  soy.asserts.assertType(goog.isString(opt_data.namespace) || (opt_data.namespace instanceof goog.soy.data.SanitizedContent), 'namespace', opt_data.namespace, 'string|goog.soy.data.SanitizedContent');
  var namespace = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.namespace);
  soy.asserts.assertType(goog.isString(opt_data.base) || (opt_data.base instanceof goog.soy.data.SanitizedContent), 'base', opt_data.base, 'string|goog.soy.data.SanitizedContent');
  var base = /** @type {string|goog.soy.data.SanitizedContent} */ (opt_data.base);
  return soydata.markUnsanitizedText('/**\n * Provides the base path for the RPC URL.\n *\n * @private\n * @const {!string}\n */\n' + ('' + namespace) + '.baseUrl_ = \'' + ('' + base) + '\';');
};
if (goog.DEBUG) {
  pstj.sourcegen.template.RpcBaseUrl.soyTemplateName = 'pstj.sourcegen.template.RpcBaseUrl';
}
