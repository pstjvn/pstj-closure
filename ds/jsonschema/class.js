/**
 * @fileoverview Provides the implementation for class representation on top
 * of a write buffer so the class can be printed out as JSSource.
 */

goog.provide('pstj.ds.jsonschema.Class');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('pstj.ds.jsonschema.Buffer');
goog.require('pstj.ds.jsonschema.resolver');

goog.scope(function() {
var Buffer = pstj.ds.jsonschema.Buffer;


/** @extends {Buffer} */
pstj.ds.jsonschema.Class = goog.defineClass(Buffer, {
  /**
   * @param {string} nsPrefix The namespace under which to create the
   *    class definition.
   */
  constructor: function(nsPrefix) {
    Buffer.call(this);
    /**
     * References the raw object that is used to generate this class.
     * @type {Object?}
     */
    this.sourceobj_ = null;
    /**
     * The namespace prefix to use.
     * @type {string}
     */
    this.nsPrefix_ = nsPrefix;
    /**
     * List of namespaces required for this class to work.
     * @type {Array<string>}
     * @private
     */
    this.required_ = [];


    /**
     * The full namespace of the class.
     * @type {string}
     */
    this.namespace = '';
    /**
     * The class name (short class name).
     * @type {string}
     */
    this.classname = '';
    /**
     * The description of the class.
     * @type {string}
     */
    this.description = '';
    /**
     * The class that we extend in our implementation.
     * Should be the full namespace of the extended class.
     * @type {string}
     * @private
     */
    this.extends_ = 'pstj.ds.DtoBase';
    /**
     * Contains all properties for this class.
     * @type {Array<pstj.ds.jsonschema.Property>}
     * @protected
     */
    this.properties = [];

    // Initialize the class independent features.
    this.init();
  },

  /**
   * Prints some clauses that are always used in classes.
   * @protected
   */
  init: function() {
    this.addRequiredNamespace('goog.asserts');
    this.addEmptyLine();
    this.addLine('// This code is auto generate, please do not edit.');
    this.addEmptyLine();
  },

  /**
   * Sets the raw object to be used as definition source.
   * @param {!Object} obj
   */
  setSourceDefinition: function(obj) {
    goog.asserts.assertObject(obj);
    this.sourceobj_ = obj;
    this.setClassName_();
    this.setDescription_();
  },

  /**
   * Generates the properies for this class.
   */
  createProperties: function() {
    // We cheat here a little bit, we need all classes to be resolved for this
    // to work so we moved it here evenif it is not part of the creation.
    this.setExtendedType_();

    if (!this.sourceobj_) {
      throw new Error('You need to first configure the class');
    }
    var obj = this.sourceobj_;
    goog.asserts.assertObject(obj['properties']);
    var required = obj['required'];
    var reqall = required && goog.isString(required) && required == '$_all';
    var reqarr = goog.isArray(required);
    // Pushes once for each property. The property class should handle the value
    // map as an object.
    goog.object.forEach(obj['properties'], function(value, key) {
      var instance = new pstj.ds.jsonschema.Property();
      instance.configure(value, key);
      if (reqall) instance.required = true;
      else if (reqarr && goog.array.contains(required, key)) {
        instance.required = true;
      }
      this.addProperty(instance);
    }, this);
  },

  /**
   * Adds a new proeprty to the class. If the property is a named type or
   * a list of a named type it will be added as required namespace.
   * @param {pstj.ds.jsonschema.Property} prop
   */
  addProperty: function(prop) {
    this.properties.push(prop);
    if (prop.isReferencedType()) {
      this.addRequiredNamespace(prop.getReferenceType());
    }
    if (prop.type == 'array') {
      this.addRequiredNamespace('goog.array');
    }
  },

  /**
   * Prints the heading of the file.
   */
  printHeader: function() {
    this.printProvides();
    this.addEmptyLine();
    this.printRequires();
    this.addEmptyLine();
    this.addEmptyLine();
    this.openScope();
  },

  /**
   * Performs the actual printing.
   */
  print: function() {
    this.printHeader();
    this.printClass();
    this.printFooter();
    // dumping should be overriden to allow wrting to files.
    this.dump();
  },

  /**
   * Prints the footing of the file.
   */
  printFooter: function() {
    this.closeScope();
  },

  /**
   * Add a namespace to the list of required namespaces for this class.
   * No duplicates will be added.
   * @param {string} namespace
   */
  addRequiredNamespace: function(namespace) {
    if (!goog.array.contains(this.required_, namespace)) {
      this.required_.push(namespace);
    }
  },

  /**
   * Opens the goog scoped section.
   */
  openScope: function() {
    this.addLine('goog.scope(function() {');
    this.addLine('var a = goog.asserts;');
    this.addEmptyLine();
    this.addEmptyLine();
  },

  /**
   * Closes the google scope.
   */
  closeScope: function() {
    this.addLine('});  // goog.scope');
    this.addEmptyLine();
  },

  /**
   * Updates the class name and namespace of the class definition to match the
   * source definition.
   * @private
   */
  setClassName_: function() {
    var cname = this.sourceobj_['title'];
    if (!goog.isString(cname)) {
      throw new Error('Class definition does not include name');
    }
    this.classname = cname;
    this.namespace = this.nsPrefix_ + '.' + cname;
  },

  /**
   * @private
   */
  setDescription_: function() {
    var desc = this.sourceobj_['description'];
    if (goog.isString(desc)) {
      this.description = desc;
    }
  },

  /**
   * @private
   */
  setExtendedType_: function() {
    if (goog.isString(this.sourceobj_['$_extends'])) {
      var klass = pstj.ds.jsonschema.resolver.resolve(
          this.sourceobj_['$_extends']);
      if (klass) this.extends_ = klass.namespace;
      else throw new Error('Cannot resolve extend clause: ' +
          this.sourceobj_['$_extends']);
    }
  },

  /**
   * Prints out the provide statement for the class.
   */
  printProvides: function() {
    this.addLine('goog.provide(\'' + this.namespace + '\');');
  },

  /**
   * Prints the list of required namespaces for the class.
   */
  printRequires: function() {
    // Always add the namespace that we are extending.
    this.addRequiredNamespace(this.extends_);
    if (this.extends_ != 'pstj.ds.DtoBase') {
      this.addRequiredNamespace('goog.object');
    }
    // first sort the namespaces for the linter.
    this.required_.sort();

    goog.array.forEach(this.required_, function(req) {
      this.printRequire(req);
    }, this);
  },

  /**
   * Prints a single require statement.
   * @param {string} ns The namespace to require.
   */
  printRequire: function(ns) {
    this.addLine('goog.require(\'' + ns + '\');');
  },

  /**
   * Generates the class implementation.
   */
  printClass: function() {
    this.printExtendComment();
    this.startClassDefinition();

    this.startConstructor();
    goog.array.forEach(this.properties, function(prop) {
      prop.printType(this);
    }, this);
    this.endConstructor();
    this.addEmptyLine();

    this.startFromJson();
    goog.array.forEach(this.properties, function(prop) {
      prop.printFromMap(this);
    }, this);
    this.endFromJson();
    this.addEmptyLine();

    this.startToJson();
    var len = this.properties.length - 1;
    goog.array.forEach(this.properties, function(prop, i) {
      prop.printToMap(this, (i < len));
    }, this);
    this.endToJson();
    this.endClassDefinition();
  },

  /**
   * Getter fpr the extend clause to use for the class.
   * @return {string}
   */
  getExtendsClause: function() {
    return '@extends {' + this.extends_ + '}';
  },

  /**
   * Prints out the extend clause of the class documentation.
   */
  printExtendComment: function() {
    if (goog.string.isEmpty(this.description)) {
      this.addSingleLineComment(this.getExtendsClause());
    } else {
      this.startComment();
      this.addLine(this.description);
      this.addLine(this.getExtendsClause());
      this.endComment();
    }
  },

  /**
   * Prints out the beggining of the class definition.
   */
  startClassDefinition: function() {
    this.addLine(this.namespace + ' = goog.defineClass(' +
        this.extends_ + ', {');
    this.indent();
  },

  /**
   * Ends the class definition.
   */
  endClassDefinition: function() {
    this.unindent();
    this.addLine('});');
  },

  /** @protected */
  addExtends: function() {
    this.addLine(this.extends_ + '.call(this);');
  },

  /** @protected */
  startConstructor: function() {
    this.addLine('constructor: function() {');
    this.indent();
    this.addExtends();
  },

  /** @protected */
  endConstructor: function() {
    this.unindent();
    this.addLine('},');
  },

  /** @protected */
  startFromJson: function() {
    this.addSingleLineComment('@override');
    this.addLine('fromJSON: function(map) {');
    this.indent();
  },

  /** @protected */
  endFromJson: function() {
    this.addLine('goog.base(this, \'fromJSON\', map);');
    this.unindent();
    this.addLine('},');
  },

  /** @protected */
  startToJson: function() {
    this.addSingleLineComment('@override');
    this.addLine('toJSON: function() {');
    this.indent();
    if (this.extends_ == 'pstj.ds.DtoBase') {
      this.addLine('return {');
    } else {
      this.addLine('var exports = {');
    }
    this.indent();
  },

  /** @protected */
  endToJson: function() {
    this.unindent();
    this.addLine('};');
    if (this.extends_ != 'pstj.ds.DtoBase') {
      this.addLine('goog.object.extend(exports,' +
          '\n        a.assertObject(goog.base(this, \'toJSON\')));');
      this.addLine('return exports;');
    }
    this.unindent();
    this.addLine('}');
  }
});
});  // goog.scope
