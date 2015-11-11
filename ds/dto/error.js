/**
 * @fileoverview Provides the default error structure to use in RPC packets.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ds.dto.Error');

goog.require('pstj.ds.DtoBase');


/**
 * DTO for errors.
 * @extends {pstj.ds.DtoBase}
 */
pstj.ds.dto.Error = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /**
     * The server to use for responses.
     * @type {!string}
     */
    this.message = '';
    /**
     * If we should navigate internally.
     * @type {!string}
     */
    this.redirect = '';
  },

  /** @override */
  fromJSON: function(map) {
    this.message = a.assertString(map['msg']);
    this.redirect = a.assertString(map['redirect']);
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'msg': this.message,
      'redirect': this.redirect
    };
  }
});
