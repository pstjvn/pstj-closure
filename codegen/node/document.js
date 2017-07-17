goog.provide('pstj.codegen.node.Document');

goog.require('pstj.codegen.node.Node');



pstj.codegen.node.Document = class extends pstj.codegen.node.Node {
  constructor() {
    super();
    this.version = '';
    this.url = '';
    this.classes = {};
    this.lists = {};
    this.methods = [];
  }

  /** @override */
  toString() {
    return `Name: ${this.name}, version: ${this.version}, url: ${this.url}`;
  }
};