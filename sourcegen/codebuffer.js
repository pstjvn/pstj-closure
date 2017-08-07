goog.provide('pstj.sourcegen.CodeBuffer');

goog.require('goog.array');
goog.require('goog.string');
goog.require('pstj.sourcegen.Buffer');
goog.require('pstj.sourcegen.Indentation');


pstj.sourcegen.CodeBuffer = class extends pstj.sourcegen.Buffer {
  constructor() {
    super();
    /**
     * Determines the wrap column. Note that this is used only for comment
     * block as the actual code parts are expected to use external formatter,
     * like clang-format for example. Also generated code is not intended to be
     * maintained manually so it does not need to be foratted. We format the
     * comments and expect clang-format to run only for debugging purposes.
     * @protected {number}
     */
    this.columns = 80;
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
   * Check if we are already in a comment.
   * @return {boolean}
   */
  isInComment() { return this.inComment_; }


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


  /**
   * Allows to write a comment that should be a single line.
   * @param {string} comment
   */
  writeSingleLineComment(comment) {
    this.writeln(`${this.commentStart} ${comment}${this.commentEnd}`);
  }


  /**
   * Helper method to construct a JSDoc notation type comment.
   *
   * @param {!string} notation The JSDoc type to create.
   * @param {string=} description Optional description.
   * @param {string=} type Optional type annotation - for example '!Array'
   * @param {string=} name For '@param' tags the name of the param.
   * @return {!string}
   */
  createComment(notation, description, type, name) {
    let comment = `@${notation}`;
    if (goog.isString(type)) comment += ` {${type}}`;
    if (goog.isString(name)) comment += ` ${name}`;
    if (goog.isString(description) &&
        !goog.string.isEmptyOrWhitespace(description)) {
      comment += ` ${description}`;
    }
    return comment;
  }


  /**
   * Writes a whole comment.
   *
   * @param {string} comment The comment to add.
   */
  writeComment(comment) {
    if (this.isInComment()) {
      goog.array.forEach(
          this.refitCommentString(comment), str => this.writeln(str));
    } else
      throw new Error('Cannot write a comment string when not in comment');
  }


  /**
   * Given a string attempts to fit it so that it can be printed out to
   * up to the limit of columns defined in the class.
   *
   * The retunred lines are expected to be printed one by one with
   * writeln inside a comment block.
   *
   * @param {string} comment
   * @return {!Array<string>}
   */
  refitCommentString(comment) {
    let indent = this.indentation.toString();
    let words = comment.split(' ');
    /** @type {!Array<string>} */
    let strings = [];
    let string = '';
    goog.array.forEach(words, word => {
      if ((indent.length + this.commentMiddle.length + 1 + string.length + 1 +
           word.length) <= this.columns) {
        if (string.length == 0)
          string += word;
        else
          string += ` ${word}`;
      } else {
        strings.push(string);
        string = `${word}`;
      }
    });
    if (goog.array.peek(strings) != string) strings.push(string);
    return strings;
  }


  /**
   * Utility method for starting a new class.
   * Will return the correctly nested buffer for the class body.
   *
   * @param {string} name The name or the namespace for the new class.
   * @param {string=} extending The class to inherit from if any.
   */
  startClassDefinition(name, extending) {
    /** @type {string} */
    let heading = `${name} = class ` +
        (goog.isString(extending) ? ('extends ' + extending) : '') + ' {';
    this.startSection(heading);
  }


  /**
   * Utility method for completing a class definition. It will put
   * the class body and close the class.
   */
  endClassDefinition() { this.endSection('};'); }


  /**
   * Utility function, starting a new method in a class.
   * @param {string} name
   * @param {...string} params
   */
  startMethodDefinition(name, ...params) {
    this.startSection(`${name}(${params.join(', ')}) {`);
  }


  /**
   * Ends a method in a class.
   */
  endMethodDefinition() { this.endSection('}'); }


  /**
   * Utility method - puts the heading needed and returns a nested
   * buffer to put content in.
   *
   * @protected
   * @param {string} sectionHeading
   */
  startSection(sectionHeading) {
    this.writeln(sectionHeading);
    this.indent();
  }


  /**
   * Ends a section by putting in the body and adding the termination symbol.
   *
   * @protected
   * @param {string=} terminator
   */
  endSection(terminator) {
    this.unindent();
    this.writeln(terminator);
  }
};
