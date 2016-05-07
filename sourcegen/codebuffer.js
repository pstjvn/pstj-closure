goog.provide('pstj.sourcegen.CodeBuffer');

goog.require('pstj.sourcegen.Buffer');
goog.require('pstj.sourcegen.Indentation');

pstj.sourcegen.CodeBuffer = class extends pstj.sourcegen.Buffer {
  constructor() {
    super();
    /**
     * The current indentation.
     * @type {!pstj.sourcegen.Indentation}
     */
    this.indent = new pstj.sourcegen.Indentation();
    /** @private {!boolean} */
    this.inComment_ = false;
    /** @type {!string} */
    this.commentStart = '';
    /** @type {!string} */
    this.commentMiddle = '';
    /** @type {!string} */
    this.commentEnd = '';
  }

  /** @override */
  writeln(opt_obj) {
    if ((goog.isDef(opt_obj) && opt_obj.toString() != '') || this.inComment_) {
      this.write(this.indent);
    }
    if (this.inComment_) {
      this.write(this.commentMiddle);
    }
    super.writeln(opt_obj);
  }

  /**
   * Add empty lines to the output.
   * @param {!number} count Number of lines to add.
   */
  lines(count) {
    while (count-- > 0) this.writeln();
  }

  /**
   * Gets a new buffer.
   * @return {!pstj.sourcegen.CodeBuffer}
   */
  clone() {
    return new pstj.sourcegen.CodeBuffer();
  }
};
