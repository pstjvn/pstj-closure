goog.provide('pstj.sourcegen.Buffer');

pstj.sourcegen.Buffer = class {
  constructor() {
    /** @private {!Array<!string>} */
    this.buffer_ = [];
  }

  /**
   * Write an object to the buffer.
   * @param {(!string|!number|!boolean|!Object)} obj
   */
  write(obj) {
    this.buffer_.push(goog.isString(obj) ? obj : obj.toString());
  }

  /**
   * Write the object to buffer and add a new line at the end.
   * @param {(string|number|boolean|Object)=} opt_obj
   */
  writeln(opt_obj) {
    if (!goog.isDef(opt_obj)) opt_obj = '';
    var str = (goog.isString(opt_obj) ? opt_obj : opt_obj.toString());
    this.buffer_.push(str + '\n');
  }

  /** @override */
  toString() {
    return this.buffer_.join('');
  }
};
