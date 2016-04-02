/**
 * @fileoverview Default implementation for the medial query utility.
 *
 * This class allows the user to set up a media query in code and listen for
 * changes on it to respond to thresholds in the view. Similar to the CSS media
 * query utilities it is constructed as string and registered on the document.
 *
 * Example usage:
 * <code>
 * var mq = new pstj.ui.MediaQuery('max-width:600px');
 * // Event will be fired async on creation so the handler will be executed
 * // even thou it is assigned after the creation of the media query.
 * goog.events.listen(mq, pstj.events.EventType.MEDIA_CHANGE, function(e) {
 *   console.log(mq.queryMatches);
 * });
 * </code>
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.MediaQuery');

goog.require('goog.async.nextTick');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.string');

goog.scope(function() {
var ETarget = goog.events.EventTarget;
var gs = goog.string;
var dom = goog.dom;


/**
 * Provides means to progamatically use media queries (as in CSS media queries).
 *
 * Native support is required for this to work, is support is missing and
 * debug mode is on an error will be thrown.
 *
 * The code wraps the native support in closure friendly class.
 *
 * @extends {ETarget}
 */
pstj.ui.MediaQuery = goog.defineClass(ETarget, {
  /**
   * @constructor
   * @param {!string} query The media query string.
   */
  constructor: function(query) {
    ETarget.call(this);
    if (!pstj.ui.MediaQuery.hasSupport) {
      if (goog.DEBUG) {
        throw new Error('MediaQuery not supported');
      }
    }
    /**
     * Reference to the query that is configured in the instance.
     * @type {!string}
     * @private
     */
    this.query_ = '';
    /**
     * The query object returned by the native functionality.
     * @type {?MediaQueryList}
     * @private
     */
    this.mediaQuery_ = null;
    /**
     * Cached helper function. The 'MediaQueryList' interface does not
     * provide helper to setup the context so we need to do it manually.
     * @type {!function(!MediaQueryList): void}
     * @private
     */
    this.bound_ = goog.bind(this.onQueryUpdate, this);
    /**
     * Flag to indicate if the current browser setup matches the query instance.
     * @type {!boolean}
     */
    this.queryMatches = false;
    // Init the query
    this.setQuery(query);
  },

  /**
   * Setup a new query on the instance.
   * @param {!string} query The query to match against.
   */
  setQuery: function(query) {
    if (this.mediaQuery_) {
      this.mediaQuery_.removeListener(this.bound_);
    }
    // Makes sure we use the correct syntax. Parentesys are required in the
    // native support so we check for those.
    if (!gs.startsWith(query, '(') || !gs.endsWith(query, ')')) {
      query = '(' + query + ')';
    }
    this.query_ = query;
    this.mediaQuery_ = dom.getWindow().matchMedia(this.query_);
    this.mediaQuery_.addListener(this.bound_);
    // Artificially trigger the checking of the match state so we can
    // have it in our instance.
    //
    // Note that the event for a match change will be fired on the next
    // tick so the user can register listeners after the reation of the
    // instance. See example for more details.
    this.onQueryUpdate(this.mediaQuery_);
  },

  /**
   * Handle the query match changes from the media query list.
   * @protected
   * @param {MediaQueryList} mq The instance that triggers the event.
   */
  onQueryUpdate: function(mq) {
    this.queryMatches = mq.matches;
    goog.async.nextTick(function() {
      this.dispatchEvent(pstj.ui.MediaQuery.EventType.MEDIA_CHANGE);
    }, this);
  },


  /** @override */
  disposeInternal: function() {
    goog.base(this, 'disposeInternal');
    this.mediaQuery_ = null;
  },

  statics: {
    /**
     * Flag to let us know if the needed browser support is present.
     * @type {boolean}
     */
    hasSupport: ('matchMedia' in window),

    /**
     * The event types used by this class.
     * @enum {!string}
     */
    EventType: {
      MEDIA_CHANGE: goog.events.getUniqueId('media-change')
    }
  }
});
});  // goog.scope
