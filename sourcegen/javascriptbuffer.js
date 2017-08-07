/**
 * @fileoverview Designed to simplify constructing a javascript file.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */
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
};