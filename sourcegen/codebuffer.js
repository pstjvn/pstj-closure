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
    this.indentation = new pstj.sourcegen.Indentation();
    /** @private {!boolean} */
    this.inComment_ = false;
    /** @protected {!string} */
    this.commentStart = '';
    /** @protected {!string} */
    this.commentMiddle = '';
    /** @protected {!string} */
    this.commentEnd = '';
  }


  /** Indents more */
  indent() { this.indentation.add(); }


  /** Indents less */
  unindent() { this.indentation.remove(); }


  /**
   * Enter comment section.
   */
  startComment() {
    this.writeln(this.commentStart);
    this.inComment_ = true;
  }


  /**
   * Exit comment section.
   */
  endComment() {
    this.inComment_ = false;
    this.writeln(this.commentEnd);
  }


  /** @override */
  writeln(opt_obj) {
    if ((goog.isDef(opt_obj) && opt_obj.toString() != '') || this.inComment_) {
      this.write(this.indentation);
    }
    if (this.inComment_) {
      this.write(`${this.commentMiddle} `);
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
   * Gets a new buffer that is nested inside this buffer.
   *
   * To merge back the child buffer simply call it:
   * `parent.write(child);`
   *
   * @return {!pstj.sourcegen.CodeBuffer}
   */
  clone() {
    let b = new pstj.sourcegen.CodeBuffer();
    b.indentation.setup(this.indentation);
    return b;
  }
};
