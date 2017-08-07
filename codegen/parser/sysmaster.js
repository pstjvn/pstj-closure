/**
 * @fileoverview Provides customization to accomodate parsing of Sysmaster
 * specific JSONSchema attributes and values.
 *
 * The following customizations are supported:
 * - "required" field can be an array of only one value "$_all" meaning consider
 * all class fields to be required.
 * - "$_reference" as field type to signify reference to another class type
 * referenced in an external file. The reference is denoted by file name,
 * assuming all files are in a flat directory strucure. If those are not
 * only the filename is considered and path is ignored.
 * - "$_name" to denote a different local name for a field. This is useful for
 * cases when the data structure on the remote is already existing but the
 * UI binding is also already existing and we want to massage the class to
 * match UI binding instead of chaning the bindings or the remote naming.
 * - "$_type" - allows for local type conversion, useful if the remote wants to
 * store the data in a type that is not useful for us and we want to convert
 * to a type that is useful for us without actually write the code ourselves.
 * The following conversions are supported: string to (number|boolean|Date),
 * number to (string|Date|boolean). Additionally number to int and int to number
 * is added, but no uses in any codebase are known.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */
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
    // Allow switching the local name
    if (goog.isString(map['$_name'])) {
      if (goog.string.isEmptyOrWhitespace(map['$_name'])) {
        throw new Error('Custom $_name cannot be empty string');
      }
      p.desiredName = map['$_name'];
    }
    // Allow converting to a different local type
    if (goog.isString(map['$_type'])) {
      p.desiredType = this.getCustomDesiredType_(p.type, map['$_type']);
    }
    return p;
  }


  /** @override */
  parseDtoAsClass(dto) {
    let cl = super.parseDtoAsClass(dto);
    // Add support for marking all fields as required:
    // "required": ["$_all"]
    if (goog.isArray(dto['required']) && dto['required'].length == 1 &&
        dto['required'][0] == '$_all') {
      goog.array.forEach(cl.properties, prop => prop.required = true);
    }
    // record the source file name in case it is referred with "$_reference"
    if (goog.isString(dto['sourceFileName'])) {
      cl.sourceFileName = dto['sourceFileName'];
    } else {
      throw new Error(
          'Sysmaster parser expects DTO objectst to have source attribute');
    }
    return cl;
  }


  /** @override */
  getReferredType(map) {
    if (goog.isString(map['$_reference'])) return map['$_reference'];
    // fall throu to throwing the error.
    return super.getReferredType(map);
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
