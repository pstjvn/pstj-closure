goog.module('pstj.swagger.Dto');

const Node = goog.require('pstj.swagger.Node');
const Type = goog.require('pstj.swagger.ClassType');

const Dto = class Dto extends Node {
  /**
   * @param {!string} name
   * @param {!Object<string, ?>} json
   */
  constructor(name, json) {
    super(name, json);
  }

  /** @override */
  parse() {
    super.parse();
    if (this.json['type'] == Type.OBJECT) {
      this.parseProperties();
    }
  }

  /** Parses the props of the class. */
  parseProperties() {

  }

};

exports = Dto;
