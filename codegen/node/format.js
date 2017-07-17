goog.provide('pstj.codegen.node.format');


/**
 * The format in which some of the fields can be formatted in.
 *
 * For example a number (Number type in JS) can be formatted as
 * int32, and vice versa - a date-time can be a string and we need to
 * interpret it as a Date in JS.
 *
 * @enum {string}
 */
pstj.codegen.node.format = {
  INT32 : 'int32',
  INT64 : 'int64',
  FLOAT : 'float',
  DOUBLE : 'double',
  BYTE : 'byte',
  BINARY : 'binary',
  DATE : 'date',
  DATETIME : 'date-time',
  PASSWORD : 'password'
};
