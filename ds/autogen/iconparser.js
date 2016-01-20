'use strict';
goog.provide('pstj.ds.autogen.IconParser');

goog.require('goog.array');
goog.require('pstj.ds.autogen.IconRenderer');
goog.require('pstj.ds.template');

goog.scope(function() {
var auto = pstj.ds.autogen;


/** The icon parser implementation. */
auto.IconParser = class {
  /** @param {Document} doc The document containing the raw icon elements. */
  constructor(doc) {
    /** @type {!Array<pstj.ds.autogen.IconRenderer>} */
    this.renderers = goog.array.map(doc.querySelectorAll('[is]'),
                                    el => new pstj.ds.autogen.IconRenderer(el));
  }

  /**
   * Provides means to iterate over the created renderers.
   * @param {function(pstj.ds.autogen.IconRenderer, number,
   *    Array<pstj.ds.autogen.IconRenderer>): void} fn
   */
  forEach(fn) { goog.array.forEach(this.renderers, fn); }

  /**
   * Generates the contents of the file that contains all icon names mapped
   * as symbols to be used in enum structure (JS file).
   *
   * @return {string}
   */
  generateIconNames() {
    var names = [];
    this.forEach((el) => {
      goog.array.forEach(el.iconNames, (iconname) => names.push(iconname));
    });
    var symbols = goog.array.map(names, (iconname) => {
      return iconname.toUpperCase().replace(/-/g, '_');
    });
    return pstj.ds.template.IconNames({names: names, symbols: symbols})
        .getContent();
  }

  /**
   * Iterates over all parsed icons and generates the soy template file for
   * all of them.
   *
   * @return {string}
   */
  generateIconTemplate() {
    return pstj.ds.template
        .IconTemplate({
          names: goog.array.map(this.renderers, el => el.className),
          templates: goog.array.map(this.renderers,
                                    el => el.getRendererTemplateContent())
        })
        .getContent();
  }
}
;

});  // goog.scope
