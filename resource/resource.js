goog.provide('pstj.resource');
goog.provide('pstj.resource.Local');
goog.provide('pstj.resource.Resource');

goog.require('goog.json.NativeJsonProcessor');
goog.require('goog.net.XhrIo');
goog.require('goog.storage.Storage');
goog.require('goog.storage.mechanism.mechanismfactory');
goog.require('goog.string');
goog.require('goog.uri.utils');
goog.require('pstj.configure');

/**
 * @fileoverview Provides abstracted resource management. The main use
 * case is remote data provider that utilizes only one execution path and a main
 * parameter to branch the action (as opposite to REST(ful) apis).
 * Example would be:
 * exec path /cgi-bin/main.cgi
 * main param action=
 * all other data merges as query string (or form data).
 * The instance supports caching of the resources (off by default) and
 * configuration on the parameters used to create the instance.
 * Example usage:
 * pstj.resource.configure({
 *  run: 'execaction',
 *  execPath: '/cgi-bin/mycontroler.cgi'
 * });
 * pstj.resource.getInstance().get({
 *  'execaction': 'getUser',
 *  'start': 1,
 *  'count': 20
 * }, function(Error, users) {}, true);
 * This will attempt to retrieve the users by creating url
 * /cgi-bin/mycontroler.cgi?execaction=getUser&start=1&count=20
 * Then it will check if this URL is already cached, if yes the cached result is
 * returned if not the request is sent and passed to the callback function.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * The name of the 'run' parameter, defaults to 'run' but can be configured.
 * @type {!string}
 * @private
 */
pstj.resource.run_ = 'run';

/**
 * The path to execute on the server.
 * @type {!string}
 * @private
 */
pstj.resource.execPath_ = '/cgi-bin/if.cgi';

/**
 * Configures the resource loader factory. Note that once an instance is
 *   created, configuration cannot be applied any longer, so make sure you
 *   configure it before you require the instance.
 * @param {{run:string, execPath:string}} options The configuration
 *   options to apply to the instance to be created.
 */
pstj.resource.configure = function(options) {
  if (!goog.isNull(pstj.resource.instance_)) {
    throw new Error('Once resource instance is created it cannot be ' +
      'reconfigured');
  }
  if (goog.isString(options.run)) {
    pstj.resource.run_ = options.run;
  }
  if (goog.isString(options.execPath)) {
    pstj.resource.execPath_ = options.execPath;
  }
};

/**
 * Reference to the storage provider. It is lazily created.
 * @type {goog.storage.Storage}
 * @private
 */
pstj.resource.storageProviderInstance_ = null;

/**
 * Getter for the storage provider. The provider is created the first time
 *   it is requested.
 * @return {goog.storage.Storage} The storage provider instance.
 */
pstj.resource.getStorageProvider = function() {
  if (goog.isNull(pstj.resource.storageProviderInstance_)) {
    pstj.resource.storageProviderInstance_ = new goog.storage.Storage(
        /** @type {!goog.storage.mechanism.Mechanism} */
        (goog.storage.mechanism.mechanismfactory.create()));
  }
  return pstj.resource.storageProviderInstance_;
};

/**
 * The Resource instance to provide to the whole application. This is
 *   intended to work only for single resource instance (i.e. application
 *   that use one exec / run pair and different resources are requested
 *   based on parameters / options and not on different exec paths.
 * @type {pstj.resource.Resource}
 * @private
 */
pstj.resource.instance_ = null;

/**
 * Getter for resource instance to be used in the session. If an instance
 *   has already been created it will be returned (single instance). If not
 *   one will be created and returned.
 * @return {pstj.resource.Resource} The instance of the Resource loader.
 */
pstj.resource.getInstance = function() {
  if (goog.isNull(pstj.resource.instance_)) {
    var resourceSource = pstj.configure.getRuntimeValue('PROVIDER', 'remote');
    switch (resourceSource) {
      case 'local':
        pstj.resource.instance_ = new pstj.resource.Local();
        break;
      case 'remote':
        pstj.resource.instance_ = new pstj.resource.Resource();
        break;
    }
  }
  return pstj.resource.instance_;
};

/**
 * Instance of the JSON processor to use in the Resource package.
 * @type {goog.json.NativeJsonProcessor}
 * @private
 */
pstj.resource.jsonProcessor_ = null;

/**
 * Getter for the JSON processor, lazily created.
 * @return {goog.json.NativeJsonProcessor} The shared processor instance.
 */
pstj.resource.getJsonProcessor = function() {
  if (goog.isNull(pstj.resource.jsonProcessor_)) {
    pstj.resource.jsonProcessor_ = new goog.json.NativeJsonProcessor();
  }
  return pstj.resource.jsonProcessor_;
};

/**
 * Builds query data for an URL from map / object.
 * @param {Object} data The data to use to build the query string.
 * @return {string} The built query string.
 */
pstj.resource.buildRequestParams = function(data) {
  return goog.uri.utils.buildQueryDataFromMap(data);
};

/**
 * Implementation that can be used by the resource package.
 * @constructor
 */
pstj.resource.Resource = function() {
  this.run_registry_ = {};
};

/**
 * Cache storage provider instance to use in the session.
 * @type {goog.storage.Storage}
 * @private
 */
pstj.resource.Resource.prototype.cache_ = null;

/**
 * Flag if the caching should be enabled.
 * @type {boolean}
 * @private
 */
pstj.resource.Resource.prototype.useCache_ = false;

/**
 * Registry used to configure default callbacks for run names.
 * @type {Object}
 * @private
 */
pstj.resource.Resource.prototype.run_registry_;

/**
 * Configured the cache. The basic idea here is to cache the results and
 *   make actual calls to the server only after the cache is dumped. This
 *   however means that the dumping action should not be forgotten and no
 *   updates from the server will arrive. Use this only on rarely changing
 *   data. Most useful for application code that does not want to deal with
 *   caching and does not need confirmation on updates.
 * @param {boolean} enable If true will enable caching of the responses.
 */
pstj.resource.Resource.prototype.enableCache = function(enable) {
  this.useCache_ = enable;
  if (goog.isNull(this.cache_)) {
    this.cache_ = pstj.resource.getStorageProvider();
  }
};

/**
 * Allows to predefine the call backs for the named 'run' method. This is
 *   useful mostly for application code that has only one consumer for any
 *   particular request.
 * @param {!string} run_name The name of the run to register default callback
 *   for.
 * @param {function(Error, (Object|Array)): void} callback The callback
 *   function to execute for the named request if no other callback is
 *   provided with the request.
 */
pstj.resource.Resource.prototype.registerRunCallback = function(run_name,
  callback) {
  this.run_registry_[run_name] = callback;
};

/**
 * Retrieves a resource by its name.
 * @param  {Object} data The resource to retrieve.
 * @param  {function(Error, (Object|Array)): void=} callback The
 *   callback to execute when a reply arrives.
 * @param {boolean=} opt_cache_request If set to true the response will be
 *   cached and will be dumped only when {@link #dumpCache} method is
 *   called.
 */
pstj.resource.Resource.prototype.get = function(data, callback,
  opt_cache_request) {
  if (!goog.isDefAndNotNull(data) || !goog.isString(data[pstj.resource.run_])) {
    throw new Error('Cannot create request without "run" value');
  }
  var url = pstj.resource.execPath_ + '?' + pstj.resource.buildRequestParams(
    data);

  if (!goog.isFunction(callback) && goog.isFunction(
    this.run_registry_[data[pstj.resource.run_]])) {
    callback = this.run_registry_[data[pstj.resource.run_]];
  }
  if (this.useCache_ && opt_cache_request == true) {
    if (goog.isDefAndNotNull(this.cache_.get(url))) {
      setTimeout(goog.bind(function() {
        callback(null, this.cache_.get(url));
      }, this), 10);
      return;
    }
  }
  this.sendRequest(url, callback, undefined, undefined, !!opt_cache_request);
};

/**
 * Tells the resource to forget all the stored cache data (i.e. the next time
 * a resource is requested it will be retrieved from the server.
 */
pstj.resource.Resource.prototype.dumpCache = function() {
  for (var k in this.cache_) {
    delete this.cache_[k];
  }
};

/**
 * Send data to the server as a POST request.
 * @param {Object} data The resource payload.
 * @param {function(Error, (Object|Array)): undefined} callback The callback to
 *   execute when a reply arrives.
 */
pstj.resource.Resource.prototype.post = function(data, callback) {
  if (!goog.isDefAndNotNull(data) || !goog.isString(data[pstj.resource.run_])) {
    throw new Error('Cannot create request without "run" value');
  }
  this.sendRequest(pstj.resource.execPath_, callback, 'POST',
    pstj.resource.buildRequestParams(data), false);
};

/**
 * Sends the request using xhrio package.
 * @param {!string} url The URL to send the request to.
 * @param {function(Error, (Object|Array)):void} callback The callback to
 *   apply on the result.
 * @param {string=} method The HTTP method to use to place the request. The
 *   default is GET.
 * @param {ArrayBuffer|Blob|Document|FormData|GearsBlob|string=} data The data
 *   to send as part of the request.
 * @param {boolean=} cache_response If true the response will be cached and
 *   used subsequently.
 * @protected
 */
pstj.resource.Resource.prototype.sendRequest = function(url,
    callback, method, data, cache_response) {
  goog.net.XhrIo.send(url, goog.bind(this.handleResponse, this, callback,
    cache_response, url), method, data);
};

/**
 * Handles the response from the server.
 * @param {function(Error, (Object|Array)): void} callback The callback function
 *   for this particular request.
 * @param {boolean} cache If true - cache the result and use it subsequently.
 * @param {string} url The URL served, used for the cache key.
 * @param {goog.events.Event} ev The XHR complete event.
 * @protected
 */
pstj.resource.Resource.prototype.handleResponse = function(callback, cache,
  url, ev) {

  var xhr = /** @type {goog.net.XhrIo} */ (ev.target);
  var response = null;
  var error = null;
  try {
    response = pstj.resource.getJsonProcessor().parse(xhr.getResponseText());
    if (this.useCache_ && cache) {
      this.cache_.set(url, response);
    }
  } catch (e) {
    error = e;
  }
  if (!goog.isDefAndNotNull(response) || goog.isString(response)) {
    error = new Error('The result of JSON evaluation was not useful');
  }
  if (goog.isFunction(callback)) {
    callback(error, /** @type {Array|Object} */ (response));
  }
};

/**
 * Provides mechanism for subclasses to load stub data and query it. The
 *   stubs are expected to match only the run parameter by value so options
 *   cannot be used in the stubs at this time.
 * @param {Object} data The stubs to load and use to reply to queries.
 */
pstj.resource.Resource.prototype.loadStubs = goog.nullFunction;

/**
 * Provides stub-able implementation for the Resource class. The resource
 *   package might return it but one should check the instance before
 *   attempting to load stubs and those should be used only in development.
 * @constructor
 * @extends {pstj.resource.Resource}
 */
pstj.resource.Local = function() {
  goog.base(this);
  this.stubs = {};
};
goog.inherits(pstj.resource.Local, pstj.resource.Resource);

/** @inheritDoc */
pstj.resource.Local.prototype.loadStubs = function(stubs) {
  this.stubs = stubs;
};

/** @inheritDoc */
pstj.resource.Local.prototype.get = function(data, callback, use_cache) {
  var cb = goog.isFunction(callback) ? callback :
    this.run_registry_[data[pstj.resource.run_]];
  var run = data[pstj.resource.run_];
  setTimeout(goog.bind(function() {
    cb(undefined, this.stubs[run]);
  }, this), 200);
};


