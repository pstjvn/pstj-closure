goog.provide('pstj.codegen.parser.helper');

goog.require('goog.array');


/**
 * Implements the preprocessing needed for separate files describoing a single
 * API. In SysMaster tech each file describes a separate class. The classes do
 * not nessesarily describe an endpoint, instead it simply describes a data
 * structure. A class can reference another class in the same list, but the
 * referencing is done by filename and not by object name (title). Because
 * of this we need to have the file names as well (withtout the extension).
 *
 * @param {!Array<!Object<string, ?>>} objectList
 * @param {!Array<string>} sourceList The list of files obtained.
 * @return {!Object<string, ?>}
 */
pstj.codegen.parser.helper.sysmaster = (objectList, sourceList) => {
  let api = {};
  goog.array.forEach(objectList, function(item, index) {
    if (goog.isString(item['title'])) {
      api[item['title']] = item;
      item['sourceFileName'] = sourceList[index].replace('.json', '');
    } else {
      throw new Error('The Scheme-item does not have a title');
    }
  });
  return api;
};