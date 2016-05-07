goog.provide('pstj.sourcegen.Indentation');

goog.require('goog.string');

/** Indentation to use in buffers */
pstj.sourcegen.Indentation = class {
  constructor() {
    /** @protected {!string} */
    this.symbol = '  ';
  }

  /** Increase the intendation. */
  add() {
    pstj.sourcegen.Indentation.Level++;
  }

  /** Decrease the intentation. */
  remove() {
    if (pstj.sourcegen.Indentation.Level > 0) pstj.sourcegen.Indentation.Level--;
  }

  /** @override */
  toString() {
    return goog.string.repeat(this.symbol, pstj.sourcegen.Indentation.Level);
  }
};

/** @type {number} */
pstj.sourcegen.Indentation.Level = 0;
