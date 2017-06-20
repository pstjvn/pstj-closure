goog.provide('pstj.dom.FontOptions');

/**
 * Struct to represent a font to be loaded.
 * It is shared by the font loading mechanizms.
 *
 * @final
 * @struct
 */
pstj.dom.FontOptions = class {
  constructor() {
    /**
     * The family to load.
     * @type {string}
     */
    this.family = '';
    /**
     * The weight to monitor/load. Note that it is a string because of how it
     * is represented in the FontFace struct. Could be 'bold' for example.
     * @type {string}
     */
    this.weight = '400';
    /**
     * The style to load. Could be 'italic'.
     * @type {string}
     */
    this.style = 'normal';
    /**
     * If we are loading glyph font those are the glyphs used to monitor the
     * load state. It will force the fallback loading because glyphs are not
     * known/used yet in the document and this will prevent the font from
     * loading on some browsers (i.e. the font is loaded only if used and the
     * place where it applies to contains text).
     * @type {string}
     */
    this.glyphs = '';
    /**
     * How much time to wait before giving up.
     * @type {number}
     */
    this.timeout = 5000;
    /**
     * Used internally to detect changes when using fallback.
     * @type {number}
     */
    this.tollerance = 2;
  }
};
