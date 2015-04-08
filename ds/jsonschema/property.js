/**
 * @fileoverview Provides the implementation for dealing with class properties
 * that are used in DTOs.
 */

goog.provide('pstj.ds.jsonschema.Property');

goog.require('goog.string');
goog.require('pstj.ds.jsonschema.resolver');


/** Provides the class property implementation. */
pstj.ds.jsonschema.Property = goog.defineClass(null, {
  constructor: function() {
    /**
     * The intrinsic JS name to use.
     * @type {string}
     */
    this.jsname = '';
    /**
     * The JS type to use.
     * @type {string}
     */
    this.jstype = '';
    /**
     * The name used on the remote end.
     * @type {string}
     */
    this.name = '';
    /**
     * The type used on the remote end.
     * @type {string}
     */
    this.type = '';
    /**
     * The description for the prperty.
     * @type {string}
     */
    this.description = '';
    /**
     * If the item is marked as required on the schema.
     * @type {boolean}
     */
    this.required = false;
    /**
     * The template namespace / type if any is used.
     * @type {string}
     */
    this.templatetype_ = '';
    /**
     * If the JSType is a Named Type (class) or a primitive.
     * @type {boolean}
     */
    this.isNamedType_ = false;
  },

  /**
   * Configures the property based on a map of settings.
   * @param {Object<string, *>} value The value of the property key.
   * @param {string} key The key for the values.
   */
  configure: function(value, key) {
    var description = value['description'] || '';
    var type = value['type'];
    var name = key;

    this.jstype = type;
    // if the desired type is different from the json type.
    if (value['$_type']) {
      this.jstype = value['$_type'];
    } else {
      // No desired type is provided, check if the map type is array or object
      if (type == 'object') {
        // jstype needs to be resolved
        this.jstype = this.resolveNamedType(value['$_reference']);
        this.isNamedType_ = true;
      } else if (type == 'array') {
        // the list must be resolved to its template type.
        var itemtype = value['items']['type'];
        // If the list has named type tempalte
        if (itemtype == 'object') {
          this.templatetype_ = this.resolveNamedType(
              value['items']['$_reference']);
          this.isNamedType_ = true;
        } else {
          // The list has primitive type template
          this.templatetype_ = itemtype;
        }
        // The final jstype.
        this.jstype = 'Array<' + this.templatetype_ + '>';
      }
    }
    this.description = description;
    this.name = name;
    this.type = type;
    this.jsname = value['$_name'] || name;
  },

  /**
   * Check if the property has a referenced type (if it is an object
   * or an array in JSON).
   * @return {boolean}
   */
  isReferencedType: function() {
    return this.isNamedType_ && !goog.string.isEmpty(this.templatetype_);
  },

  /**
   * Getter for the refence type - this is called only for complex types
   * like classes and types arrays.
   * @return {string}
   */
  getReferenceType: function() {
    if (this.type == 'object') return this.jstype;
    if (this.type == 'array') return this.templatetype_;
    throw new Error('Cannot resolve reference type to jstype: ' +
        this.type + ', ' + this.jstype + ', ' + this.templatetype_);
  },

  /**
   * Prints the type declaration usually in the constructor.
   * @type {pstj.ds.jsonschema.Buffer} buffer The buffer to print to.
   */
  printType: function(buffer) {
    if (this.hasDescription()) {
      buffer.startComment();
      buffer.addLine(this.description);
      buffer.addLine(this.getCommentType());
      buffer.endComment();
    } else {
      buffer.addSingleLineComment(this.getCommentType());
    }
    buffer.addLine(this.getJSTypeAssignment());
  },

  /**
   * Checks if the property has a valid description.
   * @return {boolean}
   */
  hasDescription: function() {
    return !goog.string.isEmpty(this.description);
  },

  /**
   * Returns the assignment / declaration for the type.
   * @return {string}
   * @protected
   */
  getJSTypeAssignment: function() {
    return this.getFromMapAssigmentLeft_() + this.getJSTypeDefaultValue() + ';';
  },

  /**
   * Getter for the default value depending on the required and type.
   * @return {string}
   * @protected
   */
  getJSTypeDefaultValue: function() {
    if (this.jstype == 'number') {
      if (this.required) return '0';
      else return 'null';
    } else if (this.jstype == 'string') {
      if (this.required) return '\'\'';
      else return 'null';
    } else if (this.jstype == 'boolean') {
      return 'false';
    } else if (this.jstype == 'Date') {
      return (this.required ? 'new Date()' : 'null');
    } else if (this.type == 'object') {
      return 'new ' + this.jstype + '()';
    } else if (this.type == 'array') {
      return '[]';
    } else {
      throw new Error('Cannot provide default type for: ' +
          this.jstype + ' (type) ' + this.type);
    }
  },

  /**
   * The comment to print. It takes into account if the property is
   * required.
   * @protected
   * @return {string}
   */
  getCommentType: function() {
    return '@type {' + (this.required ? '!' : '') + this.jstype + '}';
  },

  /**
   * Print the update of the item from a map.
   * @type {pstj.ds.jsonschema.Buffer} buffer The buffer to print to.
   */
  printFromMap: function(buffer) {
    var _prop = this.getMapExtractionBit_();
    var jsname = this.getScopedJSName_();
    if (this.type == this.jstype) {
      buffer.addLine(jsname + ' = ' + this.wrapFromMapAssignment() +
          ';');
    } else if (this.type == 'object') {
      // Objects are represented as named types in JS, call the instance
      // directly with the map.
      if (!this.required) {
        buffer.addLine('if (goog.isDefAndNotNull(' + _prop + ')) {');
        buffer.indent();
      }
      buffer.addLine(jsname + '.fromJSON(a.assertObject(' + _prop + '));');
      if (!this.required) {
        buffer.unindent();
        buffer.addLine('}');
      }
    } else if (this.type != this.jstype) {
      // Types differ, we need type conversion
      // convert primitive types first.
      if (this.jstype == 'number' || this.jstype == 'string' ||
          this.jstype == 'boolean' || this.jstype == 'Date') {

        buffer.addLine(this.wrapTypeConvertionAssignment());
      } else if (this.type == 'array') {
        // Clear the old values
        buffer.addLine('goog.array.clear(this.' + this.jsname + ');');

        if (!this.required) {
          buffer.addLine('if (goog.isArray(' + _prop + ')) {');
          buffer.indent();
        }

        buffer.addLine('goog.array.forEach(' + this.wrapWithChecks_(_prop) +
            ', function(item) {');
        buffer.indent();
        // we have a template type for the array, check each instance
        // in the array
        if (this.isReferencedType()) {
          buffer.addLine('var i = new ' + this.templatetype_ + '();');
          buffer.addLine('i.fromJSON(a.assertObject(item));');
          buffer.addLine(jsname + '.push(item);');
        } else {
          // here we need to assert the item type
          buffer.addLine(jsname + '.push(' +
              this.wrapPrimitiveWithAssert_(this.templatetype_, 'item') + ');');
        }
        buffer.unindent();
        buffer.addLine('}, this);');

        if (!this.required) {
          buffer.unindent();
          buffer.addLine('}');
        }
      } else {
        throw new Error('Unknown FOMRMAP convertion: ' +
            this.jstype + ', ' + this.type);
      }
    }
  },

  /**
   * Wraps the primitive types with assertion.
   * @param {string} type The primitive type (string, boolean, number).
   * @param {string} item String representation of the item to wrap.
   * @private
   */
  wrapPrimitiveWithAssert_: function(type, item) {
    switch (type) {
      case 'number' : return 'a.assertNumber(' + item + ')';
      case 'string' : return 'a.assertString(' + item + ')';
      case 'boolean' : return 'a.assertBoolean(' + item + ')';
      default: throw new Error('Unknown jstype, call only for primitives');
    }
  },

  /**
   * Wraps the assignment to properties from map in such a way as to assure
   * validity.
   *
   * If the property is required it will be asserted, itherwise it will be
   * checked by type and if not matching default value will be returned.
   * @protected
   */
  wrapFromMapAssignment: function() {
    var map = this.getMapExtractionBit_();
    if (this.required) {
      return this.wrapPrimitiveWithAssert_(this.jstype, map);
    } else {
      switch (this.jstype) {
        case 'number' : return map + ' || 0';
        case 'string' : return map + ' || \'\'';
        case 'boolean' : return map + ' || false';
        default: throw new Error('Unknown jstype, call only for primitives');
      }
    }
  },

  /**
   * Helper method to return the left hand assigment of the peropty in
   * class scope.
   * @private
   * @return {string}
   */
  getFromMapAssigmentLeft_: function() {
    return this.getScopedJSName_() + ' = ';
  },

  /**
   * Helper to return the name extraction logic from the JSON map.
   * @return {string}
   * @private
   */
  getMapExtractionBit_: function() {
    return 'map[\'' + this.name + '\']';
  },

  /**
   * Wrap with all neede checks the right hand assignemnt when updating
   * from server sent map.
   * @param {string} item String representation of the item to wrap.
   * @private
   */
  wrapWithChecks_: function(item) {
    if (this.required) {
      switch (this.type) {
        case 'number':
        case 'string':
        case 'boolean':
          return this.wrapPrimitiveWithAssert_(this.type, item);
          break;
        case 'object': return 'a.assertObject(' + item + ')';
        case 'array' : return 'a.assertArray(' + item + ')';
        default: throw new Error('Unknown assertion type');
      }
    } else if (this.type != this.jstype) {
      switch (this.type) {
        case 'number': return '(goog.isNumber(' + item + ') ? ' + item + ' : ' +
            '0)';
        case 'string': return '(goog.isString(' + item + ') ? ' + item + ' : ' +
            '\'\')';
        case 'boolean': return '(goog.isBoolean( ' + item + ') ? ' + item +
            ' : ' + 'false)';
        default: return item;
      }
    } else return item;
  },

  /**
   * Wraps an item to be parsed as a number at runtime.
   * @return {string}
   * @private
   */
  wrapParseAsNumber_: function(text) {
    return 'parseFloat(' + this.wrapWithChecks_(text) + ')';
  },

  /**
   * Wraps an item to be parsed as a boolean at runtime.
   * @return {string}
   * @private
   */
  wrapParseAsBoolean_: function(text) {
    return '!!(' + this.wrapWithChecks_(text) + ')';
  },

  /**
   * Wraps an item to be parsed as a string at runtime.
   * @return {string}
   * @private
   */
  wrapParseAsString_: function(text) {
    return this.wrapWithChecks_(text) + '.toString()';
  },

  /**
   * Wraps an item to be parsed as a Date at runtime.
   * @return {string}
   * @private
   */
  wrapParseAsDate_: function(text) {
    return '(new Date(' + this.wrapWithChecks_(text) + ')) || this.' +
        this.jsname;
  },

  /**
   * Wrpas the type conversion for primitive types and date when
   * assigning from MAP to JSType.
   * @protected
   */
  wrapTypeConvertionAssignment: function() {
    var mapbit = this.getMapExtractionBit_();
    var namebit = this.getFromMapAssigmentLeft_();
    switch (this.jstype) {
      case 'number':
        return namebit + this.wrapParseAsNumber_(mapbit) + ';';
        break;
      case 'boolean':
        return namebit + this.wrapParseAsBoolean_(mapbit) + ';';
        break;
      case 'Date':
        return namebit + this.wrapParseAsDate_(mapbit) + ';';
        break;
      case 'string':
        return namebit + this.wrapParseAsString_(mapbit) + ';';
        break;
      default: throw new Error('Cannot convert string to ' + this.jstype);
    }
  },

  /**
   * Returns the server name in quotes for the json map creation
   * (serialization).
   *
   * @return {string}
   */
  getNameAsString: function() {
    return '\'' + this.name + '\'';
  },

  /**
   * Print the convertion to map of the item.
   * @param {pstj.ds.jsonschema.Buffer} buffer The buffer to print to.
   * @param {boolean} isLast If true the comma ad the end wont be
   *    printed.
   */
  printToMap: function(buffer, isLast) {
    buffer.addLine(this.getNameAsString() + ': ' + this.getToMapConversion() +
        (isLast ? ',' : ''));
  },

  /**
   * Returns a conversion story for the JSType to map for the toJSON method.
   * @return {string}
   */
  getToMapConversion: function() {
    var sjsname = this.getScopedJSName_();
    if (this.type == this.jstype) {
      return sjsname;
    } else {
      if (this.type == 'string') return sjsname + '.toString()';
      if (this.type == 'number') return 'parseFloat(' + sjsname + ')';
      if (this.type == 'object' || this.type == 'array') {
        return sjsname;
      }
    }
    return 'ERROR';
  },

  /**
   * Returns the local JS name scoped to the class.
   * @return {string}
   */
  getScopedJSName_: function() {
    return 'this.' + this.jsname;
  },

  /**
   * Getter for the resolved type name.
   *
   * The name is a JSONSchema reference (i.e. basically a path name without
   * the extention).
   *
   * The resolver will attempt to match the name to a class, assuming the class
   * was already required by its path.
   *
   * @param {string} type The name of the path to match a class to.
   * @return {string} The fully qualified namespace of the corresponding class.
   */
  resolveNamedType: function(type) {
    var klass = pstj.ds.jsonschema.resolver.resolve(type);
    if (klass) return klass.namespace;
    else throw new Error('Cannot find class definition for path:' + type);
  }
});
