goog.provide('pstj.ds.dto.format');

goog.scope(function() {
  var format = pstj.ds.dto.format;

  /**
   * Provides the known formatting options
   * @enum {string}
   */
  format.Format = {
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

  /**
   * Format types allows in int type data.
   * @const {!Array<string>}
   */
  format.allowedInInt = [ format.Format.INT32, format.Format.INT64 ];

  /**
   * Format types allows in number type data.
   * @const {!Array<string>}
   */
  format.allowedInNumber = [ format.Format.FLOAT, format.Format.DOUBLE ];

  /**
   * Format types allows in string type data.
   * @const {!Array<string>}
   */
  format.allowedInString = [
    format.Format.BYTE,
    format.Format.BINARY,
    format.Format.DATE,
    format.Format.DATETIME,
    format.Format.PASSWORD
  ];
});  // goog.scope