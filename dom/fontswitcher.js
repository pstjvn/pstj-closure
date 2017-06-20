/**
 * @fileoverview Provides means to alter the fonts on a remote frame. The frame
 * is assumed to be in the same origin.
 *
 * In order for fonrts to appear / change smoothly we need to buffer them as
 * follows:
 *
 * - install the stylesheet for the font, should contain the font-face
 * declaration
 * - preload the font for the corresponding document (this requires injection
 * of a helper script inside the child document)
 * - once the font is preloaded attach a second stylesheet that applies the
 * font to a set of selectors on the child document.
 * - chaning the font requires to repeat from start BUT preseve the existing
 * font-face stylesheet, preload the font and only then change the application
 * stylesheet to 'point' to the new font-face.
 *
 * Folowing this procedures creates the following working scheme:
 * - one link for each font
 * - set of two leans for each set
 * - one additional link for each application
 */

goog.provide('pstj.dom.FontSwitcher');

goog.require('goog.events.EventTarget');
goog.require('pstj.dom.FontLink');
goog.require('pstj.dom.FontOptions');
goog.require('pstj.dom.fonts');


/**
 * Designed to allow to apply fonts on peer document.
 *
 * Note that the stylesheets are created on the fly so the 'load' event for them
 * will not fire.
 */
pstj.dom.FontSwitcher = class extends goog.events.EventTarget {
  /** @param {!Document} doc The document to work with. */
  constructor(doc) {
    super();
    /**
     * Reference for the document we are currently targeting.
     * @private {!goog.dom.DomHelper}
     */
    this.targetDocument_ = goog.dom.getDomHelper(doc);
    /**
     * The link to wait for loading new font.
     * @private {?pstj.dom.FontLink}
     */
    this.link_ = null;
    /**
     * The laternate link for loading fonts.
     * @private {?pstj.dom.FontLink}
     */
    this.lastLink_ = null;
    /**
     * The stylesheet to append to apply the font in the target document.
     * @private {?HTMLStyleElement}
     */
    this.applicationStylesheet_ = null;
    /**
     * The selector to use to apply the font on.
     * @type {string}
     */
    this.selector = '*';
    /** @private {?pstj.dom.FontConfig} */
    this.lastFontConfig_ = null;
  }

  /**
   * Tells the switcher to install and activate a new font.
   * If the font is the same as the prevous one nothing will happen.
   *
   * @param {!pstj.dom.FontConfig} fontconfig
   */
  installFont(fontconfig) {
    this.lastFontConfig_ = fontconfig;
    if (!goog.isNull(this.lastLink_)) {
      goog.events.unlisten(this.lastLink_, pstj.dom.FontLink.EventType.READY, this.onLinkReady_, false, this);
      goog.events.unlisten(this.lastLink_, pstj.dom.FontLink.EventType.LOAD_ERROR, this.onLinkError_, false, this);
      this.lastLink_.dispose();
    }
    this.lastLink_ = this.link_;
    this.link_ = new pstj.dom.FontLink(fontconfig.linkHref, goog.asserts.assert(this.targetDocument_));
    goog.events.listen(this.link_, pstj.dom.FontLink.EventType.READY, this.onLinkReady_, false, this);
    goog.events.listen(this.link_, pstj.dom.FontLink.EventType.LOAD_ERROR, this.onLinkError_, false, this);
    this.link_.enterDocument();
    this.dispatchEvent(pstj.dom.FontSwitcher.EventType.START);
  }

  /**
   * Handles the reasy event from the link abstraction. Once the link is ready we need to
   * make sure the script is installed to load the font and receive the message from it.
   *
   * @private
   * @param {goog.events.Event} e
   */
  onLinkReady_(e) {
    if (e.target == this.link_) {
      var options = new pstj.dom.FontOptions();
      options.family = this.lastFontConfig_.font.family;
      pstj.dom.fonts.load(options, this.targetDocument_).then(this.onFontLoaded_, this.onFontError_, this);
    }
  }

  /**
   * Handles the error from loading the link tag.
   *
   * @private
   * @param {goog.events.Event} e
   */
  onLinkError_(e) {
    if (e.target == this.link_) {
      this.dispatchEvent(pstj.dom.FontSwitcher.EventType.LINK_ERROR);
    }
  }

  /**
   * Handles the resolved promise of loading the font in the document.
   *
   * @private
   * @param {string} fontFamily
   */
  onFontLoaded_(fontFamily) {
    if (fontFamily == this.lastFontConfig_.font['family']) {
      this.applicationStylesheet_.textContent = this.generateStyle_();
      this.dispatchEvent(pstj.dom.FontSwitcher.EventType.COMPLETE);
    }
  }

  /**
   * Handles the rejection of the promise to load a font in the document.
   *
   * @private
   * @param {*} error
   */
  onFontError_(error) {
    this.dispatchEvent(pstj.dom.FontSwitcher.EventType.FONT_ERROR);
  }

  /**
   * Generates style sheet for applying the new font on the page.
   *
   * @private
   * @return {string}
   */
  generateStyle_() {
    return (this.selector + '{font-family: \'' + this.lastFontConfig_.font['family'] + '\' !important; }');
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    this.applicationStylesheet_ = null;
  }
};


/**
 * The events the switcher can emit.
 * @enum {string}
 */
pstj.dom.FontSwitcher.EventType = {
  START: goog.events.getUniqueId('start'),
  LINK_ERROR: goog.events.getUniqueId('link-error'),
  FONT_ERROR: goog.events.getUniqueId('font-error'),
  COMPLETE: goog.events.getUniqueId('complete')
};
