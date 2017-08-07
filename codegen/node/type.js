goog.provide('pstj.codegen.node.type');


/**
 * The property types we know how to handle. Note that those types can be
 * presented in the API description and do not represent the JS types, instead
 * they tell us the type of the value to expect in the incoming JSON string.
 *
 * This type, combined with the format determines the type we must have
 * in the resulting JS class.
 *
 * Note that the `CLASS` is never going to be present in the source JSON
 * as it is not a valid option, but we include it in order to be able to
 * generate descroptions on our end that can be useful.
 *
 * The `unknown` type is used to keep the property type check and the
 * `reference` type is used for late binding the array and object types.
 *
 * Note that Date is special type and is considred 'object' in this enum.
 *
 * @enum {string}
 */
pstj.codegen.node.type = {
  // Used to set initial value
  UNKNOWN: '__unknown',
  // Used to denote class references, that is 'object' in json terms
  REFERENCE: '__ref',
  // Not currently used
  CLASS: 'class',
  // Used to denote specific JS objects like Date.
  // it should not be set at all even thou it is used in jsonscheme, it messes
  // things up.
  OBJECT: 'object',
  ARRAY: 'array',
  INT: 'integer',
  NUMBER: 'number',
  STRING: 'string',
  BOOLEAN: 'boolean'
};
