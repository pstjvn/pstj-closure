goog.provide('pstj.codegen.node.Document');

goog.require('pstj.codegen.node.Node');



pstj.codegen.node.Document = class extends pstj.codegen.node.Node {
  constructor() {
    super();
    /** @type {string} */
    this.version = '';
    /** @type {string} */
    this.url = '';
    /** @const {!Object<string, !pstj.codegen.node.Class>} */
    this.classes = {};
    /** @const {!Object<string, ?>} */
    this.lists = {};
    /** @const {!Array<?>} */
    this.methods = [];
  }

  /** @override */
  toString() {
    return `Name: ${this.name}, version: ${this.version}, url: ${this.url}`;
  }
};