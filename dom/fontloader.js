/**
 * @fileoverview Class to provide means to load fonts using what is available
 * in the running browser.
 */

goog.provide('pstj.dom.FontLoader');

goog.require('goog.Delay');
goog.require('goog.Promise');
goog.require('goog.dom');


/** Provides means to load a font. Should work in all modern browsers */
pstj.dom.FontLoader = class {
  /**
   * Requires a font family name to load.
   * @param {!pstj.dom.FontOptions} options
   * @param {!goog.dom.DomHelper} domHelper
   */
  constructor(options, domHelper) {
    /**
     * The font family to load.
     * @private {!pstj.dom.FontOptions}
     */
    this.options_ = options;
    /** @private {?goog.dom.DomHelper} */
    this.domHelper_ = domHelper;
    /**
     * If we should use custom timeout, if available it will race with the
     * font loading.
     * @private {!goog.Delay}
     */
    this.timeout_ =
        new goog.Delay(this.onTimeout_, this.options_.timeout, this);
    /**
     * Placeholder for the genealized closure for the rejection.
     * @private {?function(string): void}
     */
    this.generalizedLoadRejection_ = null;
  }

  /**
   * Start the loading of the font. Will return a promise that resolves
   * to the loaded font family name when the font is ready/loaded or will
   * be rejected if the font cannot be loaded or timeouted if timeout is used.
   *
   * @return {!goog.Promise<string>}
   */
  load() { return this.checkFontFace_(); }

  /**
   * Assuming fonts interfaces are available in the Document, attempts to
   * load the fonts using those new interfaces.
   *
   * @private
   * @return {!goog.Promise<string>}
   */
  checkFontFace_() {
    /** @type {?FontFace} */
    var font = null;
    this.domHelper_.getDocument().fonts.forEach(function(fontface, i) {
      if (goog.isNull(font)) {
        if ((pstj.dom.FontLoader.normalizeFamilyString(fontface.family) ==
             pstj.dom.FontLoader.normalizeFamilyString(this.options_.family)) &&
            (pstj.dom.FontLoader.mapNameToWeight(fontface.weight) ==
             pstj.dom.FontLoader.mapNameToWeight(this.options_.weight)) &&
            fontface.style == this.options_.style) {
          font = fontface;
        }
      }
    }, this);

    if (!goog.isNull(font)) {
      if (font.status == 'loaded') {
        this.cleanUp_();
        return goog.Promise.resolve(this.options_.family);
      } else {
        return new goog.Promise(function(resolve, reject) {
          // Assign rejection so we can access it in the timeout.
          this.generalizedLoadRejection_ = function(reason) {
            reject(new Error(reason));
          };
          this.timeout_.start();
          font.load().then(goog.bind(function(fontface) {
            this.cleanUp_();
            resolve(this.options_.family);
          }, this), goog.bind(function(reason) {
            this.cleanUp_();
            reject(reason);
          }, this));
        }, this);
      }
    } else {
      this.cleanUp_();
      return goog.Promise.reject(
          new Error(
              'Cannot find matching font.' +
              'Make sure you have it declared as font-face.'));
    }
  }

  /**
   * To be called when font loading timeout elapsed.
   *
   * @private
   */
  onTimeout_() {
    if (goog.isFunction(this.generalizedLoadRejection_)) {
      this.generalizedLoadRejection_('Font loading timed out');
      this.generalizedLoadRejection_ = null;
    }
  }

  /**
   * Cleans up after the loading work has been done.
   *
   * @private
   */
  cleanUp_() {
    this.generalizedLoadRejection_ = null;
    this.timeout_.stop();
    goog.dispose(this.timeout_);
  }
};


/**
 * Attempts to map a named font weight to a numbered one.
 *
 * @param {string|number} weight
 * @return {string}
 */
pstj.dom.FontLoader.mapNameToWeight = function(weight) {
  switch (weight) {
    case 'normal':
      return '400';
    case 'bold':
      return '700';
    default:
      return String(weight);
  }
};


/**
 * The regular expression used to normalize the font family.
 *
 * @private {!RegExp}
 */
pstj.dom.FontLoader.FontFamilyNormalizationRegExp_ = /[\'\"]/g;


/**
 * Normalizes the family name to match as it is within the FontFace interface.
 *
 * @param {string} family
 * @return {string}
 */
pstj.dom.FontLoader.normalizeFamilyString = function(family) {
  return family.replace(pstj.dom.FontLoader.FontFamilyNormalizationRegExp_, '')
      .toLowerCase();
};
