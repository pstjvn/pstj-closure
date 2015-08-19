/**
 * @fileoverview Provides the main class for generating code based on
 * a discovery document.
 */
goog.provide('pstj.ds.discovery.Document');

goog.require('goog.json');
goog.require('pstj.ds.discovery.Class');
goog.require('pstj.ds.discovery.List');
goog.require('pstj.ds.discovery.Method');


/** Implements parsing the document */
pstj.ds.discovery.Document = goog.defineClass(null, {
  /**
   * @constructor
   * @param  {!Object<string, ?>} discoverydoc The discovery document as parsed.
   */
  constructor: function(discoverydoc) {
    /**
     * The map the discovery document parses to.
     *
     * @type {!Object<string, ?>} discovery_string
     */
    this.map = discoverydoc;
    /** @type {string} */
    this.name = this.map['name'];
    /** @type {string} */
    this.version = this.map['version'];
    /** @type {string} */
    this.host = this.map['rootUrl'];
    /** @type {string} */
    this.base = this.map['basePath'];
    /** @type {string} */
    this.description = this.map['description'];
    /**
     * Map of all schema structures described in the document.
     *
     * @type {!Object<string, pstj.ds.discovery.Class>}
     */
    this.classes = {};
    /**
     * Map of all lists used as DTOs.
     * @type {!Object<string, pstj.ds.discovery.List>}
     */
    this.lists = {};
    /**
     * List of all methods.
     * @type {!Array<pstj.ds.discovery.Method>}
     */
    this.methods = [];

    this.processSchemas();
  },

  /**
   * Attempts to process all schema items in the document.
   * @protected
   */
  processSchemas: function() {
    var schemas = /** @type {!Object<string, !Object>} */(
        this.map['schemas']);
    goog.object.forEach(schemas, function(value, key) {
      if (value['type'] == 'object') {
        this.classes[key] = new pstj.ds.discovery.Class(value);
      } else if (value['type'] == 'array') {
        this.lists[key] = new pstj.ds.discovery.List(key, value);
      } else {
        throw new Error('Unsupported schema type: ' + value['type']);
      }
    }, this);

    var methods = /** @type {!Object<string, !Object>} */(
        this.map['methods']);
    goog.object.forEach(methods, function(value, key) {
      this.methods.push(new pstj.ds.discovery.Method(key, value));
    }, this);
  }
});
