/**
 * @fileoverview Provides the default content generator implementation for JS
 * files.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('pstj.sourcegen.JSBuffer');

goog.require('goog.string');


/**
 * The base js file code generator is designed to be JS aware string buffer.
 *
 * It can be used as regular string buffer. It does not impose any strict
 * rules on usage except that it does not automatically add the new line
 * symbol at the end of a line.
 *
 * Additionally the class has support for JSDoc block comments and content
 * aware long line splitting.
 *
 * If you need to change the options you should extend the class and
 * override what you need changed.
 */
pstj.sourcegen.JSBuffer = goog.defineClass(null, {
  constructor: function() {
    /** @type {!Array<string>} */
    this.buffer = [];
    /**
     * Current indentation level.
     * @type {number}
     * @protected
     */
    this.indentation = 0;
    /**
     * The symbol to use for indentation.
     * @type {string}
     * @protected
     */
    this.indentationSymbol = '  ';
    /**
     * If we are currently writing a comment line.
     * @type {boolean}
     * @protected
     */
    this.inComment = false;
    /**
     * The symbol used to add a new line
     * @type {string}
     * @protected
     */
    this.newline = '\n';
    /**
     * The column number where we can write as maximum.
     * @type {number}
     * @protected
     */
    this.wrapLine = 80;
    /**
     * The symbol to use to start a comment.
     * @type {string}
     * @private
     */
    this.cStart_ = '/**';
    /**
     * The symbol to pout on new lines in a comment.
     * @type {string}
     * @private
     */
    this.cMiddle_ = ' * ';
    /**
     * The symbol to use to end a doc comment.
     * @type {string}
     * @private
     */
    this.cEnd_ = ' */';
    /**
     * The symbol used for a simple space.
     * @type {string}
     * @private
     */
    this.space_ = ' ';
  },

  /**
   * Add one step indentation to the generated string.
   */
  indent: function() {
    this.indentation++;
  },

  /**
   * Remove one step indentation.
   */
  unindent: function() {
    if (this.indentation > 0) this.indentation--;
    else throw new Error('You are already at indentation 0');
  },

  /**
   * Start a new JSDoc block comment.
   */
  startComment: function() {
    if (!this.inComment) {
      this.writeln(this.cStart_);
      this.inComment = true;
    } else {
      throw new Error('Already in comment, cannot start a new one');
    }
  },

  /**
   * End a JSDoc block comment.
   */
  endComment: function() {
    if (this.inComment) {
      this.inComment = false;
      this.writeln(this.cEnd_);
    } else {
      throw new Error('Not in block comment');
    }
  },

  /**
   * Adds a JSDoc comment on a single line.
   * @param  {string} txt The string to put in the comment.
   */
  singleLineComment: function(txt) {
    this.writeln(this.cStart_ + this.space_ + txt + this.cEnd_);
  },

  /**
   * Adds the standard warning for auto-generated code files.
   * @protected
   */
  addEditWarning: function() {
    this.writeln('// This code is auto generate, please do not edit!');
  },

  /**
   * Write a new line in the buffer.
   * @param {string} txt The string to add.
   */
  write: function(txt) {
    var line = this.getIndent_();
    if (this.inComment) line += this.cMiddle_;
    line += txt;

    if (this.fits(line)) this.buffer.push(line);
    else {
      var remaining = this.partialWrite_(line, goog.bind(function(str) {
        this.buffer.push(str + '\n');
      }, this));
      if (remaining.length > 0) {
        this.write(remaining);
      }
    }
  },

  /**
   * Add an empty line in the buffer.
   * @param {string=} opt_txt The string to add if any.
   */
  writeln: function(opt_txt) {
    if (goog.isDef(opt_txt)) {
      this.write(opt_txt + this.newline);
    } else {
      this.buffer.push(this.newline);
    }
  },

  /** @override */
  toString: function() {
    return this.buffer.join('');
  },

  /**
   * Write a string as a partial.
   *
   * If the line is too long only the part that fits inside the limit will
   * be written and the remaining will be returned.
   * @private
   * @param {string} line The line to write.
   * @param {!function(!string): void} callback
   * @return {string} The remaining part of the string, if the whole string was
   * written an empty string will be returned.
   */
  partialWrite_: function(str, callback) {
    var mag = this.wrapLine;
    var arr = str.split('');
    var length = arr.length;
    var newMag = null;

    if (length - 1 > mag) {
      if (!arr[mag].match(/\s/)) {
        for (var i = (mag - 1); i >= 0; i--) {
          if (arr[i].match(/\s/)) {
            newMag = i;
            break;
          }
          if (arr[i].match(/\(/) && arr[i - 1].match(/[A-Za-z]/)) {
            newMag = i + 1;
            break;
          }
          if (arr[i].match(/\./) && arr[i - 1].match(/[A-Za-z]/)) {
            newMag = i;
            break;
          }
        }
      }
      else {
        newMag = mag;
      }
    } else {
      return arr.splice(0, length).join('');
    }

    var rest = arr.splice(0, newMag);
    rest = rest.join('');
    if (callback) {
      callback(rest);
    }
    if (arr[0].match(/\s/)) {
      arr[0] = undefined;
    }
    return arr.join('');
  },

  /**
   * Checks if the line fits within out restrains.
   * @param  {string} line The line to test.
   * @return {boolean}
   */
  fits: function(line) {
    return (line.length <= this.wrapLine);
  },

  /**
   * Constructs the indentation.
   * @return {!string}
   * @private
   */
  getIndent_: function() {
    return goog.string.repeat(this.indentationSymbol, this.indentation);
  }
});
