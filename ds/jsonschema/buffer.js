/**
 * @fileoverview Write buffer for the code to be composed.
 */

goog.provide('pstj.ds.jsonschema.Buffer');

goog.require('goog.log');
goog.require('goog.string');

goog.scope(function() {


/** Implements the string buffer used for the creation of the output */
pstj.ds.jsonschema.Buffer = goog.defineClass(null, {
  constructor: function() {
    /**
     * The current indentation level.
     * @type {number}
     * @private
     */
    this.indentationLevel_ = 0;
    /**
     * The actual buffer.
     * @type {Array<string>}
     * @private
     */
    this.buffer_ = [];
    /**
     * If we are currently printing in a comment block.
     * @private
     * @type {boolean}
     */
    this.inCommentBlock_ = false;
    /**
     * The symbol to be used for indentation.
     * @type {string}
     */
    this.indentation = '  ';
    /**
     * The symbol to be used for new line feed.
     * @type {string}
     */
    this.newLine = '\n';
    /**
     * The symbol to be used for starting a comment.
     * @type {string}
     */
    this.commentStart = '/**';
    /**
     * The symbol to be used for ending a comment.
     * @type {string}
     */
    this.commentEnd = ' */';
    /**
     * The start of comment line for multi line comments.
     * @type {string}
     */
    this.commentMiddle = ' * ';
  },

  /**
   * @type {goog.log.Logger}
   * @protected
   */
  logger: goog.log.getLogger('pstj.ds.jsonschema.Buffer'),

  /**
   * Increases the indentation by 1 level.
   */
  indent: function() {
    this.indentationLevel_++;
  },

  /**
   * Decreases the indentation by one level.
   */
  unindent: function() {
    if (this.indentationLevel_ > 0) this.indentationLevel_--;
    else throw new Error('No indentation found');
  },

  /**
   * Starts a new comment block.
   */
  startComment: function() {
    if (this.inCommentBlock_) {
      throw new Error('Cannot start comment block, already in comment');
    }
    this.addLine(this.commentStart);
    this.inCommentBlock_ = true;
  },

  /**
   * Ends a comment block.
   */
  endComment: function() {
    if (this.inCommentBlock_) {
      this.inCommentBlock_ = false;
      this.addLine(this.commentEnd);
    } else {
      throw new Error('Cannot close comment, not in comment block');
    }
  },

  /**
   * Adds a single line comment to the output.
   * @param {string} comment
   */
  addSingleLineComment: function(comment) {
    this.addLine(this.commentStart + ' ' + comment + this.commentEnd);
  },

  /**
   * Adds a new require statement.
   * Note that the staements are not sorted, you must sort it before adding
   * them here.
   * @param {string} namespace The namespace to require.
   */
  addRequire: function(namespace) {
    this.addLine('goog.require(\'' + namespace + '\');');
  },

  /**
   * Adds a provide statement.
   * Those statements are not sorted, you must sort them in your code before
   * adding here.
   * @param {string} namespace
   */
  addProvide: function(namespace) {
    this.addLine('goog.provide(\'' + namespace + '\');');
  },

  /**
   * Adds a new row to the buffer. If the row to be added is too long
   * it is splitted to the first empty space before the 80 column mark (
   * including the indentation level) and the method calls itself again
   * with indetation level increased. After the string is complete the
   * indentation level is restored to the value before the self calling.
   * @param {string} text The line to be added.
   */
  addLine: function(text) {
    // TODO: include line splitting logic.

    var indent = this.getIndent();
    if (this.inCommentBlock_) {
      indent += this.commentMiddle;
    }


    var line = indent + text + this.newLine;
    if (line.length > 78) {
      // If we are in a comment it is okay to break on whitespace.
      if (this.inCommentBlock_) {
        var end = 78 - indent.length;
        while (end > 1) {
          end = end - 1;
          if (text[end] == ' ') {
            this.addLine(text.substr(0, end));
            this.addLine(text.substr(end));
            break;
          }
        }
      } else {
        // TODO: handle code splitting
        this.buffer_.push(line);
      }
    } else {
      this.buffer_.push(line);
    }
  },

  /**
   * @return {string}
   */
  getIndent: function() {
    return goog.string.repeat(this.indentation, this.indentationLevel_);
  },

  /**
   * Adds an empty line.
   *
   * Closure style guide requires those to not have indentation, so we skip it
   * here.
   */
  addEmptyLine: function() {
    this.buffer_.push(this.newLine);
  },

  /**
   * Utility method to dump the current bufer to the debug window.
   */
  dump: function() {
    goog.log.info(this.logger, 'Dumping the current buffer');
    goog.log.info(this.logger, this.buffer_.join(''));
  },

  /**
   * Allows access to the buffer for other printer to use.
   * @return {Array<string>}
   */
  getBuffer: function() {
    return this.buffer_;
  }
});

});  // goog.scope

