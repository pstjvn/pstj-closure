/**
 * @fileoverview Provides structured way to create wrapper around the
 * native font record as comming from google.
 *
 * In our use case we need also an index that we will be used to match
 * loaded fonts agains the link it is coming from.
 *
 * It creates the needed links automatically.
 */
goog.provide('pstj.dom.FontConfig');

goog.require('goog.array');


/**
 * Config for the font settings.
 */
pstj.dom.FontConfig = class {
  /**
   * @param {!pstj.dom.FontConfig.Font} font
   * @param {pstj.dom.FontConfig.Set=} opt_set Optionally which font set is this
   *    font from.
   */
  constructor(font, opt_set) {
    /** @private {pstj.dom.FontConfig.Set} */
    this.set_ =
        (goog.isDefAndNotNull(opt_set) ? opt_set :
                                         pstj.dom.FontConfig.Set.GOOGLE);
    /** @private {number} */
    this.index_ = pstj.dom.FontConfig.lastFontIndex_++;
    /** @type {!pstj.dom.FontConfig.Font} */
    this.font = font;
    /** @type {string} */
    this.variant = 'regular';
    /** @type {string} */
    this.linkHref = this.createLinkHref_();
  }

  /**
   * Creates the link to be used for loading the font-face config for this
   * font object.
   *
   * @private
   * @return {string}
   */
  createLinkHref_() {
    var url = this.getSourcePath_();
    var partial = this.font['family'].replace(/\ /g, '+');
    if (!goog.array.contains(this.font['variants'], this.variant)) {
      partial += (':' + this.font['variants'][0]);
      this.variant = this.font['variants'][0];
    }
    return url + partial;
  }

  /**
   * Returns the appropriate path for loading a font depending on the
   * font set.
   *
   * @private
   * @return {string}
   */
  getSourcePath_() {
    switch (this.set_) {
      case pstj.dom.FontConfig.Set.GOOGLE:
        return 'https://fonts.googleapis.com/css?family=';
      default:
        throw new Error('Unkown set');
    }
  }

  /**
   * Getter for the index of the font loading. It is guaranteed to be
   * unique for the runtime of the application.
   *
   * @return {number}
   */
  getIndex() { return this.index_; }
};


/** @typedef {{family: string, variants: Array<string>}} */
pstj.dom.FontConfig.Font;


/**
 * A global counter so we can keep track of which font is which.
 * @private {number}
 */
pstj.dom.FontConfig.lastFontIndex_ = 0;


/**
 * Enumerates the font sets we know how to handle.
 * @enum {number}
 */
pstj.dom.FontConfig.Set = {
  GOOGLE: 0
};
