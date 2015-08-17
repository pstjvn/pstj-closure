goog.provide('pstj.sourcegen.ClosureGenerator');

goog.require('goog.array');
goog.require('goog.object');
goog.require('pstj.sourcegen.ClosureBuffer');


/**
 * Provides the default DTO generator for closure.
 *
 * The generator takes a list of DTO definitions and outputs a comprehensive
 * closure style source file that contains the classes that represent the
 * DTO objects with assertions and types.
 *
 * TODO: Add support for rpc method generation.
 */
pstj.sourcegen.ClosureGenerator = goog.defineClass(null, {
  /**
   * @param {!pstj.ds.discovery.Document} document The discovery document as
   * parsed and processed.
   */
  constructor: function(document) {
    /**
     * The document we will be working with.
     * @type {!pstj.ds.discovery.Document}
     */
    this.doc = document;
    /**
     * The buffer to write to.
     *
     * Here we chose the closure buffer as it adds usable helper methods
     * to wrap closure specific code generation.
     *
     * If you need to generate code specific for other framework you should
     * extend the class and replace it in the constructor of your generator.
     * @type {!pstj.sourcegen.ClosureBuffer}
     */
    this.buffer = new pstj.sourcegen.ClosureBuffer();
    /**
     * The namespace under which we should provide all the items.
     * @type {string}
     */
    this.ownNamespace = [this.doc.name, this.doc.version].join('.');
    /**
     * The namespace in which to put all DTO objects.
     * @type {string}
     */
    this.dtoNamespace = this.ownNamespace + '.dto';
    /**
     * The namespace in which to put all first level methods from the document.
     * @type {string}
     */
    this.rpcNamespace = this.ownNamespace + '.rpc';
    /**
     * The default ns to extend for DTO classes.
     * @type {string}
     * @protected
     */
    this.defaultDtoExtend = 'pstj.ds.DtoBase';
    /**
     * The namespace of the assertion library used.
     * @type {string}
     */
    this.assertionNamespace = 'goog.asserts';
    /**
     * The namespace of the xhr library to use.
     * @type {string}
     */
    this.xhrNamespace = 'goog.labs.net.xhr';
    /**
     * List of namespaces used in the file.
     * @type {Array<string>}
     * @protected
     */
    this.requiredNamespaces = [
      this.assertionNamespace,
      this.xhrNamespace,
      'goog.array'];
    /**
     * If we are in scope. This is used to manage the local vs global
     * namespaces.
     * @type {boolean}
     * @private
     */
    this.inscope_ = false;
    /**
     * Consfiguration flag, if true the whole code will be wrapped in
     * goog.scope.
     * @type {boolean}
     */
    this.useScoping = true;
  },

  /**
   * Actually generate the file.
   */
  generate: function() {
    this.buffer.addEditWarning();
    this.lines(1);
    this.buffer.addFileoverview(this.doc.description);
    this.lines(1);
    this.generateProvideSection();
    this.lines(1);
    this.generateRequireSection();

    if (this.useScoping) this.scope();
    this.generateDtoClasses();
    this.generateDtoLists();

    // this.lines(2);
    // this.generateRpcClass();

    if (this.useScoping) this.unscope();
    return this.buffer.toString();
  },

  /**
   * Generates the DTO lists processing.
   */
  generateDtoLists: function() {
    goog.object.forEach(this.doc.lists, function(val, key) {
      this.generateDtoList(val);
    }, this);
  },

  /**
   * Generates a single list processing method.
   * @param  {pstj.ds.discovery.List} item The list item to use as blueprint.
   */
  generateDtoList: function(item) {
    var a = this.buffer.getScopedNamespaceIfInScope(this.assertionNamespace);
    var arr = this.buffer.getScopedNamespaceIfInScope('goog.array');
    var type = (item.isReferenceType() ?
        this.getGenerativeDTONamespace(item.getClosureType()) :
        item.getClosureType());
    this.lines(2);
    this.buffer.startComment();
    this.buffer.writeln(item.name + ': fromJSON implementation.');
    this.buffer.writeln('');
    this.buffer.writeln('@param {?} list The server-sent list.');
    this.buffer.writeln('@return {!Array<!' + type + '>}');
    this.buffer.endComment();

    this.buffer.writeln(this.getGenerativeDTONamespace(item.name) +
        'fromJSON = function(list) {');
    this.buffer.indent();
    this.buffer.writeln(a + '.assertArray(list);');
    // If we need to cenvert the types we need this.
    if (item.isReferenceType() || item.getClosureType() == 'Date') {
      this.buffer.writeln('var result = ' + arr + '.map(function(item) {');
      this.buffer.indent();
      this.buffer.writeln(a + this.getAssertForType((type == 'Date') ?
          item.type : 'object') + '(item);');
      this.buffer.writeln('var i = new ' + type + '();');
      this.buffer.writeln('i.fromJSON(item);');
      this.buffer.writeln('return i;');
      this.buffer.unindent();
      this.buffer.writeln('});');
      this.buffer.writeln('return /** @type {!Array<!' + type +
          '>} */(result);');
    } else {
      // If we are not in debug mode and the array type does not need
      // to be converted we can return the JSON generated list. However
      // if we are in debug mode we need to assert all items before
      // passing execution flow further.
      this.buffer.writeln('if (goog.DEBUG) {');
      this.buffer.indent();
      this.buffer.writeln(arr + '.forEach(list, function(item, i) {');
      this.buffer.indent();
      this.buffer.writeln(a + this.getAssertForType(item.type) +
          '(item, \'Item\' + i + \' is not a ' + item.getClosureType() +
          '\');');
      this.buffer.unindent();
      this.buffer.writeln('});');
      this.buffer.unindent();
      this.buffer.writeln('}');
      this.buffer.writeln('return /** @type {!Array<!' + item.getClosureType() +
          '>} */(list);');
    }
    this.buffer.unindent();
    this.buffer.writeln('};');
    // Lists do not need to convert back as their serialization takes care of
    // the 'toJSON' of complex items.
    this.lines(2);
    this.buffer.startComment();
    this.buffer.writeln(item.name + ': toJSON helper.');
    this.buffer.writeln('');
    this.buffer.writeln('@param {!Array<!' + type +
        '>} list Local checked list.');
    this.buffer.writeln('@return {!Array<!' + type + '>}');
    this.buffer.endComment();
    this.buffer.writeln(this.getGenerativeDTONamespace(item.name) +
        'toJSON = function(list) {');
    this.buffer.indent();
    this.buffer.writeln('return list;');
    this.buffer.unindent();
    this.buffer.writeln('};');
  },

  /**
   * Adds all required namespaces as 'goog.require' clauses.
   */
  generateRequireSection: function() {
    var rns = goog.array.clone(this.requiredNamespaces);
    if (this.defaultDtoExtend) {
      rns.push(this.defaultDtoExtend);
    }
    rns.sort();
    goog.array.forEach(rns, function(ns) {
      this.buffer.addRequireClause(ns);
    }, this);
  },

  /**
   * Adds all provides namespaces as 'goog.provide' symbols.
   */
  generateProvideSection: function() {
    var ns = [this.dtoNamespace, this.rpcNamespace];

    // Iterate over the DTO names and add them as provide clauses
    // for the compiler to locate them.At this stage the namespaces
    // should be fully qualified.
    goog.array.forEach(goog.object.getKeys(this.doc.classes), function(cn) {
      ns.push(this.getFullyQualifiedDtoNamespace(cn));
    }, this);

    ns.sort();

    goog.array.forEach(ns, function(ns) {
      this.buffer.addProvideClause(ns);
    }, this);
  },

  /**
   * Generates the class definitions for the DTO objects.
   */
  generateDtoClasses: function() {
    goog.object.forEach(this.doc.classes, function(value, key) {
      this.lines(2);
      this.generateDTOClass(value);
    }, this);
  },

  /**
   * Opens a scoped section in the buffer.
   * Additionally the names used will be scoped as well.
   */
  scope: function() {
    this.lines(1);
    this.buffer.addScopeNames(this.gatherScopeNames());
    this.buffer.startScopedSection();
    this.inscope_ = true;
  },

  /**
   * Closes the scope. Note that the buffer will not allow more than one scope
   * per file and will throw if we attempt a second one. Here we only use the
   * flag so we can manage namespaces more efficiently.
   */
  unscope: function() {
    this.inscope_;
    this.buffer.endScopedSection();
  },

  /**
   * Walks all classes and gathers the names that should be shortened.
   * @return {Array<string>}
   */
  gatherScopeNames: function() {
    var result = goog.array.clone(this.requiredNamespaces);
    if (this.defaultDtoExtend) {
      goog.array.insert(result, this.defaultDtoExtend);
    }
    result.push(this.rpcNamespace);
    result.push(this.dtoNamespace);
    result.sort();
    return result;
  },

  /**
   * Given a local DTO name returns a fully qualified namespace for it.
   * @param  {string} localname
   * @return {string}
   */
  getFullyQualifiedDtoNamespace: function(localname) {
    return this.dtoNamespace + '.' + localname;
  },

  /**
   * [function description]
   * @param  {[type]} localname [description]
   * @return {[type]}
   */
  getScopedDtoNamespace: function(localname) {
    return 'dto.' + localname;
  },

  /**
   * Given a short namespace (as taken from localized document) returns
   * a fully qualified namespace for DTO classes.
   * @param  {string} localname
   * @return {string}
   */
  getGenerativeDTONamespace: function(localname) {
    if (this.inscope_) {
      return this.getScopedDtoNamespace(localname);
    } else {
      return this.ownNamespace + '.dto.' + localname;
    }
  },

  /**
   * Generates the content of a full DTO class.
   * @param  {pstj.ds.discovery.Class} klass
   */
  generateDTOClass: function(klass) {
    this.generateClassJSDoc(klass);

    this.buffer.startClassDefinitionSection(
        this.getGenerativeDTONamespace(klass.name),
        (goog.isString(klass.extends) ? klass.extends : (
        (this.defaultDtoExtend ? this.defaultDtoExtend : null))));

    // Define the constructor.
    this.buffer.startConstructorSection();
    goog.array.forEach(klass.properties, function(prop) {
      this.generatePropertyJSDoc(prop);
      this.generatePropertyDefinition(prop);
    }, this);
    this.buffer.endConstructorSection();

    // Define methods.
    this.buffer.startFromJSONSection();
    this.generateFromJSONBody(klass);
    this.buffer.endFromJSONSection();

    this.buffer.startToJSONSection();
    this.generateToJsonBody(klass);
    this.buffer.endToJSONSection();

    this.buffer.endClassDefinitionSection();
  },

  /**
   * Generates the DTO -> Object tranformation.
   * @param {pstj.ds.discovery.Class} klass
   */
  generateToJsonBody: function(klass) {
    this.buffer.writeln('return {');
    this.buffer.indent();
    goog.array.forEach(klass.properties, function(prop) {
      this.buffer.writeln(prop.getToJSONAssignment() + ';');
    }, this);
    this.buffer.unindent();
    this.buffer.writeln('};');
  },

  /**
   * Getter for the items type.
   * @param  {string} type
   * @return {string}
   */
  getAssertForType: function(type) {
    switch (type) {
      case 'number':
      case 'integer':
        return '.assertNumber';
      case 'string': return '.assertString';
      case 'boolean': return '.assertBoolean';
      case 'array': return '.assertArray';
      case 'object': return '.assert';
      default: throw new Error('Unknown type for assertion: ' + type);
    }
  },

  getArrayType: function(prop) {
    if (prop.items.isReferenceType()) {
      return prop.items.getClosureConstrutorType(
          this.getGenerativeDTONamespace(''));
    }
  },

  /**
   * Extracted mthod that generated the code for iterating over an array and
   * generates the loal DTO array.
   * @param  {pstj.ds.discovery.Property} prop
   */
  generateArrayFromMap: function(prop) {
    var asserts = (this.inscope_) ?
        this.buffer.getScopedNamespace(this.assertionNamespace) :
        this.assertionNamespace;
    if (prop.items.isReferenceType()) {
      this.buffer.writeln('    var i = new ' + this.getArrayType(prop) + '();');
      this.buffer.writeln('    i.fromJSON(' + asserts +
          '.assertObject(item));');
      this.buffer.writeln('    this.' + prop.name + '.push(i);');
    } else {

      var isDate = (prop.items.type == 'string' &&
          (prop.items.format == 'date' || prop.items.format == 'date-time'));
      this.buffer.writeln('    this.' + prop.name + '.push(' +
          (isDate ? 'new Date(' : '') +
          asserts + this.getAssertForType(prop.items.type) + '(item))' +
          (isDate ? ')' : '') +
          ');');
    }
  },

  /**
   * Generates the map to class instance assigments.
   * @param  {pstj.ds.discovery.Class} klass
   */
  generateFromJSONBody: function(klass) {
    var asserts = (this.inscope_) ?
        this.buffer.getScopedNamespace(this.assertionNamespace) :
        this.assertionNamespace;

    var arr = (this.inscope_) ?
        this.buffer.getScopedNamespace('goog.array') :
        'goog.array';
    goog.array.forEach(klass.properties, function(prop) {
      var line = 'this.' + prop.name;

      // If prop is a reference type we need to make sure that the
      // value is an object (assert) and pass it to the toJSON.
      if (prop.isReferenceType()) {
        line += '.fromJSON(' +
            asserts + '.assert(' + 'map[\'' + prop.name + '\']))';
      } else if (prop.type == 'array') {
        this.buffer.writeln(arr + '.clear(this.' + prop.name + ');');
        // Wrap in conditional if the prop is not required it might be missing.
        if (!prop.required) {
          this.buffer.writeln('if (goog.isArray(map[\'' + prop.name +
              '\'])) {');
          this.buffer.indent();
        }

        this.buffer.writeln(arr + '.forEach(' + asserts + '.assertArray' +
            '(map[\'' + prop.name + '\']),');
        this.buffer.writeln('    function(item) {');
        this.buffer.indent();
        this.generateArrayFromMap(prop);
        this.buffer.unindent();
        this.buffer.writeln('    }, this);');

        // Unrap in conditional if the prop is not required it might be missing.
        if (!prop.required) {
          this.buffer.unindent();
          this.buffer.writeln('}');
        }
        // Break the execution here, we have done everything needed.
        return;
      } else {
        line += ' = ';
        switch (prop.type) {
          case 'integer':
          case 'number':
            line += asserts + '.isNumber(map[\'' + prop.name + '\'])';
            break;
          case 'boolean':
            line += asserts + '.isBoolean(map[\'' + prop.name + '\'])';
            break;
          case 'string':
            if (prop.format == 'date' || prop.format == 'date-time') {
              line += 'new Date(' + asserts + '.isString(map[\'' + prop.name +
                  '\']))';
            } else {
              line += asserts + '.isString(map[\'' + prop.name + '\'])';
            }
            break;
        }
      }
      line += ';';
      this.buffer.writeln(line);
    }, this);
    this.buffer.writeln('goog.base(this, \'fromJSON\', map);');
  },

  /**
   * Generates the documentation for a property.
   * @param  {pstj.ds.discovery.Property} prop
   */
  generatePropertyJSDoc: function(prop) {
    var comment = [];
    if (prop.description) {
      comment.push(prop.description);
    }
    var jstype = prop.getClosureType(this.getGenerativeDTONamespace(''));
    comment.push('@type {' + jstype + '}');
    if (comment.length == 1) {
      this.buffer.singleLineComment(comment[0]);
    } else {
      this.buffer.startComment();
      goog.array.forEach(comment, goog.bind(this.buffer.writeln, this.buffer));
      this.buffer.endComment();
    }
  },

  /**
   * Generates the definition of a property (its default value as well)
   * usually in the context of the constructor function.
   * @param  {pstj.ds.discovery.Property} property
   */
  generatePropertyDefinition: function(property) {
    var line = 'this.' + property.name + ' = ' +
        property.getClosureDefaultValue(this.getGenerativeDTONamespace(''));
    line += ';';
    this.buffer.writeln(line);
  },

  /**
   * Generates the JSdoc comment for a DTO class.
   * @param  {pstj.ds.discovery.Class} klass
   */
  generateClassJSDoc: function(klass) {
    this.buffer.startComment();
    if (klass.description) this.buffer.writeln(klass.description);
    if (goog.isString(klass.extends)) {
      this.buffer.addExtendsJSDoc(klass.extends);
    } else if (this.defaultDtoExtend) {
      this.buffer.addExtendsJSDoc(this.defaultDtoExtend);
    }
    this.buffer.endComment();
  },


  /**
   * Prints empty lines in the buffer.
   * @param  {number} num Number of empty lines ot add.
   */
  lines: function(num) {
    while (num > 0) {
      this.buffer.writeln();
      num--;
    }
  },

  generateRpcClass: function() {
    this.buffer.writeln('// RPC method definitions');
  }
});
