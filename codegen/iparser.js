goog.provide('pstj.codegen.IParser');



/**
 * The interface for all parsers. We want the implementation to be able to
 * accept a map (JSON generated object) and provide us with a document that
 * described the whole API.
 *
 * Currently we aim to support:
 * - swagger 2.0
 * - discovery 1.0
 * - custom json-scheme (sysmaster branch)
 *
 * @interface
 * @param {!Object<string, ?>} map
 */
pstj.codegen.IParser = function(map) {};


/**
 * A parser must implement this method and return a valid document describing
 * the remote API.
 *
 * @return {!pstj.codegen.node.Document}
 */
pstj.codegen.IParser.prototype.getDocument = function() {};