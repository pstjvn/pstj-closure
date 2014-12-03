goog.provide('pstj.ds.jstype.Record');

goog.require('goog.array');
goog.require('goog.string');
goog.require('pstj.ds.jstype.Type');

goog.scope(function() {
var Type = pstj.ds.jstype.Type;


/** Implements the base for the JSTypes. */
pstj.ds.jstype.Record = goog.defineClass(null, {
  /** @constructor */
  constructor: function() {
    /**
     * The internal JSType.
     * @type {Type}
     * @private
     */
    this.type_ = Type.NONE;
    /**
     * The name of the item, usually a namespace for constructors and a
     * single name for methods and properties, single name for parameters.
     * @type {string}
     */
    this.name = '';
    /**
     * The JSType for the record. Could be a namespace of primirive. Could be
     * a complex string as well that needs to be parsed for array/not-null.
     * @type {string}
     */
    this.type = '';
    /**
     * The description provided in the docs, could be longer than allowed
     * 80 columns and needs to be parsed to match the limit.
     * @type {string}
     */
    this.description = '';
  },


  /**
   * Provides mechanizm for the sublcases to alter the intrinsic JSType of the
   * instance.
   * @param {Type} type
   * @protected
   */
  setTypeInternal: function(type) {
    this.type_ = type;
  },


  /**
   * Retrieves the internal type from outside world (for testing).
   * @return {Type}
   */
  getInternalType: function() {
    return this.type_;
  },


  /**
   * Assign the name (or namespace) to the JSType instance.
   * @param {string} name
   */
  setName: function(name) {
    this.name = name;
  },


  /**
   * Returns the declaration string - namespace + assignment, for example for
   * properties it is:
   * namespace.property;
   * and for methods it is
   * namespace.method = function(params..) {};
   * @return {string}
   */
  getName: function() {
    return goog.string.trim(this.name) + this.getAssignment();
  },


  /**
   * Assigns the JSType to the instance. The type could be a primitive type (
   * string, number, boolean) or object type (Object, Function, Array, Date,
   * RegExp) or user type (namespace.type).
   * @param {string} type
   */
  setType: function(type) {
    this.type = type;
  },


  /**
   * Provides the type of the record in JSDoc format W/O the comment prefix.
   * @return {string}
   */
  getType: function() {
    return '@type {' + this.determineJSType() + '}';
  },


  /**
   * Attempts to determine the JSType based on specific keywords in description
   * and type itslef.
   * @return {string} The found type.
   * @protected
   */
  determineJSType: function() {
    var res = '';
    if (this.description != '') {
      if (goog.string.contains(this.description, 'Must not be null')) {
        res += '!';
      }
      if (goog.string.contains(this.description, 'May be null')) {
        res += '?';
      }
    }

    if (goog.string.contains(this.type, 'Array of non-null ')) {
      res += goog.string.trim(this.type.replace(
          'Array of non-null ', 'Array<!')) + '>';
    } else if (goog.string.contains(this.type, 'Array of ')) {
      res += goog.string.trim(this.type.replace('Array of ', 'Array<')) + '>';
    } else if (goog.string.contains(this.type, 'non-nullable')) {
      res += goog.string.trim(this.type.replace('non-nullable ', ''));
    } else {
      res += this.type;
    }

    if (res == 'any type') {
      return '?';
    } else {
      return res;
    }
  },


  /**
   * Assigns the description for the instance. Should be a string or any length
   * including empty string.
   * @param {string} desc
   */
  setDescription: function(desc) {
    this.description = goog.string.collapseWhitespace(desc);
  },


  /**
   * Provides the description formatted as list of strings that are capped
   * at the length provided. If no length is provided the cap is set to 77
   * which is the default comment width allowed to accomodate the block
   * comment prefix.
   * @param {number=} opt_width
   * @return {Array<string>}
   */
  getDescription: function(opt_width) {
    if (!goog.isDef(opt_width)) opt_width = 77;
    var desc = this.fixNewlineSpaceDiscrepancy(this.description);
    return this.parseDescriptionToList(desc, opt_width);
  },


  /**
   * Fixes an issue with the html extracted strings. Sometimes the HTML is
   * formatted as two string with a newline which is rendered as space, but that
   * space is missing when the text is retrieved with textContent. This fixes
   * that discrepancy.
   * @param {string} string The string to fix.
   * @return {string} The fixed string.
   * @protected
   */
  fixNewlineSpaceDiscrepancy: function(string) {
    return string.replace(/\.([A-Z])/g, '. $1');
  },


  /**
   * Given a description as a string parses it to a list that can be
   * directly added to a JSDoc section. The items in the list are up to
   * 77 synbols long and the JSDoc block should put its own comment symbol (
   * '*' by defaul).
   * @param {string} desc The string to be cut into list of strings.
   * @param {number} width The width to separate the string to.
   * @return {Array<string>}
   */
  parseDescriptionToList: function(desc, width) {
    if (desc.length < width) {
      return [desc];
    } else {
      var res = [];
      var parts = Math.ceil(desc.length / width);
      var from = 0;
      var to = 0;
      for (var i = 0; i < parts; i++) {
        if (from + width >= desc.length) {
          res.push(desc.slice(from, from + width));
        } else {
          to = this.findSplitPoint(desc, from, width);
          res.push(desc.slice(from, to));
          from = to + 1;
        }
      }
      return res;
    }
  },


  /**
   * Attemtps to find a split point to the desired width to be on a white
   * space character.
   * @protected
   * @param {string} str
   * @param {number} i Start index
   * @param {number} width The maximum offset starting from the start index.
   * @return {number} The index found to split on.
   */
  findSplitPoint: function(str, i, width) {
    var p = i + width;
    if (str[p] == ' ') return p;
    else {
      while (str[p] != ' ') {
        if (p <= i) break;
        p--;
      }
      return p;
    }
  },


  /**
   * Returns the 'ready-to-print' variant of the record type.
   * @override
   * @return {string}
   */
  toString: function() {
    return this.textile().join('\n');
  },

  /**
   * Pushes the JSDoc for the record type to the list of generated textual
   * rows.
   * @param {Array<string>} list
   */
  addJSDocs: function(list) {
    list.push('/**');
    if (this.description != '') {
      this.addJSDocDescription(list);
    }
    this.addJSDocForType(list);
    this.addJSDocForParams(list);
    list.push(' */');
  },


  /**
   * Given the list of strings that represent the current part of the JSDoc adds
   * the description lines shifted to match the width.
   * Please do not override this method, instead make sure to return all the
   * needed items in the '#getDescription' method.
   * @param {Array<string>} list
   */
  addJSDocDescription: function(list) {
    goog.array.forEach(this.getDescription(), function(row) {
      list.push(' * ' + row);
    });
  },


  /**
   * Pushes the type information of the record type to the list of JSDoc rows.
   * @param {Array<string>} list
   */
  addJSDocForType: function(list) {
    list.push(' * ' + this.getType());
  },


  /**
   * Creates list of strings that represent the extern type as text.
   * @return {Array<string>}
   */
  textile: function() {
    var res = [];
    this.addJSDocs(res);
    res.push(this.getName());
    return res;
  },

  /**
   * Useful for methods and constructors - adds the parameters for docs.
   * @param {Array<string>} list The docs listing.
   * @param {Array<pstj.ds.jstype.Parameter>} params The list of parameters
   * for the call.
   */
  addJSDocForParams: function(list, params) {
    return;
  },


  /**
   * Retrieves the right hand part of the assignment of the record for the
   * externs file. In the simplest form it is simply a semicolon. Functions and
   * method as well as constructors have complex assignment signatures and
   * should override this method.
   * @return {string}
   * @protected
   */
  getAssignment: function() {
    return ';';
  }
});

});  // goog.scope

