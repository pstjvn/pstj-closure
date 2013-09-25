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

goog.require('goog.json.NativeJsonProcessor');
goog.require('goog.storage.Storage');
goog.require('goog.storage.mechanism.mechanismfactory');



/**
 * Storage abstraction that is able to store complex data types extracting only
 * the data records from them via the <code>toJSON</code> method.
 *
 * @constructor
 */
pstj.storage.Storage = function() {
  /**
   * @type {!goog.storage.mechanism.Mechanism}
   * @private
   */
  this.mechanism_ = pstj.storage.Storage.getStorageBackend();
  /**
   * @type {goog.json.Processor}
   * @protected
   */
  this.serializer = new goog.json.NativeJsonProcessor();
};
goog.addSingletonGetter(pstj.storage.Storage);


/**
 * Provides the storage mechanism to use when storing data. Current
 * implementation is limited to localStorage. Future iplementation should use a
 * wrapper for ls/idb.
 *
 * @return {!goog.storage.mechanism.Mechanism}
 */
pstj.storage.Storage.getStorageBackend = function() {
  return /** @type {!goog.storage.mechanism.Mechanism} */ (
      goog.storage.mechanism.mechanismfactory.create());
};


goog.scope(function() {

var _ = pstj.storage.Storage.prototype;


/**
 * Get an item from the data storage.
 *
 * @param {string} key The key to get.
 * @return {*} Deserialized value or undefined if not found.
 */
_.get = function(key) {
  var json;
  try {
    json = this.mechanism_.get(key);
  } catch (e) {
    // If, for any reason, the value returned by a mechanism's get method is not
    // a string, an exception is thrown.  In this case, we must fail gracefully
    // instead of propagating the exception to clients.  See b/8095488 for
    // details.
    return undefined;
  }
  if (goog.isNull(json)) {
    return undefined;
  }
  /** @preserveTry */
  try {
    return this.serializer.parse(json);
  } catch (e) {
    throw goog.storage.ErrorCode.INVALID_VALUE;
  }
};


/**
 * Set an item in the data storage.
 *
 * @param {string} key The key to set.
 * @param {*} value The value to serialize to a string and save.
 */
_.set = function(key, value) {
  if (!goog.isDef(value)) {
    this.remove(key);
    return;
  }
  this.mechanism_.set(key, this.serializer.serialize(value));
};


/**
 * Remove an item from the data storage.
 *
 * @param {string} key The key to remove.
 */
_.remove = function(key) {
  this.mechanism_.remove(key);
};

});  // goog.scope
