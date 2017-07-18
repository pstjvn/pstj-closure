goog.provide('pstj.codegen.parser.Sysmaster');

goog.require('goog.array');
goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.string');
goog.require('pstj.codegen.node.type');
goog.require('pstj.codegen.parser.Base');
goog.require('pstj.codegen.util');


pstj.codegen.parser.Sysmaster = class extends pstj.codegen.parser.Base {
  /**
   * @param {!Object<string, ?>} map The map to work with.
   */
  constructor(map) {
    super(map);
    /** @override */
    this.logger = goog.log.getLogger('pstj.codegen.parser.Sysmaster');
  }


  /**
   * We need to override this, the name we will be looking up the classes by
   * is not the class name but the file name (sysmster specific) and thus
   * we use that for the mapping. Code emitters should always use the name
   * set up in the Class node.
   *
   * @override
   */
  addDtoClassToDocument(name, instance) {
    goog.object.add(this.document.classes, instance.sourceFileName, instance);
  }


  /** @override */
  parseMapAsProperty(map, name) {
    let p = super.parseMapAsProperty(map, name);
    if (goog.isString(map['$_name'])) {
      if (goog.string.isEmptyOrWhitespace(map['$_name'])) {
        throw new Error('Custom $_name cannot be empty string');
      }
      p.desiredName = map['$_name'];
    }
    if (goog.isString(map['$_type'])) {
      p.desiredType = this.getCustomDesiredType_(p.type, map['$_type']);
    }
    return p;
  }


  /** @override */
  parseDtoAsClass(dto) {
    let cl = super.parseDtoAsClass(dto);
    if (goog.isArray(dto['required']) && dto['required'].length == 1 &&
        dto['required'][0] == '$_all') {
      goog.array.forEach(cl.properties, prop => prop.required = true);
    }
    if (goog.isString(dto['sourceFileName'])) {
      cl.sourceFileName = dto['sourceFileName'];
    } else {
      throw new Error('Sysmaster parser expects DTO objectst to have source attribute');
    }
    return cl;
  }


  /**
   * Conversion from and to OBJECT and ARRAY is not allowed. Exception is
   * convertion to Date objects which is usually done with `format` but in
   * Sysmaster it is done ad-hoc. All those are Sysmaster specific conversion,
   * but because it is useful to have number-string-boolean conversion option
   * in the client, those can be used to post-convert objects.
   *
   * This should be handled by the emitter as well.
   *
   * Note that this conversion will take precedance and override the `format`
   *
   * @private
   * @param {pstj.codegen.node.type} type The original type.
   * @param {string} targetType The type we want to go to.
   * @return {pstj.codegen.node.type}
   */
  getCustomDesiredType_(type, targetType) {
    if (type == pstj.codegen.node.type.OBJECT ||
        type == pstj.codegen.node.type.ARRAY) {
      throw new Error(`Cannot convert from Object/Array to ${targetType}`);
    }
    if (targetType == 'object' || targetType == 'array') {
      throw new Error(`Cannot convert to Object/Array from ${type}`);
    }
    // String can convert to Number, Boolean, Int or Date.
    // Number can convert to string, Date, Boolean or Int
    // Int can convert ot String, Date, Boolean, or Number
    if ((type == pstj.codegen.node.type.STRING &&
         (targetType == 'number' || targetType == 'boolean' ||
          targetType == 'Date' || targetType == 'integer')) ||
        (type == pstj.codegen.node.type.NUMBER &&
         (targetType == 'string' || targetType == 'Date' ||
          targetType == 'boolean' || targetType == 'integer')) ||
        (type == pstj.codegen.node.type.INT &&
         (targetType == 'string' || targetType == 'Date' ||
          targetType == 'boolean' || targetType == 'number'))) {
      return pstj.codegen.util.getPropertyType(targetType);
    } else {
      throw new Error(`Cannot convert ${type} to ${targetType}`);
    }
  }
};
