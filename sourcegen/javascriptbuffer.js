goog.provide('pstj.sourcegen.JavascriptBuffer');

goog.require('pstj.sourcegen.CodeBuffer');


pstj.sourcegen.JavascriptBuffer = class extends pstj.sourcegen.CodeBuffer {
  constructor() {
    super();
    /** @override */
    this.commentStart = '/**';
    /** @override */
    this.commentMiddle = ' *';
    /** @override */
    this.commentEnd = ' */';
  }


  /**
   * Allows to write a comment that should be a single line.
   * @param {string} comment
   */
  writeSingleLineComment(comment) {
    this.writeln(`${this.commentStart} ${comment}${this.commentEnd}`);
  }


  /**
   * Utility function, starting a new method in a class.
   * @param {string} name
   * @param {...string} params
   * @return {!pstj.sourcegen.JavascriptBuffer}
   */
  startMethod(name, ...params) {
    this.writeln(`${name}(${params.join(', ')}) {`);
    return this.clone();
  }


  /**
   * Ends a method in a class.
   *
   * @param {!pstj.sourcegen.JavascriptBuffer} body
   */
  endMethod(body) {
    this.write(body);
    this.writeln('}');
  }

};