// This file was automatically generated from sourcegen.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace pstj.sourcegen.template.
 * @public
 */

goog.provide('pstj.sourcegen.template');

goog.require('goog.soy.data.SanitizedContent');
goog.require('soy.asserts');
goog.require('soydata');


/**
 * @param {pstj.sourcegen.template.IntegerHelper.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.UnsanitizedText}
 * @suppress {checkTypes}
 */
pstj.sourcegen.template.IntegerHelper = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var namespace = soy.asserts.assertType(goog.isString(opt_data.namespace) || opt_data.namespace instanceof goog.soy.data.SanitizedContent, 'namespace', opt_data.namespace, '!goog.soy.data.SanitizedContent|string');
  return soydata.markUnsanitizedText('/**\n * Helper method for chekcing if the value is really an integer.\n *\n * @private\n * @param {number} val\n * @return {number}\n */\n' + '' + namespace + ' = function(val) {\n  if (goog.DEBUG) {\n    if (parseInt(val, 10) != val) {\n      throw new Error(\'The value is not an integer: \' + val);\n    }\n  }\n  return val;\n};');
};
/**
 * @typedef {{
 *  namespace: (!goog.soy.data.SanitizedContent|string),
 * }}
 */
pstj.sourcegen.template.IntegerHelper.Params;
if (goog.DEBUG) {
  pstj.sourcegen.template.IntegerHelper.soyTemplateName = 'pstj.sourcegen.template.IntegerHelper';
}


/**
 * @param {pstj.sourcegen.template.MinMaxHelper.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.UnsanitizedText}
 * @suppress {checkTypes}
 */
pstj.sourcegen.template.MinMaxHelper = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var namespace = soy.asserts.assertType(goog.isString(opt_data.namespace) || opt_data.namespace instanceof goog.soy.data.SanitizedContent, 'namespace', opt_data.namespace, '!goog.soy.data.SanitizedContent|string');
  return soydata.markUnsanitizedText('/**\n * Helper function for managing min/max values of ints.\n *\n * @private\n * @param {number} val\n * @param {?number} min\n * @param {?number} max\n * @return {number}\n */\n' + '' + namespace + ' = function(val, min, max) {\n  if (goog.DEBUG) {\n    if ((min != null && val < min) || (max != null && val > max)) {\n      throw new Error(\n          \'Value out of range: \' + val + \', \' + min + \', \' + max);\n    }\n  }\n  return val;\n};');
};
/**
 * @typedef {{
 *  namespace: (!goog.soy.data.SanitizedContent|string),
 * }}
 */
pstj.sourcegen.template.MinMaxHelper.Params;
if (goog.DEBUG) {
  pstj.sourcegen.template.MinMaxHelper.soyTemplateName = 'pstj.sourcegen.template.MinMaxHelper';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.UnsanitizedText}
 * @suppress {checkTypes}
 */
pstj.sourcegen.template.Warning = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  return soydata.markUnsanitizedText('// This code is auto generate, please do not edit!');
};
if (goog.DEBUG) {
  pstj.sourcegen.template.Warning.soyTemplateName = 'pstj.sourcegen.template.Warning';
}


/**
 * @param {pstj.sourcegen.template.RpcBaseUrl.Params} opt_data
 * @param {Object<string, *>=} opt_ijData
 * @param {Object<string, *>=} opt_ijData_deprecated
 * @return {!goog.soy.data.UnsanitizedText}
 * @suppress {checkTypes}
 */
pstj.sourcegen.template.RpcBaseUrl = function(opt_data, opt_ijData, opt_ijData_deprecated) {
  opt_ijData = opt_ijData_deprecated || opt_ijData;
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var namespace = soy.asserts.assertType(goog.isString(opt_data.namespace) || opt_data.namespace instanceof goog.soy.data.SanitizedContent, 'namespace', opt_data.namespace, '!goog.soy.data.SanitizedContent|string');
  /** @type {!goog.soy.data.SanitizedContent|string} */
  var base = soy.asserts.assertType(goog.isString(opt_data.base) || opt_data.base instanceof goog.soy.data.SanitizedContent, 'base', opt_data.base, '!goog.soy.data.SanitizedContent|string');
  return soydata.markUnsanitizedText('/**\n * Provides the base path for the RPC URL.\n *\n * @private\n * @const {!string}\n */\n' + '' + namespace + '.baseUrl_ = \'' + '' + base + '\';');
};
/**
 * @typedef {{
 *  namespace: (!goog.soy.data.SanitizedContent|string),
 *  base: (!goog.soy.data.SanitizedContent|string),
 * }}
 */
pstj.sourcegen.template.RpcBaseUrl.Params;
if (goog.DEBUG) {
  pstj.sourcegen.template.RpcBaseUrl.soyTemplateName = 'pstj.sourcegen.template.RpcBaseUrl';
}
