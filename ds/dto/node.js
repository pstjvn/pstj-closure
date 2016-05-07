goog.provide('pstj.ds.dto.Node');

/** Provides the base node for all dto props. */
pstj.ds.dto.Node = class {
  constructor() {
    /** @type {?string} */
    this.name = null;
    /** @type {?string} */
    this.description = null;
    /** @type {?string} */
    this.type = null;
  }

  /** @override */
  toString() {
    return `Name: ${this.name}, description: ${this.description}`;
  }
};
