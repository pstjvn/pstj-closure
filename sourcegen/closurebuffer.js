/**
 * @fileoverview Provides a tweaked JS file generator that supports closure
 * library specific annotations and constructs.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */
goog.provide('pstj.sourcegen.ClosureBuffer');

goog.require('goog.array');
goog.require('goog.object');
goog.require('pstj.sourcegen.JSBuffer');


goog.scope(function() {
var JSBuffer = pstj.sourcegen.JSBuffer;


/**
 * Provides implementation for buffered creation of Closure library specific
 * JS files.
 *
 * Intrinsically the implementation supports require / provide clauses.
 */
pstj.sourcegen.ClosureBuffer = goog.defineClass(JSBuffer, {
  constructor: function() {
    JSBuffer.call(this);
    /**
     * The namespace to extend in the DTO class.
     *
     * The default is the base DTO class in the pstj library as it provides
     * additional functionality for emitting events when the same instance is
     * being updated from a map/json.
     *
     * @type {string}
     */
    this.extendsNamespace = 'pstj.ds.DtoBase';
    /**
     * Flag if we are in a scoped section.
     * @type {boolean}
     * @protected
     */
    this.inscope = false;
    /**
     * Flag if the scope has already been used once in the file.
     * @type {boolean}
     * @private
     */
    this.scopeWasUsed_ = false;
    /**
     * The map for retrieving short names for namespaces.
     * @type {!Object<string, string>}
     * @private
     */
    this.shortmap_ = {};
    /**
     * The map for retrieving full namespaces from shot names.
     * @type {!Object<string, string>}
     * @private
     */
    this.longmap_ = {};
    /**
     * The regular expression for shortening the namespaces.
     * @type {!RegExp}
     * @private
     */
    this.re_ = /.*\.([^.]*)/;
  },

  /**
   * Add a require clause to the output.
   * @param  {string} namespace The fully qualified namespace to require.
   */
  addRequireClause: function(namespace) {
    this.writeln('goog.require(\'' + namespace + '\');');
  },

  /**
   * Adds a provide clause to the output.
   * @param  {string} namespace The namespace we are providing.
   */
  addProvideClause: function(namespace) {
    this.writeln('goog.provide(\'' + namespace + '\');');
  },

  /**
   * Constructs an extend clause to be added to classes.
   * @param  {string} namespace The namespace to extend.
   * @return {string}
   */
  getExtendsJSDoc: function(namespace) {
    if (this.inscope) {
      namespace = this.getScopedNamespace(namespace);
    }
    return '@extends {' + namespace + '}';
  },

  /**
   * Adds an extends JSDoc clause.
   * @param  {string} namespace The namespace to extend
   */
  addExtendsJSDoc: function(namespace) {
    var ex = this.getExtendsJSDoc(namespace);
    this.writeln(ex);
  },

  /** Helper fn. */
  startToJSONSection: function() {
    this.addMethodSpacing();
    this.singleLineComment('@override');
    this.startMethodBody('toJSON', '');
  },

  /** Helper fn. */
  endToJSONSection: function() {
    this.endMethodBody();
  },

  /** Helper fn. */
  startFromJSONSection: function() {
    this.addMethodSpacing();
    this.singleLineComment('@override');
    this.startMethodBody('fromJSON', 'map');
  },

  /** Helper fn. */
  endFromJSONSection: function() {
    this.endMethodBody();
  },

  /** Helper fn. */
  startScopedSection: function() {
    if (this.indentation != 0) {
      throw new Error('Scopes can be opened only on top level in file');
    }
    if (this.scopeWasUsed_) {
      throw new Error('Scope can be used only once in a file');
    }
    this.scopeWasUsed_ = true;
    this.inscope = true;
    this.writeln('goog.scope(function() {');
    goog.object.forEach(this.shortmap_, function(value, key) {
      this.writeln('var ' + value + ' = ' + key + ';');
    }, this);
  },

  /** Helper fn. */
  endScopedSection: function() {
    if (this.inscope) {
      this.writeln('});  // goog.scope');
      this.inscope = false;
    }
  },

  /**
   * Starts the section of the constructor body.
   * @param  {string=} opt_extendClass Optional namespace the constructor should
   * extend.
   */
  startConstructorSection: function(opt_extendClass) {
    this.startMethodBody('constructor', '');
    if (goog.isDef(opt_extendClass)) {
      this.addExtendsCall(opt_extendClass);
    }
  },

  /**
   * Ends the constructior body.
   */
  endConstructorSection: function() {
    this.endMethodBody();
  },

  /**
   * Adds spacing for a next method to be put.
   */
  addMethodSpacing: function() {
    this.buffer.push(',\n');
    this.writeln();
  },

  /**
   * Opens up a new method body.
   * @param  {string} mname  The method name.
   * @param  {string} params A string representation of the parameters.
   */
  startMethodBody: function(mname, params) {
    this.writeln(mname + ': function(' + params + ') {');
    this.indent();
  },

  /**
   * Ends the method body.
   */
  endMethodBody: function() {
    this.unindent();
    this.write('}');
  },

  /**
   * Starts a new class definition.
   * @param  {string} namespace   The namespace for the new class.
   * @param  {?string=} opt_extendClass The namespace the class is extending.
   */
  startClassDefinitionSection: function(namespace, opt_extendClass) {
    // By deault extend null object;
    if (!goog.isDef(opt_extendClass)) opt_extendClass = 'null';

    if (this.inscope) {
      opt_extendClass = this.getScopedNamespace(goog.asserts.assertString(
          opt_extendClass));
    }

    var line = namespace + ' = goog.defineClass(' + opt_extendClass + ', {';
    this.writeln(line);
    this.indent();
  },

  /**
   * Ends a class definition section.
   */
  endClassDefinitionSection: function() {
    this.writeln();
    this.unindent();
    this.writeln('});');
  },

  /**
   * Writes the call to the parent class.
   * @param  {string} namespace The parent class definition.
   */
  addExtendsCall: function(namespace) {
    if (this.inscope) namespace = this.getScopedNamespace(namespace);
    this.writeln(namespace + '.call(this);');
  },

  /**
   * Given a fully qualified namespace returns a scoped variance of it.
   * If the namespace cannot be folded it is retuned as it is.
   *
   * Examples:
   * 'my.deeply.nested.Name' -> 'Name';
   * 'MyNameSpace' -> 'MyNameSpace'
   *
   * @param  {string} namespace The namespace to shorten.
   * @return {string}
   */
  getScopedNamespace: function(namespace) {
    if (!goog.object.containsKey(this.shortmap_, namespace)) {
      var shortname = this.getShortName_(namespace);
      this.shortmap_[namespace] = shortname;
      this.longmap_[shortname] = namespace;
    }
    return this.shortmap_[namespace];
  },

  /**
   * Getter for a scoped namespace. Will scope the name only if the buffer
   * is currently in scope.
   * @param  {string} ns The namespace.
   * @return {string}    The scoped namespace or the same namespace if not in
   * a scoped block.
   */
  getScopedNamespaceIfInScope: function(ns) {
    if (this.inscope) return this.getScopedNamespace(ns);
    else return ns;
  },

  /**
   * Registers the namespaces from a list to the enerator in order to
   * allow scoped block efficassy.
   * @param  {Array<string>} list The list of namespaces.
   */
  addScopeNames: function(list) {
    goog.array.forEach(list, function(ns) {
      this.getScopedNamespace(ns);
    }, this);
  },

  /**
   * Given an already scoped namespace returns the original long namespace.
   * @param {string} scopedname The scoped name to try to resolve to a long ns.
   * @return {string}
   */
  getFullNamespace: function(scopedname) {
    if (goog.object.containsKey(this.longmap_, scopedname)) {
      return this.longmap_[scopedname];
    } else {
      return scopedname;
    }
  },

  /**
   * Adds a fileoverview.
   * @param {string} overview The overview content.
   */
  addFileoverview: function(overview) {
    this.startComment();
    this.writeln('@fileoverview ' + overview);
    this.endComment();
  },

  /**
   * Actual shortening implementation.
   * @param  {string} longname The long namespace.
   * @return {string}
   * @private
   */
  getShortName_: function(longname) {
    var result = this.re_.exec(longname);
    if (!goog.isNull(result) && result.length == 2) {
      // Add exception /heiristics for assers to make lines shorter.
      if (longname == 'goog.asserts') return 'a';
      return result[1];
    }
    return longname;
  }
});

});  // goog.scope
