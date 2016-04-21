goog.module('pstj.ds.swagger.Document');

var array = goog.require('goog.array');
var Uri = goog.require('goog.Uri');
var QueryData = goog.require('goog.Uri.QueryData');

const Document = class Document {
  /**
   * @param {!Object<string, ?>} map
   */
  constructor(map) {
    /**
     * The JSON parsed map of the swagger.
     * @type {!Object<string, ?>}
     * @private
     */
    this.map_ = map;
    this.name = '';
    this.description = '';
    this.version = '';
    this.host = '';
    this.path = '';
    this.parseMap_();
  }

  /**
   * Processes the original swagger map and builds up the document structural
   * representation.
   * @private
   */
  parseMap_() {
    this.parseInfo();
    this.parseVersion();
    this.parsePath();
  }

  /**
   * Parse basic info panel.
   * @protected
   */
  parseInfo(info) {
    var info = this.map_['info'];
    this.name = info['title'];
    this.description = info['description'];
  }

  /**
   * Parse and set the path so the document knows where to make requests to.
   * @protected
   */
  parsePath() {
    var protocol = array.contains(this.map_['schemes'], 'https') ? 'https' :
        'http';
    var host = this.map_['host'];
    var basepath = goog.isString(this.map_['basePath']) ?
        this.map_['basePath'] : '';
    var uri = new Uri();
    uri.setScheme(protocol);
    uri.setDomain(host);
    uri.setPath(basepath);
    this.path = uri.toString();
  }

  /**
   * Parse the API version.
   * @protected
   */
  parseVersion() {
    var version = this.map_['info']['version'];
    var parsed = '';
    if (goog.isString(version)) {
      parsed = parseInt(version, 10);
      if (isNaN(parsed)) parsed = version;
      else parsed = parsed.toString();
      this.version = parsed;
    }
  }
};

/**
 * Create a new swagger document from a JSON parsed swagger map.
 * @param {!Object<string, ?>} jsonMap
 * @return {!Document}
 */
exports.fromMap = function(jsonMap) {
  return new Document(jsonMap);
};
