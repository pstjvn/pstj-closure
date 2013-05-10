/**
* @fileoverview Provides data source item basic for handling JSON data.
* The idea is that instead of providing extern definitions for each JSON
* structure, one can use subclass of this interface to access  JSON structure.
* Recent changes in the implementation allow any nested structure to be
* accessed with the same ease.
*
* @author  regardingscot@gmail.com (Peter StJ)
*/

goog.provide('pstj.ds.ListItem');
goog.provide('pstj.ds.ListItem.EventType');

goog.require('goog.asserts');
goog.require('goog.events.EventTarget');
goog.require('goog.object');
goog.require('goog.string');
goog.require('pstj.object');


/**
 * Implements custom list item, more useful than dump Data Node. Recent changes
 *   allow for any nesting in the data node to be used and accessed from the
 *   getProp method.
 *
 * Example: assuming the following object:
 * <pre> { name: { first: 'Peter',
 *   last: 'StJ' }, born: { date: 13743848343000, location: { city: 'Varna',
 *   country: 'Bulgaria', continent: 'Europe', lat: 43, lon: 25 } } }
 * </pre>
 * one can access the nested data easily unrestricted by closure renaming:
 * <pre> myobj.getProp('born.location.city');// == 'Varna'; </pre>
 *
 * NEW: The code was reviewed and events have been added to support custom
 *   event of 'update', useful when more than one view is using the same data
 *   structure for its presentation.
 * @constructor
 * @extends {goog.events.EventTarget}
 * @param {Object} data The data to use as source for the item.
 * @param {string=} id_property The name of the ID property to look up.
*/
pstj.ds.ListItem = function(data, id_property) {
  goog.base(this);
  this.data_ = data;
  if (goog.isString(id_property)) {
    this.id_property_ = id_property;
  }
  this.convert();
};
goog.inherits(pstj.ds.ListItem, goog.events.EventTarget);


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
 * Provides the Event type to listen for in controllers that might use this
 *   data structure.
 * @enum {string}
 */
pstj.ds.ListItem.EventType = {
  UPDATE: goog.events.getUniqueId('update'),
  DELETE: goog.events.getUniqueId('delete')
};

/**
 * Holds reference to the data object of the structure.
 * @type {Object}
 * @private
 */
pstj.ds.ListItem.prototype.data_;

/**
 * Holds reference to the ID property to be looked up when the get id method
 *   is used.
 * @type {string}
 * @private
 */
pstj.ds.ListItem.prototype.id_property_ = 'id';

// Implement the basic methods (interface)

/**
 * Getter for the property name that identifies the UID of the data record.
 *   This method is considered protected. If you need to change the ID
 *   property, subclass this class and override the method.
 * @protected
 * @return {!string} The property name as string.
 */
pstj.ds.ListItem.prototype.getIdProperty = function() {
  return this.id_property_;
};

/**
 * Getter for the raw data model used in the type record.
 * @return {Object} The raw data, should be single level object.
 */
pstj.ds.ListItem.prototype.getRawData = function() {
  return /** @type {Object} */ (this.data_);
};

/**
 * Method to update the data on the record type with new literal object. It
 *   will check if the ID of the record type provided for the update of this
 *   record type is the same.
 * @param  {pstj.ds.ListItem} node The record type to use for the update.
 * @return {boolean} True if an update has been performed, otherwise false.
 */
pstj.ds.ListItem.prototype.update = function(node) {
  if (this.getId() == node.getId()) {
    return this.set_(node);
  } else {
    return false;
  }
};

/**
 * Coerce the raw data if needed. This includes permutations over the ojbect
 *   literal to make complex object abide the application logic. By default it
 *   does nothing.
 * @protected
 */
pstj.ds.ListItem.prototype.convert = function() {};

/**
 * Method that should return the unique ID of the data.
 * @return {pstj.ds.RecordID} The unique ID in the data record.
 */
pstj.ds.ListItem.prototype.getId = function() {
  var result = this.getProp(this.getIdProperty());
  result = goog.string.trim(result.toString());
  return result;
};


/**
 * Method to mutate the raw data directly. While the 'update' method expects
 *   the raw data (lliteral object) as a parameter and make sure only that the
 *   ids matche and overrides the raw data reference entierly, this method
 *   mutates the raw data record property by property. It will also check the
 *   type of the data to be the same. Note that complext references cannot be
 *   mutated with this method, only primitive types are supported. Also one
 *   cannot mutate the ID of the raw data object and thus the id of the list
 *   item.
 * @param {string} property The name of the property in the raw data to
 *   update.
 * @param {pstj.ds.RecordValue} value The value to update to.
 * @return {boolean} True if the object was mutated, false otherwise.
 */
pstj.ds.ListItem.prototype.mutate = function(property, value) {
  if (property == this.getIdProperty()) {
    throw new Error('Cannot mutate the item id');
  }
  var props = property.split('.');
  var name = goog.asserts.assertString(goog.array.peek(props));
  var result = this.getNestedProperty_(props);

  if (goog.isNull(result)) return false;

  var oldvalue = goog.object.get(result, name);

  if (goog.typeOf(oldvalue) != 'object' &&
    goog.typeOf(value) == goog.typeOf(oldvalue)) {

    result[name] = value;
    this.dispatchEvent(pstj.ds.ListItem.EventType.UPDATE);
    return true;
  } else {
    return false;
  }
};

/**
 * Finds the raw data recod matching the looked up nested name.
 * @private
 * @param {Array.<string>} props The names to search.
 * @return {?Object}
 */
pstj.ds.ListItem.prototype.getNestedProperty_ = function(props) {
  var result = this.getRawData();
  var len = props.length - 1;
  for (var i = 0; i < len; i++) {
    if (goog.isDefAndNotNull(result[props[i]])) {
      result = result[props[i]];
    } else {
      result = null;
      break;
    }
  }
  return result;
};

/**
 * Universal getter for properties of the raw data. The return type could be
 *   any type supported by JSON (i.e. string, number or boolean).
 * @param  {string} prop The property name to look up.
 * @return {?pstj.ds.RecordValue} The found property name or null.
 */
pstj.ds.ListItem.prototype.getProp = function(prop) {
  var props = prop.split('.');
  var result = this.getNestedProperty_(props);
  if (goog.isNull(result)) return result;
  if (goog.isDef(result[goog.array.peek(props)])) {
    return result[goog.array.peek(props)];
  } else {
    return null;
  }
};

/** @inheritDoc */
pstj.ds.ListItem.prototype.disposeInternal = function() {
  // Notify controllers that use this about the deletion.
  this.dispatchEvent(pstj.ds.ListItem.EventType.DELETE);
  // cleanup, make sure to not retain the data.
  this.data_ = null;
  goog.base(this, 'disposeInternal');
};

/**
 * Overrides the stored data. The implementation is not transparent, i.e.
 *   the new data will only override existing data, omitting the ID
 *   property. If at least one property has changed the change event will be
 *   fired.
 * @private
 * @param {pstj.ds.ListItem} data The raw data to use for the overriding.
 * @return {boolean} True if the item has been updated, false otherwise.
 */
pstj.ds.ListItem.prototype.set_ = function(data) {
  // Do NOT override the ID property
  var rdata = data.getRawData();
  var idprop = this.getIdProperty();
  var updated = false;

  if (!goog.isDefAndNotNull(rdata[idprop]) || rdata[idprop] != this.getId()) {
    throw Error('Cannot update unique ID property, it is immutable and the' +
      ' data provided does not match the record.');
  }

  if (pstj.object.deepEquals(this.getRawData(), rdata)) return false;

  for (var key in rdata) {
    if (key == idprop) continue;
    if (this.data_[key] != rdata[key])
      this.data_[key] = rdata[key];
      updated = true;
  }
  // TODO: iterate over implementation that actually fires the event only when
  // updated and check for use patterns that might benefit from this.
  //if (updated)
    this.dispatchEvent(pstj.ds.ListItem.EventType.UPDATE);
  return updated;
};

/**
 * Overrides the default behavior to allow easier serialization of wrapped
 *   data objects.
 * @override
 * @this {pstj.ds.ListItem}
 */
pstj.ds.ListItem.prototype['toJSON'] = function() {
  return this.getRawData();
};


/**
 * Returns a new item that is a raw data clone of this item.
 * @return {pstj.ds.ListItem} The clones item.
 */
pstj.ds.ListItem.prototype.clone = function() {
  return new pstj.ds.ListItem(goog.asserts.assertObject(
    goog.object.unsafeClone(this.getRawData())));
};
