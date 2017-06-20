/**
 * @fileoverview Provides means to create and add a link tag to a peer document
 * and notify via event once it is loaded. It can be also safely removed later.
 */
goog.provide('pstj.dom.FontLink');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');


pstj.dom.FontLink = class extends goog.events.EventTarget {
  /**
   * @param {string} url The URL to install in the document.
   * @param {!goog.dom.DomHelper} doc The document to install the stylesheet in.
   */
  constructor(url, doc) {
    super();
    /** @private {?goog.dom.DomHelper} */
    this.doc_ = goog.asserts.assert(doc);
    /** @private {string} */
    this.url_ = url;
    /** @private {?HTMLLinkElement} */
    this.dom_ = null;
    /** @private {goog.events.Key} */
    this.listener_ = null;
    /** @private {goog.events.Key} */
    this.listener2_ = null;
    this.init_();
  }

  /** @private */
  init_() {
    this.dom_ = (/** @type {HTMLLinkElement} */(this.doc_.createDom('link', {'rel': 'stylesheet'})));
    this.listener_ = goog.events.listenOnce(
        this.dom_, goog.events.EventType.LOAD, this.onLoad_, false, this);
    this.listener2_ = goog.events.listenOnce(this.dom_, goog.events.EventType.ERROR, this.onError_, false, this);
  }

  /**
   * Installs the link tag in the document so loading can start
   */
  enterDocument() {
    if (goog.isDefAndNotNull(this.doc_.getDocument().head)) {
      this.doc_.getDocument().head.appendChild(this.dom_);
    } else {
      throw new Error('Cannot install, no head found in the document');
    }
  }

  /**
   * @private
   * @param {goog.events.Event} e
   */
  onLoad_(e) { this.dispatchEvent(pstj.dom.FontLink.EventType.READY); }

  /**
   * @private
   * @param {goog.events.Event} e
   */
  onError_(e) {
    this.dispatchEvent(pstj.dom.FontLink.EventType.LOAD_ERROR);
  }

  /** @override */
  disposeInternal() {
    goog.events.unlistenByKey(this.listener_);
    goog.events.unlistenByKey(this.listener2_);
    goog.dom.removeNode(this.dom_);
    this.dom_ = null;
    this.doc_ = null;
    super.disposeInternal();
  }
};


/**
 * The events that our class can emit.
 * @enum {string}
 */
pstj.dom.FontLink.EventType = {
  READY: goog.events.getUniqueId('ready'),
  LOAD_ERROR: goog.events.getUniqueId('load-error')
};