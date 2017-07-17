goog.provide('pstj.codegen.parser.helper');


/**
 * Implements the preprocessing needed for separate files describoing a single
 * API. In SysMaster tech each file describes a separate class. The classes do
 * not nessesarily describe an endpoint, instead it simply describes a data
 * structure. A class can reference another class in the same list.
 *
 * @param {!Array<!Object<string, ?>>} objectList
 * @return {!Object<string, ?>}
 */
pstj.codegen.parser.helper.sysmaster = objectList => {
  let api = {};
  objectList.forEach(item =>  {
    if (goog.isString(item['title'])) {
      api[item['title']] = item;
    } else {
      throw new Error('The Scheme-item does not have a title');
    }
  });
  return api;
};