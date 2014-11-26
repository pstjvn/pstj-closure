goog.provide('pstj.ds.jstype.Type');


/**
 * Enumerates the JSTypes we are intered in.
 * @enum {number}
 */
pstj.ds.jstype.Type = {
  NONE: 0,
  PROPERTY: 1,
  METHOD: 2,
  CONSTRUCTOR: 3,
  ENUM: 4,
  PARAMETER: 5,
  FUNCTION: 6,
  STATIC_PROPERTY: 7,
  STATIC_METHOD: 8
};
