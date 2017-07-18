/**
 * @fileoverview Provides the base class for parsers. Encompases the very basic
 * parsing of fields and structure as well as methods to override for specific
 * parsers.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.codegen.parser.Base');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.debug');
goog.require('goog.log');
goog.require('goog.object');
goog.require('pstj.codegen.IParser');
goog.require('pstj.codegen.node.Class');
goog.require('pstj.codegen.node.Document');
goog.require('pstj.codegen.node.Property');
goog.require('pstj.codegen.node.type');
goog.require('pstj.codegen.util');


/** @implements {pstj.codegen.IParser} */
pstj.codegen.parser.Base = class {
  /** @param {!Object<string, ?>} map The map to work with. */
  constructor(map) {
    /** @protected {!Object<string, ?>} */
    this.map = map;
    /** @protected {?pstj.codegen.node.Document} */
    this.document = null;
    /** @protected {?goog.debug.Logger} */
    this.logger = goog.log.getLogger('pstj.codegen.parser.Base');
  }


  /**
   * Lazily construct the document and return it.
   *
   * @return {!pstj.codegen.node.Document}
   */
  getDocument() {
    if (goog.isNull(this.document)) {
      this.document = new pstj.codegen.node.Document();
      this.parse();
    }
    return goog.asserts.assertInstanceof(
        this.document, pstj.codegen.node.Document);
  }


  /** @protected */
  parse() { this.parseDtoMap(this.getDtoMap()); }


  /**
   * Should return an object with keys being the name of the DTO class / object
   * and values being a description of a DTO object to create.
   *
   * Override this method if your map holds that construct elsewhere.
   *
   * @protected
   * @return {!Object<string, !Object>}
   */
  getDtoMap() { return this.map; }


  /**
   * Assign a DTO class to the document.
   *
   * @protected
   * @param {string} name The name of the class to use.
   * @param {!pstj.codegen.node.Class} instance
   */
  addDtoClassToDocument(name, instance) {
    goog.object.add(this.document.classes, name, instance);
  }


  /**
   * Given an object of names-DTO descriptors parses it into the document.
   *
   * @param {!Object<string, !Object>} map
   * @protected
   */
  parseDtoMap(map) {
    goog.object.forEach(map, dto => {
      goog.asserts.assertObject(dto, 'The DTO descriptor should be an object');
      if (goog.isString(dto['type'])) {
        switch (dto['type']) {
          case 'object':
            let _class = this.parseDtoAsClass(dto);
            this.addDtoClassToDocument(_class.name, _class);
            break;
          default:
            throw new Error(
                `Does not know how to parse DTO of type ${dto['type']}`);
        }
      } else {
        if (goog.DEBUG) {
          goog.log.error(this.logger, goog.debug.deepExpose(dto));
        }
        throw new Error('Cannot handle DTO descriptor without a type');
      }
    });
  }


  /**
   * Given the map (serialized version of DTO), attempts to create the
   * class representation of it.
   *
   * @protected
   * @param {!Object<string, ?>} dto
   * @return {!pstj.codegen.node.Class}
   */
  parseDtoAsClass(dto) {
    let cl = new pstj.codegen.node.Class();
    if (goog.isString(dto['title'])) {
      cl.name = dto['title'];
    } else {
      throw new Error('Cannot parse DTO descriptor without \'title\'');
    }
    cl.description = this.getDescriptionFromMap(dto);

    // Gather all the properties - the class fields.
    if (goog.isObject(dto['properties'])) {
      goog.object.forEach(dto['properties'], (prop, name) => {
        cl.properties.push(this.parseMapAsProperty(prop, name));
      });
      if (goog.isArray(dto['required'])) {
        goog.array.forEach(dto['required'], req => {
          if (goog.isString(req)) {
            let prop = goog.array.find(cl.properties, prop => prop.name == req);
            if (!goog.isNull(prop)) prop.required = true;
          }
        });
      }
    }
    return cl;
  }


  /**
   * Given an object describing a property in a DTO class parses it and
   * returns the property.
   *
   * @protected
   * @param {!Object<string, ?>} map
   * @param {string} name
   * @return {!pstj.codegen.node.Property}
   */
  parseMapAsProperty(map, name) {
    let prop = new pstj.codegen.node.Property();
    prop.name = name;
    prop.type = pstj.codegen.util.getPropertyType(map['type']);
    prop.description = this.getDescriptionFromMap(map);

    if (prop.type == pstj.codegen.node.type.NUMBER ||
        prop.type == pstj.codegen.node.type.INT) {
      if (goog.isNumber(map['minimum'])) prop.minimum = map['minimum'];
      if (goog.isNumber(map['maximum'])) prop.maximum = map['maximum'];
    }

    if (prop.type == pstj.codegen.node.type.STRING) {
      if (goog.isString(map['pattern'])) prop.pattern = map['pattern'];
    }

    if (goog.isString(map['format'])) {
      prop.format =
          pstj.codegen.util.getFormatForType(prop.type, map['format']);
    }

    if (prop.type == pstj.codegen.node.type.ARRAY) {
      if (goog.isObject(map['items'])) {
        if (goog.isString(map['items']['type'])) {
          prop.itemType = pstj.codegen.util.getPropertyType(map['items']['type']);
          if (prop.itemType == pstj.codegen.node.type.OBJECT) {
            prop.referredType = this.getReferredType(map['items']);
          }
        } else {
          throw new Error('Array items must have type');
        }
      } else {
        throw new Error('Array property must have \'items\' config.');
      }
    }

    if (prop.type == pstj.codegen.node.type.OBJECT) {
      prop.referredType = this.getReferredType(map);
    }

    return prop;
  }


  /**
   * Extracted way to get the reference type, we do this to allow subclasses
   * to define other type of provifing reference.
   *
   * Note that in this default implementation we use the 'discovery' format
   * which means that the type will be the name of the class without anything
   * else.
   *
   * In Sysmaster format the $_reference notation is used and it points to a
   * file name instead of class name as one file represents one class.
   *
   * In Swagger the $ref notation is used but it points to JSON Path (i.e.
   * #/definitions/SomeObject). The document however keeps only one thing -
   * the name of the class (as in discovery) so one might need to convert.
   *
   * @protected
   * @param {!Object<string, ?>} map
   * @return {string}
   */
  getReferredType(map) {
    if (goog.isString(map['$ref'])) return map['$ref'];
    if (goog.DEBUG) {
      goog.log.error(this.logger, goog.debug.deepExpose(map));
    }
    throw new Error('There seem to be no referred type here');
  }


  /**
   * Helper method, extract the description if any keeping the type
   * the same.
   *
   * @protected
   * @param {!Object<string, ?>} map
   * @return {string}
   */
  getDescriptionFromMap(map) {
    if (goog.isString(map['description'])) return map['description'];
    return '';
  }
};
