goog.provide('pstj.dom.fonts');

goog.require('goog.dom');
goog.require('goog.string');
goog.require('pstj.dom.FontLoader');
goog.require('pstj.dom.FontLoaderFallback');


/**
 * Provides an utility function to load a font. Returns a promise that resolves
 * once the font is loaded or rejects if it cannot be loaded.
 *
 * @param {!pstj.dom.FontOptions} options
 * @param {!goog.dom.DomHelper} domHelper
 * @return {!goog.Promise<string>}
 */
pstj.dom.fonts.load = function(options, domHelper) {
  if (pstj.dom.fonts.useDefault_(options)) {
    return (new pstj.dom.FontLoader(options, domHelper)).load();
  } else {
    return (new pstj.dom.FontLoaderFallback(options, domHelper)).load();
  }
};


/**
 * Decide if the default (native) font loading should be used or the fallback.
 *
 * @private
 * @param {!pstj.dom.FontOptions} options
 * @return {boolean}
 */
pstj.dom.fonts.useDefault_ = function(options) {
  if (goog.string.isEmptyOrWhitespace(options.glyphs) &&
      pstj.dom.fonts.SupportNativFontFaceLoader_) {
    return true;
  } else {
    return false;
  }
};


/**
 * Flag reflecting if the FontFace* APIs are supported on the target.
 * @private {boolean}
 */
pstj.dom.fonts.SupportNativFontFaceLoader_ =
    ('fonts' in goog.dom.getDomHelper().getDocument());
