goog.provide('pstj.dom.FontLoaderFallback');

goog.require('goog.Promise');
goog.require('goog.async.AnimationDelay');
goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.math.Size');
goog.require('goog.style');

/**
 * Provides a fallback loading mechanism for fonts.
 *
 * @final
 * @struct
 */
pstj.dom.FontLoaderFallback = class {
  /**
   * @param {!pstj.dom.FontOptions} options
   * @param {!goog.dom.DomHelper} helper
   */
  constructor(options, helper) {
    /** @private {?goog.dom.DomHelper} */
    this.domHelper_ = helper;
    /** @private {!pstj.dom.FontOptions} */
    this.options_ = options;
    /**
     * Rerefence to the node containing the serif font.
     * @private {?Element}
     */
    this.serif_ = null;
    /** @private {!goog.math.Size} */
    this.originalSerifSize_ = new goog.math.Size(0, 0);
    /**
     * Rerefence to the node containing the sans-serif font.
     * @private {?Element}
     */
    this.sansserif_ = null;
    /** @private {!goog.math.Size} */
    this.originalSansSerifSize_ = new goog.math.Size(0, 0);
    /**
     * Rerefence to the node containing the font nodes.
     * @private {?Element}
     */
    this.parent_ = this.domHelper_.createDom('div');
    /**
     * Flag if we have already atached the nodes to the document.
     * @private {boolean}
     */
    this.attached_ = false;
    /**
     * The element to which to attach the measured elements.
     * @private {?Element}
     */
    this.referenceElement_ = this.domHelper_.getDocument().body;
    /** @private {!goog.async.AnimationDelay} */
    this.raf_ =
        new goog.async.AnimationDelay(this.onRaf_, this.domHelper_.getWindow(), this);
    /** @private {!goog.async.Delay} */
    this.timeout_ =
        new goog.async.Delay(this.onTimeout_, this.options_.timeout, this);
    /**
     * Reference to the resolve function of the promise generated by font
     * loading.
     *
     * @private {?function(string): void}
     */
    this.resolve_ = null;
    /**
     * Reference to the reject function of the promise generated by font
     * loading.
     *
     * @private {?function(Error): void}
     */
    this.reject_ = null;
  }

  /** @return {!goog.Promise<string>} */
  load() {
    this.parent_.innerHTML = this.getSansSerifHtml_() + this.getSerifHtml_();
    this.sansserif_ = this.parent_.firstElementChild;
    this.serif_ = this.sansserif_.nextElementSibling;
    this.timeout_.start();
    this.raf_.start();
    return new goog.Promise(function(resolve, reject) {
      this.resolve_ = resolve;
      this.reject_ = reject;
    }, this);
  }

  /**
   * Getter for the current size of the element.
   *
   * @param {Element} el
   * @private
   * @return {!goog.math.Size}
   */
  getSize_(el) { return goog.style.getBorderBoxSize(el); }

  /**
   * @private
   * @param {number} timestamp
   */
  onRaf_(timestamp) {
    if (!this.attached_) {
      this.attached_ = true;
      this.referenceElement_.appendChild(this.parent_);
      this.originalSerifSize_ = this.getSize_(this.serif_);
      this.originalSansSerifSize_ = this.getSize_(this.sansserif_);
      goog.style.setStyle(
          this.serif_, 'font-family', this.options_.family + ', ' +
              pstj.dom.FontLoaderFallback.SerifFontFamily_);
      goog.style.setStyle(
          this.sansserif_, 'font-family', this.options_.family + ', ' +
              pstj.dom.FontLoaderFallback.SansSerifFontFamily_);
    }

    if (this.isDifferentSize_(
            this.originalSansSerifSize_, this.getSize_(this.sansserif_)) ||
        this.isDifferentSize_(
            this.originalSerifSize_, this.getSize_(this.serif_))) {
      this.resolve_(this.options_.family);
      this.cleanUp_();
    } else {
      this.raf_.start();
    }
  }

  /**
   * Handles when the font loading times out as per the options settings.
   *
   * @private
   */
  onTimeout_() {
    if (goog.isFunction(this.reject_)) {
      this.reject_(new Error('Font loading timed out'));
    }
    this.cleanUp_();
  }

  /**
   * Compares two sizes accounting for the tollerance configured in the options.
   *
   * @private
   * @param {!goog.math.Size} a
   * @param {!goog.math.Size} b
   * @return {boolean}
   */
  isDifferentSize_(a, b) {
    return Math.abs(a.width - b.width) > this.options_.tollerance ||
        Math.abs(a.height - b.height) > this.options_.tollerance;
  }

  /** @private */
  cleanUp_() {
    this.timeout_.stop();
    this.raf_.stop();
    goog.dispose(this.timeout_);
    goog.dispose(this.raf_);
    goog.dom.removeNode(this.parent_);
    this.resolve_ = null;
    this.reject_ = null;
    this.serif_ = null;
    this.sansserif_ = null;
    this.parent_ = null;
    this.referenceElement_ = null;
  }

  /**
   * Generates the html for the sans-serif test div.
   *
   * @private
   * @return {string}
   */
  getSansSerifHtml_() {
    return this.getFontTestingHtml_(
        pstj.dom.FontLoaderFallback.SansSerifFontFamily_);
  }

  /**
   * Generates the html for the serif test div.
   *
   * @private
   * @return {string}
   */
  getSerifHtml_() {
    return this.getFontTestingHtml_(
        pstj.dom.FontLoaderFallback.SerifFontFamily_);
  }

  /**
   * Generates the html for a given font family as a test div.
   *
   * @private
   * @param {string} fontfamily
   * @return {string}
   */
  getFontTestingHtml_(fontfamily) {
    return '<div style="' +
        pstj.dom.FontLoaderFallback.getStyleString_(
            fontfamily, this.options_.weight, this.options_.style) +
        '">' + pstj.dom.FontLoaderFallback.TestString_ + this.options_.glyphs +
        '</div>';
  }
};


/**
 * @private
 * @const {string}
 */
pstj.dom.FontLoaderFallback.TestString_ = 'AxmTYklsjo190QW';


/**
 * @private
 * @const {string}
 */
pstj.dom.FontLoaderFallback.SansSerifFontFamily_ = 'sans-serif';


/**
 * @private
 * @const {string}
 */
pstj.dom.FontLoaderFallback.SerifFontFamily_ = 'serif';


/**
 * @const
 * @private
 * @type {string}
 */
pstj.dom.FontLoaderFallback.DefaultStyles_ = 'display:block;' +
    'position:absolute;' +
    'top:-999px;' +
    'left:-999px;' +
    'font-size:48px;' +
    'width:auto;' +
    'height:auto;' +
    'line-height:normal;' +
    'margin:0;' +
    'padding:0;' +
    'font-variant:normal;' +
    'white-space:nowrap;';


/**
 * Generates unique style string for font.
 *
 * @private
 * @param {string} family
 * @param {string} weight
 * @param {string} style
 * @return {string}
 */
pstj.dom.FontLoaderFallback.getStyleString_ = function(family, weight, style) {
  return pstj.dom.FontLoaderFallback.DefaultStyles_ + 'font-weight:' + weight +
      ';' +
      'font-style:' + style + ';' +
      'font-family:' + family + ';';
};
