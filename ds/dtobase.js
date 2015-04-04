goog.provide('pstj.ds.DtoBase');

goog.require('goog.array');
goog.require('goog.events.EventTarget');


/** @extends {goog.events.EventTarget} */
pstj.ds.DtoBase = goog.defineClass(goog.events.EventTarget, {
  constructor: function() {
    goog.events.EventTarget.call(this);
  },

  /**
   * Handles the change by queuing update for the instance.em
   * @protected
   * @final
   */
  handleChange: function() {
    pstj.ds.DtoBase.addToQueue_(this);
  },

  /** @override */
  toJSON: function() {
    throw new Error('Serialization not implemented');
  },

  statics: {
    /**
     * @final
     * @private
     * @type {Array<pstj.ds.DtoBase>}
     */
    updateQueue_: [],

    /**
     * Adds an item to the update queue. The queue is pushed back for at least
     * the end of the update cycle so no duplicates will be possible.
     * @param {pstj.ds.DtoBase} item The instance we need to dispatch update
     *    event for.
     * @private
     */
    addToQueue_: function(item) {
      goog.array.insert(pstj.ds.DtoBase.updateQueue_, item);
    }
  }
});
