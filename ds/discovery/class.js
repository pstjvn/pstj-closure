goog.provide('pstj.ds.discovery.Class');

goog.require('goog.array');
goog.require('pstj.ds.discovery.Property');


/**
 * Represents a single DTO class based on a schema from the discovery
 * document.
 */
pstj.ds.discovery.Class = goog.defineClass(null, {
  /**
   * @constructor
   * @param  {!Object<string, ?>} jsonscheme The scheme to convert.
   */
  constructor: function(jsonscheme) {
    /**
     * The name to give to the class.
     *
     * Note that the name is local and will be prepended by the package
     * namespace.
     * @type {string}
     */
    this.name = '';
    /**
     * The namespace this class will extend.
     *
     * JSONScheme does not support
     * extending a class and instead favors composition. This property
     * has been added to support specific use case where the developer
     * wants to manually add an extend clause.
     * @type {string}
     * @protected
     */
    this.extends = null;
    /**
     * The description for a class instance (Schema key).
     * @type {string}
     */
    this.description = null;
    /**
     * List of properties defined in the class instance.
     * @type {!Aray<!pstj.ds.discovery.Property>}
     */
    this.properties = [];

    this.process(jsonscheme);
  },

  /**
   * Actuall processing of the scheme.
   * @param  {!Object<string, ?>} scheme
   * @protected
   */
  process: function(scheme) {
    this.name = scheme['id'];

    if (goog.isString(scheme['description'])) {
      this.description = scheme['description'];
    }

    goog.object.forEach(scheme['properties'], function(prop, name) {
      this.properties.push(new pstj.ds.discovery.Property(name, prop));
    }, this);
  }
});
