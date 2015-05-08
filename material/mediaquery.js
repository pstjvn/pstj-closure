/**
 * @fileoverview Default implementation for the medial query utility. This class
 * allows the user to set up a media query in code and listen for changes on it
 * to respond thresholds in the view. Similar to the CSS media query utilities
 * it is constructed as string and registered on the document.
 *
 * Example usage:
 * <code>
 * var mq = new pstj.material.MediaQuery('max-width:600px');
 * goog.events.listen(mq, pstj.material.EventType.MEDIA_CHANGE, function(e) {
 *   console.log(mq.queryMatches);
 * });
 * </code>
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.MediaQuery');

goog.require('goog.async.nextTick');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('pstj.material.EventType');


/**
 * Implementation for the media query class for material design.
 */
pstj.material.MediaQuery = goog.defineClass(goog.events.EventTarget, {
  /**
   * Provides the utilities for creating and using media queries inside the
   * application.
   * @constructor
   * @param {!string} query The query to match against.
   * @extends {goog.events.EventTarget}
   */
  constructor: function(query) {
    goog.events.EventTarget.call(this);
    if (!pstj.material.MediaQuery.hasMediaSupport) {
      // TODO: fix the behavior, throwing on instance creation is not a very
      // nice practice
      throw new Error('Browser does not support matchMedia');
    }
    /**
     * Reference to the query that is configured in the instance.
     * @type {!string}
     * @private
     */
    this.query_ = '';
    /**
     * The query object returned by the native functionality.
     * @type {MediaQueryList}
     * @private
     */
    this.mediaQuery_ = null;
    /**
     * Cached helper function. The 'MediaQueryList' interface does not
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
      this.dispatchEvent(pstj.material.EventType.MEDIA_CHANGE);
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
    hasMediaSupport: ('matchMedia' in window)
  }
});
