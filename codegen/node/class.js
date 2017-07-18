goog.provide('pstj.codegen.node.Class');

goog.require('goog.array');
goog.require('pstj.codegen.node.Node');


/**
 * Represents a class instance that is a 'response' from an API.
 *
 * Note that here we store only data that can be extracted and NOT data
 * that is useful for generating a certain type of output.
 */
pstj.codegen.node.Class = class extends pstj.codegen.node.Node {
  constructor() {
    super();
    /** @override */
    this.type = pstj.codegen.node.type.CLASS;
    /**
     * Internal property allowing the class to describe dependencies to
     * other classes, for example when a class contains a property that is a
     * reference to another class.
     *
     * @private {!Array<string>}
     */
    this.requiredNamespaces_ = [];
    /**
     * Contains the list of properties this class has references to.
     *
     * @type {!Array<!pstj.codegen.node.Property>}
     */
    this.properties = [];
    /**
     * Helper attribute to know where the class came from.
     *
     * @type {string}
     */
    this.sourceFileName = '';
  }


  /**
   * Allows to add a namespace. The namespaces are deduplicated and sorted.
   *
   * @param {string} namespace The namespace to add if it is not already there.
   */
  addRequiredNamespace(namespace) {
    goog.array.insert(this.requiredNamespaces_, namespace);
    this.requiredNamespaces_.sort();
  }
};