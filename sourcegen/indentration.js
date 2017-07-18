goog.provide('pstj.sourcegen.Indentation');

goog.require('goog.string');

/** Indentation to use in buffers */
pstj.sourcegen.Indentation = class {
  constructor() {
    /** @protected {number} */
    this.level = 0;
    /** @protected {!string} */
    this.symbol = '  ';
  }

  /** Increase the intendation. */
  add() {
    this.level++;
  }

  /** Decrease the intentation. */
  remove() {
    if (this.level > 0) {
      this.level--;
    } else {
      throw new Error('Indentation is already zero');
    }
  }

  /**
   * Allows to set up a level one deeper than the context passed in.
   * @param {!pstj.sourcegen.Indentation} indentation
   */
  setup(indentation) {
    this.level = indentation.level + 1;
  }

  /** @override */
  toString() {
    return goog.string.repeat(this.symbol, this.level);
  }
};