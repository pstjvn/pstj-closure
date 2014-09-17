goog.provide('pstj.ui.element.MediaQuery');

goog.require('goog.async.nextTick');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('pstj.ui.element.EventType');



pstj.ui.element.MediaQuery = goog.defineClass(goog.events.EventTarget, {
  /**
   * Provides the utilities for creating and using media queries inside the app.
   *
   * @constructor
   * @param {!string} query The query to match against.
   * @extends {goog.events.EventTarget}
   * @suppress {checkStructDictInheritance}
   */
  constructor: function(query) {
    goog.events.EventTarget.call(this);
    if (!pstj.ui.element.MediaQuery.hasMediaSupport) {
      throw new Error('Browser does not support matchMedia');
    }
    /**
     * The current query matching in matchMedia
     *
     * @type {!string}
     * @private
     */
    this.query_ = '';
    /**
     * The query object requrned by the native functionality.
     *
     * @type {MediaQueryList}
     * @private
     */
    this.mediaQuery_ = null;
    /**
     * Cached helper function. The MediaQueryList interface does not
     * provide helper to setup the context so we need to do it manually.
     *
     * @type {function(!MediaQueryList): void}
     * @private
     */
    this.bound_ = goog.bind(this.onQueryUpdate, this);
    /**
     * Flag to indicate if the current browser setup matches the query instance.
     *
     * @type {boolean}
     */
    this.queryMatches = false;
    this.setQuery(query);
  },


  /**
   * Setup a new query on the instance.
   *
   * @param {!string} query The query to match against.
   */
  setQuery: function(query) {

    if (this.mediaQuery_) {
      this.mediaQuery_.removeListener(this.bound_);
    }

    // Makes sure we use the correct syntax
    if (query[0] !== '(') query = '(' + query + ')';

    this.query_ = query;
    this.mediaQuery_ = goog.dom.getWindow().matchMedia(this.query_);
    this.mediaQuery_.addListener(this.bound_);
    this.onQueryUpdate(this.mediaQuery_);
  },


  /**
   * Handle the query match changes from the media query list.
   *
   * @protected
   * @param {!MediaQueryList} mq The instance that triggers the event.
   */
  onQueryUpdate: function(mq) {
    this.queryMatches = mq.matches;
    goog.async.nextTick(function() {
      this.dispatchEvent(pstj.ui.element.EventType.MEDIA_CHANGE);
    }, this);
  },

  statics: {
    /**
     * Flag to let us know if the needed browser support is present.
     * @type {boolean}
     */
    hasMediaSupport: ('matchMedia' in window)
  }
});
