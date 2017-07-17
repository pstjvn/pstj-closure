goog.provide('pstj.codegen.node.Node');


/**
 * The base node for the tree structure that can represent a document of a
 * remote API.
 *
 * Each node is simply a record field.
 */
pstj.codegen.node.Node = class {
  constructor() {
    /**
     * The name to be given to the node. It is usually the name of the field it
     * will represent as given by the API author.
     *
     * @type {string}
     */
    this.name = '';
    /**
     * The description as given by the author, if any.
     *
     * @type {string}
     */
    this.description = '';
    /**
     * The type of the field. This is a string representation of the node
     * type in the sense of the type system.
     *
     * @type {string}
     */
    this.type = '';
  }

  /** @override */
  toString() {
    return `Name: ${this.name}, description: ${this.description}`;
  }
};