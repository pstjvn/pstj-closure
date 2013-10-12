/**
* @fileoverview Provides data source item basic for handling JSON data.
* The idea is that instead of providing extern definitions for each JSON
* structure, one can use subclass of this interface to access  JSON structure.
* Recent changes in the implementation allow any nested structure to be
* accessed with the same ease.
*
* Update: 8/13 - allow the structure to use Arrays as data sources.
*
* @author regardingscot@gmail.com (Peter StJ)
*/

goog.provide('pstj.ds.ListItem');
goog.provide('pstj.ds.ListItem.EventType');

goog.require('goog.asserts');
goog.require('goog.events.EventTarget');
goog.require('goog.object');
goog.require('goog.string');
goog.require('pstj.ds.IListItem');
goog.require('pstj.object');



/**
 * Implements custom list item, more useful than dumb Data Node. Recent changes
 * allow for any nesting in the data node to be used and accessed from the
 * getProp method.
 *
 * Example: assuming the following object:
 * <pre>
 * { name:
 *   { first: 'Peter',
 *     last: 'StJ'
 *   },
 *   born: {
 *     date: 13743848343000,
 *     location: {
 *       city: 'Varna',
 *       country: 'Bulgaria',
 *       continent: 'Europe',
 *       lat: 43,
 *       lon: 25
 *     }
 *   }
 * }
 * </pre>
 * one can access the nested data easily unrestricted by closure renaming:
 * <pre> myobj.getProp('born.location.city');// == 'Varna'; </pre>
 * It is also possible to use array as dats source for the list item:
 * <pre>
 * var item = new pstj.ds.ListItem(['0,32,'Peter']);
 * var Props = {
 *   AGE: '1',
 *   NAME: '2'
 * }
 * item.getProp(Props.AGE); // 32 - the age of the person.
 * </pre>
 *
 * NEW: The code was reviewed and events have been added to support custom
 * event of 'update', useful when more than one view is using the same data
 * structure for its presentation.
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 * @implements {pstj.ds.IListItem}
 * @param {Object|Array} data The data to use as source for the item.
 * @param {string=} opt_id_proprety The name of the ID property to look up.
 */
pstj.ds.ListItem = function(data, opt_id_proprety) {
  goog.base(this);
  // because the data source could be either an object or an array and arrays
  // are objects, check only for object
  goog.asserts.assertObject(data,
      'List item can use only object literals as data source');

  /**
   * Reference to the raw data record type for this item.
   *
   * @type {Object|Array}
   * @private
   */
  this.data_ = data;
  /**
   * What will be the name of the ID. This is provided for compatibility.
   *
   * @type {string}
   * @private
   */
  this.id_property_ = (goog.isDef(opt_id_proprety) && !goog.string.isEmpty(
      opt_id_proprety)) ? opt_id_proprety : 'id';

  this.convert();
};
goog.inherits(pstj.ds.ListItem, goog.events.EventTarget);


/**
 * Provides the Event type to listen for in controllers that might use this
 * data structure.
 *
 * @enum {string}
 */
pstj.ds.ListItem.EventType = {
  UPDATE: goog.events.getUniqueId('update'),
  DELETE: goog.events.getUniqueId('delete')
};


/**
 * Getter for the raw data model used in the type record.
 * @return {Object|Array} The raw data, should be single level object or an
 * array.
 */
pstj.ds.ListItem.prototype.getRawData = function() {
  return this.data_;
};


/**
 * Method that should return the unique ID of the data.
 * @return {pstj.ds.RecordID} The unique ID in the data record.
 */
pstj.ds.ListItem.prototype.getId = function() {
  var result = this.getProp(this.getIdProperty());
  if (goog.isNull(result)) {
    throw new Error('The ID of the raw record is null');
  }
  if (goog.isBoolean(result)) {
    throw new Error('The UID should be number or a string');
  }
  return result;
};


/**
 * Universal getter for properties of the raw data. The return type could be
 * any type supported by JSON (i.e. string, number or boolean).
 * @param  {string} prop The property name to look up.
 * @return {?pstj.ds.RecordValue} The found property name or null.
 */
pstj.ds.ListItem.prototype.getProp = function(prop) {
  var props = prop.split('.');
  return this.getNestedValue_(props);
};


/**
 * Method to update the data on the record type with new literal object. It
 * will check if the ID of the record type provided for the update of this
 * record type is the same.
 * @param  {pstj.ds.IListItem} node The record type to use for the update.
 * @return {boolean} True if an update has been performed, otherwise false.
 */
pstj.ds.ListItem.prototype.update = function(node) {
  if (this.getId() == node.getId()) {
    goog.asserts.assertInstanceof(node, pstj.ds.ListItem,
        'You should not mix implementation of list items');
    return this.set_(/** @type {pstj.ds.ListItem} */ (node));
  } else {
    return false;
  }
};


/**
 * Method to mutate the raw data directly. While the 'update' method expects
 * the raw data (literal object) as a parameter and make sure only that the
 * ids matche and overrides the raw data reference entierly, this method
 * mutates the raw data record property by property. It will also check the
 * type of the data to be the same. Note that complext references cannot be
 * mutated with this method, only primitive types are supported. Also one
 * cannot mutate the ID of the raw data object and thus the id of the list
 * item.
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
 * Returns a new item that is a raw data clone of this item.
 * @return {pstj.ds.ListItem} The clones item.
 */
pstj.ds.ListItem.prototype.clone = function() {
  return new pstj.ds.ListItem(goog.asserts.assertObject(
      goog.object.unsafeClone(this.getRawData())));
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


/** @inheritDoc */
pstj.ds.ListItem.prototype.disposeInternal = function() {
  // Notify controllers that use this about the deletion.
  this.dispatchEvent(pstj.ds.ListItem.EventType.DELETE);
  // cleanup, make sure to not retain the data.
  this.data_ = null;
  goog.base(this, 'disposeInternal');
};


/**
 * Coerce the raw data if needed. This includes permutations over the ojbect
 * literal to make complex object abide the application logic. By default it
 * does nothing.
 *
 * @protected
 */
pstj.ds.ListItem.prototype.convert = function() {};


/**
 * Getter for the property name that identifies the UID of the data record.
 * This method is considered protected. If you need to change the ID
 * property, subclass this class and override the method.
 * @protected
 * @return {!string} The property name as string.
 */
pstj.ds.ListItem.prototype.getIdProperty = function() {
  return this.id_property_;
};


/**
 * Finds the raw data recod matching the looked up nested name.
 * @private
 * @param {Array.<string>} props The names to search.
 * @return {Object|Array|null}
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
 * Finds the raw data recod matching the looked up nested name.
 * @private
 * @param {Array.<string>} props The names to search.
 * @return {?pstj.ds.RecordValue}
 */
pstj.ds.ListItem.prototype.getNestedValue_ = function(props) {
  var result = this.getRawData();
  var len = props.length;
  for (var i = 0; i < len; i++) {
    result = result[props[i]];
    if (!goog.isDefAndNotNull(result)) {
      return null;
    }
  }
  return result;
};


/**
 * Overrides the stored data. The implementation is not transparent, i.e.
 * the new data will only override existing data, omitting the ID
 * property. If at least one property has changed the change event will be
 * fired.
 * @private
 * @param {pstj.ds.ListItem} data The raw data to use for the overriding.
 * @return {boolean} True if the item has been updated, false otherwise.
 */
pstj.ds.ListItem.prototype.set_ = function(data) {
  // Do NOT override the ID property
  // var rdata = data.getRawData();
  // var idprop = this.getIdProperty();
  // var updated = false;

  if (data.getId() != this.getId()) {
    throw Error('Cannot update unique ID property, it is immutable and the' +
        ' data provided does not match the record.');
  }

  if (pstj.object.deepEquals(this.getRawData(), data.getRawData())) {
    return false;
  }

  // At the time of this writing it is pointless to iterate over the
  // raw data keys/indexes becasue the change event is always fired, for now
  // we can safly reassign the record data to the new one.
  this.data_ = data.getRawData();

  // TODO: iterate over implementation that actually fires the event only when
  // updated and check for use patterns that might benefit from this.
  //if (updated)
  this.dispatchEvent(pstj.ds.ListItem.EventType.UPDATE);
  return true;
};
