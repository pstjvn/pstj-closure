/**
 * @fileoverview Provides the default property description class.
 *
 * Note that the class serves as descriptor instance of a property in the
 * dicovery document. All closure related functionality is
 * contained within the methods attached to the class. This is done
 * to allow other parties to extend / override the usage and thus
 * make the subclass usable for other JS context/frameworks.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('pstj.ds.discovery.Property');


/** Represents a single property in a DTO class. */
pstj.ds.discovery.Property = goog.defineClass(null, {
  /**
   * @constructor
   * @param {string} name The name of the property.
   * @param {!Object<string, ?>} json The schema for the property.
   */
  constructor: function(name, json) {
    /**
     * The name of the property: string to represent it in the class.
     * @type {string}
     */
    this.name = name;
    /**
     * The type of the property.
     *
     * It could be a primitive type or a reference type.
     * @type {string}
     */
    this.type = null;
    /**
     * The referenced type if any.
     * @type {string}
     */
    this.ref = null;
    /**
     * The description of the field or an empty string if one is not provided.
     * @type {string}
     */
    this.description = null;
    /**
     * If the property is required. By default properties are not required.
     * @type {boolean}
     */
    this.required = false;
    /**
     * A default value if exists.
     * @type {?string}
     */
    this.defaultValue = null;
    /**
     * Format of the value. For more details see
     * https://developers.google.com/discovery/v1/type-format
     * @type {string}
     */
    this.format = null;
    /**
     * Additional pattern matching requirement for the values this property
     * can take.
     * @type {string}
     */
    this.pattern = null;
    /**
     * The minimum value the property can accept. Note that the value is
     * designated as string and for numerical values you should convert it
     * to match against it.
     * @type {string}
     */
    this.minimum = null;
    /**
     * The maximum value the property can take. For details {@see minimum}
     * @type {string}
     */
    this.maximum = null;
    /**
     * If true the value could be repeadet.
     * @type {boolean}
     */
    this.repeated = false;
    /**
     * Used for parameters that are part of the query string / paths of the
     * rest object.
     * @type {string}
     */
    this.location = null;
    /**
     * The type of items, if the type is array.
     * @type {?pstj.ds.discovery.Property}
     */
    this.items = null;

    this.process(json);
  },


  /**
   * Extract information from the schema. Here we just assign values from the
   * schema to the descriptor instance to make it accessible for type checks
   * and compilation.
   * @param  {!Object<string, ?>} json The json scheme.
   * @protected
   */
  process: function(json) {

    if (goog.isString(json['type'])) {
      this.type = json['type'];
    }

    if (goog.isString(json['$ref'])) {
      this.ref = json['$ref'];
    }

    if (goog.isString(json['format'])) {
      this.format = json['format'];
    }

    if (goog.isDef(json['required'])) {
      this.required = json['required'];
    }

    if (goog.isString(json['description'])) {
      this.description = json['description'];
    }

    if (goog.isString(json['pattern'])) {
      this.pattern = json['pattern'];
    }

    if (goog.isString(json['minimum'])) {
      this.minimum = json['minimum'];
    }

    if (goog.isString(json['maximum'])) {
      this.maximum = json['maximum'];
    }

    if (goog.isDef(json['items'])) {
      this.items = new pstj.ds.discovery.Property('', json['items']);
    }

    // TODO: figure out how to use 'location' and 'repeated'.
  },

  /**
   * Provides the assigment for 'toJSON' class method.
   * @return {string}
   */
  getToJSONAssignment: function() {
    var line = '\'' + this.name + '\': ';
    line += this.getToJSONRighthandAssignment();
    return line;
  },

  /**
   * Provides the right hand assignment for toJSON method.
   * @return {string}
   */
  getToJSONRighthandAssignment: function() {
    if (this.isReferenceType()) {
      return 'this.' + this.name;
    } else if (this.type == 'number') {
      return 'this.' + this.name;
    } else if (this.type == 'integer') {
      return 'parseInt(this.' + this.name + ', 10)';
    } else if (this.type == 'boolean') {
      return 'this.' + this.name;
    } else if (this.type == 'string') {
      return 'this.' + this.name;
    } else if (this.type == 'array') {
      return 'this.' + this.name;
    }
  },

  /**
   * Given the type and format as designated in the schema we deduce the
   * JSType for JSDoc annotation.
   *
   * Note that the type will always be local, i.e. check if the type is a
   * reference type to attach it to a namespace in the generator is you need it.
   *
   * @param {string} namespace The namespace in which to wrap the reference
   * types.
   * @return {string}
   */
  getClosureType: function(namespace) {
    var required = this.required ? '!' : '';
    if (this.isReferenceType()) {
      return '!' + namespace + this.ref;
    }
    if (this.type == 'string') {
      if (!goog.isNull(this.format)) {
        if (this.format == 'date') {
          // TODO: consider goog.date.Date / DateTime as replacement.
          return '!Date';
        } else if (this.format == 'date-time') {
          return '!Date';
        } else {
          // TODO: consider goog.math.Long for 64 bits numbers sent as strings.
          return required + 'string';
        }
      } else {
        return 'string';
      }
    } else if (this.type == 'number') {
      // Number is always 'number' in JS, both double and float.
      return required + 'number';
    } else if (this.type == 'integer') {
      // integer is always 'number' in JS, both int32 and uint32.
      return required + 'number';
    } else if (this.type == 'boolean') {
      return required + 'boolean';
    } else if (this.type == 'array') {
      if (this.items) {
        var atype = this.items.getClosureType(namespace);
        return '!Array<' + atype + '>';
      } else {
        console.warn('This should not happen!');
        return '!Array';
      }
    } else {
      // We cannot determine the JSType for some reason, maybe a bug?
      throw new Error('Cannot determine type, type:' + this.type + ', ref: ' +
          this.ref);
    }
  },

  getClosureConstrutorType: function(ns) {
    var result = this.getClosureType(ns);
    if (result[0] == '!') result = result.substr(1);
    return result;
  },

  /**
   * Generates a default value for property.
   * @param  {string} namespace Optional namespace to use when creating
   * referenced instances.
   * @return {string}
   */
  getClosureDefaultValue: function(namespace) {
    if (this.isReferenceType()) {
      return 'new ' + namespace + this.ref + '()';
    } else if (this.type == 'number') {
      return '0.0';
    } else if (this.type == 'integer') {
      return '0';
    } else if (this.type == 'boolean') {
      return 'false';
    } else if (this.type == 'array') {
      return '[]';
    } else if (this.type == 'string') {
      if (this.format == 'date' || this.format == 'date-time') {
        return 'new Date()';
      } else return '\'\'';
    }
  },

  /**
   * Checks if the type of the property is a reference type.
   *
   * Reference types are presented as other classes in the DTO list.
   * @return {boolean}
   */
  isReferenceType: function() {
    return (!goog.isNull(this.ref));
  }

});
