goog.provide('pstj.ds.swagger.Document');

goog.require('goog.Uri');
goog.require('goog.array');


/**
 * Represents the parsed version of a swagger document.
 *
 * This class will contain all the needed items to build up a version of the
 * remote API for both constructing a text representation of the swagger API
 * (i.e. reconstruct the API from this representation as a JSON string) and
 * usable code representation that can work with the API instances (classes).
 *
 * Third usable feature of this representation is the capability to colllect
 * data similar to discovery documents and thus be subject of data binding
 * tracing for templates (POC needed).
 *
 * In order to make this compatible with discovery document it needs to use the
 * same interface(s) and class representation. This means that we need to have
 * a common denomination of the featires ASAP.
 */
pstj.ds.swagger.Document = class {
  /**
   * @param {!Object<string, ?>} map The parser from JSON swagger object.
   */
  constructor(map) {
    /**
     * The JSON parsed map of the swagger config.
     * @private {!Object<string, ?>}
     */
    this.map_ = map;
    this.name = '';
    this.description = '';
    this.version = '';
    this.host = '';
    /** @type {?goog.Uri} */
    this.path = null;
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
    var protocol = goog.array.contains(this.map_['schemes'], 'https') ?
        'https' : 'http';
    var host = this.map_['host'];
    var basepath = goog.isString(this.map_['basePath']) ?
        this.map_['basePath'] : '';
    var uri = new goog.Uri();
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
 * @return {!pstj.ds.swagger.Document}
 */
pstj.ds.swagger.Document.fromMap = function(jsonMap) {
  return new pstj.ds.swagger.Document(jsonMap);
};
