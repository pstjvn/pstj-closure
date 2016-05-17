/**
 * @fileoverview Provides storage for persistance. The default storage provider
 * in closure library uses non-native serializer which does not call the
 * <code>toJSON</code> method of the serialized component and this dissallows
 * data types to be safely stored. This class overcomes the issue by directly
 * using the native serializer which is guaranteed to always use the method if
 * present. Other than that the class also aims to provide abstraction over the
 * storage mechinism in the future. Currntly only the localStorage is used.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.storage.Storage');

goog.require('goog.json');
goog.require('goog.log');
goog.require('goog.storage.ErrorCode');
goog.require('goog.storage.mechanism.mechanismfactory');



/**
 * Storage abstraction that is able to store complex data types extracting only
 * the data records from them via the <code>toJSON</code> method.
 *
 * @constructor
 */
pstj.storage.Storage = function() {
  /**
   * @type {goog.storage.mechanism.IterableMechanism}
   * @private
   */
  this.mechanism_ = goog.storage.mechanism.mechanismfactory.create();
  if (goog.isNull(this.mechanism_)) {
    this.warn_();
  }
};
goog.addSingletonGetter(pstj.storage.Storage);


goog.scope(function() {

var _ = pstj.storage.Storage.prototype;


/**
 * @protected
 * @type {goog.debug.Logger}
 */
_.logger = goog.log.getLogger('pstj.storage.Storage');


/**
 * Get an item from the data storage.
 *
 * @param {string} key The key to get.
 * @return {*} Deserialized value or undefined if not found.
 */
_.get = function(key) {
  if (!goog.isNull(this.mechanism_)) {
    var json;
    try {
      json = this.mechanism_.get(key);
    } catch (e) {
      // If, for any reason, the value returned by a mechanism's get method is
      // not a string, an exception is thrown.  In this case, we must fail
      // gracefully instead of propagating the exception to clients.
      // See b/8095488 for details.
      return undefined;
    }
    if (goog.isNull(json)) {
      return undefined;
    }
    /** @preserveTry */
    try {
      return goog.json.parse(json);
    } catch (e) {
      throw goog.storage.ErrorCode.INVALID_VALUE;
    }
  } else {
    this.warn_();
  }
};


/**
 * Set an item in the data storage.
 *
 * @param {string} key The key to set.
 * @param {*} value The value to serialize to a string and save.
 */
_.set = function(key, value) {
  if (!goog.isNull(this.mechanism_)) {
    if (!goog.isDef(value)) {
      this.remove(key);
      return;
    }
    this.mechanism_.set(key, goog.json.serialize(value));
  } else {
    this.warn_();
  }
};


/**
 * Remove an item from the data storage.
 *
 * @param {string} key The key to remove.
 */
_.remove = function(key) {
  if (!goog.isNull(this.mechanism_)) {
    this.mechanism_.remove(key);
  } else {
    this.warn_();
  }
};


/**
 * Issue a warning when debugging.
 * @private
 */
_.warn_ = function() {
  goog.log.error(this.logger,
      'Storage mechanism unavailable, private browsing?');
};

});  // goog.scope
