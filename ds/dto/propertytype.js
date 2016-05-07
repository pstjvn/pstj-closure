goog.provide('pstj.ds.dto.type');

goog.scope(function() {
  var type = pstj.ds.dto.type;

  /**
   * @enum {string}
   */
  type.Type = {
    REF : '',
    OBJECT : 'object',
    ARRAY : 'array',
    INT : 'int',
    NUMBER : 'number',
    STRING : 'string',
    BOOLEAN : 'boolean'
  };
});  // goog.scope
