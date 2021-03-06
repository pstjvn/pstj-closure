goog.module('pstj.swagger.Node');

const Node = class Node {
  /**
   * @param {!string} name
   * @param {!Object<string, ?>} json
   */
  constructor(name, json) {
    /** @protected {!Object<string, ?>} */
    this.json = json;
    /** @type {!string} */
    this.name = name;
    /** @type {?string} */
    this.description = null;
    this.parse();
  }

  /** No */
  parse() {
    this.description = this.json['description'] || null;
  }
};

exports = Node;
