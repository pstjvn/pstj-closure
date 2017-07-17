goog.provide('pstj.codegen.util');

goog.require('pstj.codegen.node.format');
goog.require('pstj.codegen.node.type');


/**
 * The variants / format that are allowed in a integer, declared as 'int'.
 * Both format must be represented as Number in JS and serialized to Number in
 * JSON.
 *
 * In closure for example one can ise bigNumber to represent 64bit ints.
 *
 * @private
 * @type {Array<pstj.codegen.node.format>}
 */
pstj.codegen.util.allowedInInt_ = [
  pstj.codegen.node.format.INT32,
  pstj.codegen.node.format.INT64
];


/**
 * JS does not have specific conversion between fload and double and all
 * such numbers are simply Number in JS land. If you need to work with specific
 * precisions use library that can handle it.
 *
 * @private
 * @type {Array<pstj.codegen.node.format>}
 */
pstj.codegen.util.allowedInNumber_ = [
  pstj.codegen.node.format.FLOAT,
  pstj.codegen.node.format.DOUBLE
];


/**
 * Those are the types that must be represented as String when serialized, but
 * might be different types in JS land, for example date and datetime are
 * to use Date, binary can be converted to number and byte can use array buffer.
 *
 * @private
 * @type {Array<pstj.codegen.node.format>}
 */
pstj.codegen.util.allowedInString_ = [
  pstj.codegen.node.format.BYTE,
  pstj.codegen.node.format.BINARY,
  pstj.codegen.node.format.DATE,
  pstj.codegen.node.format.DATETIME,
  pstj.codegen.node.format.PASSWORD
];


/**
 * Converts the string format to our known subset.
 *
 * @private
 * @param {string} format
 * @return {pstj.codegen.node.format}
 */
pstj.codegen.util.convertFormat_ = function(format) {
  switch (format) {
    case 'int23': return pstj.codegen.node.format.INT32;
    case 'int64': return pstj.codegen.node.format.INT64;
    case 'float': return pstj.codegen.node.format.FLOAT;
    case 'double': return pstj.codegen.node.format.DOUBLE;
    case 'byte': return pstj.codegen.node.format.BYTE;
    case 'binary': return pstj.codegen.node.format.BINARY;
    case 'date': return pstj.codegen.node.format.DATE;
    case 'date-time': return pstj.codegen.node.format.DATETIME;
    case 'password': return pstj.codegen.node.format.PASSWORD;
    default: throw new Error(`Unknown formatting: ${format}`);
  }
};


/**
 * Using the API property type tried to determine the intrinsic type to use.
 *
 * If the API type is not known an error is thrown.
 *
 * We support Date as well for converting to Date object without asking for
 * the corect format.
 *
 * @param {string} type
 * @return {!pstj.codegen.node.type}
 */
pstj.codegen.util.getPropertyType = function(type) {
  switch (type) {
    case 'object': return pstj.codegen.node.type.OBJECT;
    case 'array': return pstj.codegen.node.type.ARRAY;
    case 'integer': return pstj.codegen.node.type.INT;
    case 'number': return pstj.codegen.node.type.NUMBER;
    case 'string': return pstj.codegen.node.type.STRING;
    case 'boolean': return pstj.codegen.node.type.BOOLEAN;
    case 'Date': return pstj.codegen.node.type.OBJECT;
    default: throw new Error(`Unknown type provided by API: ${type}`);
  }
};


/**
 * Will check for formatting and if it can actually is valid for the target
 * type.
 *
 * @param {pstj.codegen.node.type} type
 * @param {string} format
 * @return {pstj.codegen.node.format}
 */
pstj.codegen.util.getFormatForType = function(type, format) {
  let _format = pstj.codegen.util.convertFormat_(format);
  if ((type == pstj.codegen.node.type.INT && goog.array.contains(pstj.codegen.util.allowedInInt_, _format)) ||
    (type == pstj.codegen.node.type.NUMBER && goog.array.contains(pstj.codegen.util.allowedInNumber_, _format))||
    (type == pstj.codegen.node.type.STRING && goog.array.contains(pstj.codegen.util.allowedInString_, _format))) {
      return _format;
    }
  else throw new Error(`Format ${format} cannot be applied to propery of type ${type}`);
};
