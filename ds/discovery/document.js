/**
 * @fileoverview Provides the main class for generating code based on
 * a discovery document.
 */
goog.provide('pstj.ds.discovery.Document');

goog.require('goog.json');
goog.require('pstj.ds.discovery.Class');


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
    this.base = this.map['servicePath'];
    /** @type {string} */
    this.description = this.map['description'];
    /**
     * Map of all schema structures described in the document.
     *
     * @type {Object<string, Object>}
     */
    this.classes = {};
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
        // this.schemas[key] = new pstj.ds.discovery.Array.fromMap(value));
      } else {
        throw new Error('Unsupported schema type: ' + value['type']);
      }
    }, this);
  }
});
