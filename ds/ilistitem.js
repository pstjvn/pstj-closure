/**
 * @fileoverview Provides common interface for list item elements. This is
 * needed to accomodate the different types of server provided data.
 *
 * @author <regardingscot@gmail.com> (PeterStJ)
 */

goog.provide('pstj.ds.IListItem');
goog.provide('pstj.ds.RecordID');
goog.provide('pstj.ds.RecordValue');


/**
 * Defines a custom type that can be the record ID.
 * @typedef {(string|number)}
 */
pstj.ds.RecordID;


/**
 * Defines a custom type that can be a value retrieved from record.
 * @typedef {(boolean|pstj.ds.RecordID)}
 */
pstj.ds.RecordValue;



/**
 * Interface for a list item object. If an object should be included in mapped
 * listings it should abide this interface.
 * @interface
 */
pstj.ds.IListItem = function() {};


/**
 * Getter for the raw data object used to instanciate the class. It could be
 * an object or an array or a simple value, depending on the implementation.
 * @return {?}
 */
pstj.ds.IListItem.prototype.getRawData = function() {};


/**
 * Updates the row data that is used to create the class instance without
 * destroying the list item object. This allows for preserving memory by
 * hot swapping the intrinsic value without removal and insertion on the main
 * list.
 * @param {pstj.ds.IListItem} node The list item that should replace this one.
 * @return {boolean} True if the raw data was successfully replaced.
 */
pstj.ds.IListItem.prototype.update = function(node) {};


/**
 * This is strictrly not part of the interface, but is a usable thing to have
 * and enforcing implementors to have it even as an empty function will
 * allow for more flexible code.
 */
pstj.ds.IListItem.prototype.convert = function() {};


/**
 * Returns the ID property of the raw data object. If the object is an array the
 * index is tranformed to string.
 * @return {!string}
 */
pstj.ds.IListItem.prototype.getIdProperty = function() {};


/**
 * Getter for the UID of the object.
 * @return {pstj.ds.RecordID}
 */
pstj.ds.IListItem.prototype.getId = function() {};


/**
 * Mutates/changes the underlying object in place. This allows to intercept
 * changes and emit events related to the changes. It also allows for seamless
 * access to deeply nested values of the raw object record.
 * @param {!string} property The property to alter. If the underlying
 * recod is an object a string would be expected, if an array is used then an
 * index would be more appropriate. In arrays the string will be coerced to
 * index with the shift operator.
 * @param {pstj.ds.RecordValue} value The new value to set.
 * @return {boolean} True if the property was succssfully set.
 */
pstj.ds.IListItem.prototype.mutate = function(property, value) {};


/**
 * Getter for a named property.
 * @param {!string} property The named property to get. In the case of arrays
 * being used as raw data record, the value will be coerced to number using the
 * shift operator.
 * @return {?pstj.ds.RecordValue}
 */
pstj.ds.IListItem.prototype.getProp = function(property) {};


/**
 * Clones the list item by copying the raw data value and wrapping it in an
 * instance of the wrapping class.
 * @return {pstj.ds.IListItem}
 */
pstj.ds.IListItem.prototype.clone = function() {};
