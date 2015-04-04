/**
 * @fileoverview Provides abstracted resource management. The main use
 * case is remote data provider that utilizes only one execution path and a main
 * parameter to branch the action (as opposite to REST(ful) apis).
 *
 * Example would be:
 *
 * exec path /cgi-bin/main.cgi
 * main param action=
 *
 * all other data merges as query string (or form data).
 *
 * The instance supports caching of the resources (off by default) and
 * configuration on the parameters used to create the instance.
 *
 * Example usage:
 * <pre>
 * pstj.resource.configure({
 *  run: 'action',
 *  execPath: '/cgi-bin/mycontroler.cgi'
 * });
 *
 * pstj.resource.getInstance().get({
 *  'execaction': 'getUser',
 *  'start': 1,
 *  'count': 20
 * }, function(err, result) {}, true);
 * </pre>
 *
 * This will eventually be translated into an URL as follows:
 * <pre>
 * /cgi-bin/mycontroler.cgi?action=getUser&start=1&count=20
 * </pre>
 *
 * A check will be made (based on the 'run' parameter) if cache is enabled and
 * if the result is cached, if both are true the cached value will be returned,
 * else the server will be send the resulting URL. The result will be passed
 * to the callback if the result can be parsed and matches validity checks.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.resource');
goog.provide('pstj.resource.Local');
goog.provide('pstj.resource.Resource');

goog.require('goog.async.nextTick');
goog.require('goog.json.NativeJsonProcessor');
goog.require('goog.net.Jsonp');
goog.require('goog.net.XhrIo');
goog.require('goog.string');
goog.require('goog.uri.utils');
goog.require('pstj.configure');
goog.require('pstj.storage.Storage');


/**
 * The object that we expect for configuration of the resource package.
 *
 * @typedef {{run:string, execPath:string, crossdomain: (boolean|undefined)}}
 */
pstj.resource.Configuration;


/**
 * Configures the resource loader factory. Note that once an instance is
 * created, configuration cannot be applied any longer, so make sure you
 * configure it before you require the instance.
 *
 * @param {!pstj.resource.Configuration} options The configuration options
 *    to apply to the instance to be created.
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
  if (goog.isBoolean(options.crossdomain)) {
    pstj.resource.crossDomain_ = options.crossdomain;
  }
};


/**
 * The name of the 'run' parameter, defaults to 'run'.
 * @type {!string}
 * @private
 */
pstj.resource.run_ = 'run';


/**
 * The path to execute on the server.
 *
 * @type {!string}
 * @private
 */
pstj.resource.execPath_ = '/cgi-bin/if.cgi';


/**
 * Flag telling the resource loader if some of the resources are to be loaded
 * cross domain (i.e. with JSONP). If it is set to true all resources will be
 * attempted to be loaded using JSONP calls. Make sure all requests support
 * that before enabling!
 *
 * @type {!boolean}
 * @private
 */
pstj.resource.crossDomain_ = false;


/**
 * Reference to the storage provider, lazily created to preserve memory.
 *
 * @type {goog.storage.Storage}
 * @private
 */
pstj.resource.storageProviderInstance_ = null;


/**
 * The Resource instance to provide to the whole application. This is
 *   intended to work only for single resource instance (i.e. application
 *   that use one exec / run pair and different resources are requested
 *   based on parameters / options and not on different exec paths.
 *
 * @type {pstj.resource.Resource}
 * @private
 */
pstj.resource.instance_ = null;


/**
 * Getter for resource instance to be used in the session. If an instance
 * has already been created it will be returned (single instance). If not
 * one will be created and then returned.
 *
 * @return {pstj.resource.Resource} The instance of the Resource loader.
 */
pstj.resource.getInstance = function() {
  if (goog.isNull(pstj.resource.instance_)) {
    var resourceSource = pstj.configure.getRuntimeValue('DATASTREAM',
        'remote').toString();

    // Decide which implementation to use. If you have other implementation you
    // want to use simply use it directly and hold reference to it.
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
 *
 * @type {goog.json.NativeJsonProcessor}
 * @private
 */
pstj.resource.jsonProcessor_ = null;


/**
 * Getter for the JSON processor, lazily created. The instance is used to parse
 * responses from the 'get' action where the server is expected to return JSON
 * encoded value.
 *
 * FIXME: update the code to support arbirtary response parsing.
 *
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
 *
 * @param {!Object<string, *>} data The data to use to build the query string.
 * @return {string} The built query string.
 */
pstj.resource.buildRequestParams = function(data) {
  return goog.uri.utils.buildQueryDataFromMap(data);
};



/**
 * Implementation that can be used by the resource package.
 * FIXME: the resource package has multiple checks to assure that the
 * result from a request is an array or an object, while in reality it can be
 * anything, including an empty string or undefined. This should be cleared out.
 * @constructor
 */
pstj.resource.Resource = function() {
  /**
   * Registry used to configure default callbacks for run names.
   * @type {Object}
   * @private
   */
  this.run_registry_ = {};
  /**
   * Cache storage provider instance to use in the session.
   * @type {goog.storage.Storage}
   * @private
   */
  this.cache_ = null;
  /**
   * Flag if the caching should be enabled.
   * @type {boolean}
   * @private
   */
  this.useCache_ = false;
};


/**
 * Configures the cache. The basic idea here is to cache the results and
 * make actual calls to the server only after the cache is dumped. This
 * however means that the dumping action should not be forgotten and no
 * updates from the server will arrive. Use this only on rarely changing
 * data. Most useful for application code that does not want to deal with
 * caching and does not need confirmation on updates.
 *
 * @param {boolean} enable If true will enable caching of the responses.
 */
pstj.resource.Resource.prototype.enableCache = function(enable) {
  return;
  // this.useCache_ = enable;
  // if (this.useCache_) {
  //   if (goog.isNull(this.cache_)) {
  //     this.cache_ = pstj.storage.Storage.getInstance();
  //   }
  // }
};


/**
 * Tells the resource to forget all the stored cache data (i.e. the next time
 * a resource is requested it will be retrieved from the server.
 */
pstj.resource.Resource.prototype.dumpCache = function() {
};


/**
 * Allows to predefine the call backs for the named 'run' method. This is
 * useful mostly for application code that has only one consumer for any
 * particular request.
 *
 * @param {!string} run_name The name of the run to register default callback
 * for.
 * @param {function(Error, ?): void} callback The callback function to execute
 * for the named request if no other callback is provided with the request.
 */
pstj.resource.Resource.prototype.registerRunCallback = function(run_name,
    callback) {
  this.run_registry_[run_name] = callback;
};


/**
 * Retrieves a resource by its name.
 *
 * @param  {Object<string, *>} data Descriptior for the resource to retrieve.
 *    It should contain property matching the 'run' property of the
 *    configuration.
 * @param  {function(Error, ?): void=} opt_callback The callback to execute
 *    when a reply arrives.
 * @param {boolean=} opt_cache_request If set to true the response will be
 *    cached and will be dumped only when {@link #dumpCache} method is called,
 *    otherwise it will be used for subsequent response value.
 */
pstj.resource.Resource.prototype.get = function(data, opt_callback,
    opt_cache_request) {

  if (!goog.isDefAndNotNull(data) || !goog.isString(data[pstj.resource.run_])) {
    throw new Error('Cannot create request without "run" value');
  }

  var url = pstj.resource.execPath_ + '?' + pstj.resource.buildRequestParams(
      data);

  // If no callback is specified and run registry has default callback
  // handler for this particular action use it instead.
  if (!goog.isFunction(opt_callback) && goog.isFunction(
      this.run_registry_[data[pstj.resource.run_]])) {
    opt_callback = this.run_registry_[data[pstj.resource.run_]];
  }

  // If cache is enabled and the request is specified as cachable check to
  // see if we already have itin cache, if yes use it!
  if (this.useCache_ && opt_cache_request == true) {
    if (goog.isDefAndNotNull(this.cache_.get(url))) {
      goog.async.nextTick(function() {
        opt_callback(null, this.cache_.get(url));
      }, this);
      // we will use the local copy, do not send the request.
      return;
    }
  }

  // Finally send the request if needed.
  this.sendRequest(url, opt_callback, undefined, undefined,
      !!opt_cache_request);
};


/**
 * Send data to the server as a POST request. This is an edge case and will not
 * work in JSONP configuration.
 *
 * @param {Object} data The resource payload.
 * @param {function(Error, ?): undefined} callback The callback to execute when
 * a reply arrives.
 */
pstj.resource.Resource.prototype.post = function(data, callback) {
  if (!goog.isDefAndNotNull(data) || !goog.isString(data[pstj.resource.run_])) {
    throw new Error('Cannot create request without "run" value');
  }
  // Throw if the resource manager is configured to use JSONP.
  if (pstj.resource.crossDomain_) {
    throw new Error('Cannot use POST method with corss domain JSONP');
  }

  this.sendRequest(pstj.resource.execPath_, callback, 'POST',
      pstj.resource.buildRequestParams(data), false);
};


/**
 * Sends the request using xhr or JSONP (depending on the configuration).
 * @param {!string} url The URL to send the request to.
 * @param {function(Error, ?):void} callback The callback to
 *   apply on the result.
 * @param {string=} opt_method The HTTP method to use to place the request. The
 *   default is GET.
 * @param {ArrayBuffer|Blob|Document|FormData|string=} opt_data The
 * data to send as part of the request.
 * @param {boolean=} opt_cache_response If true the response will be cached and
 *   used subsequently.
 * @protected
 */
pstj.resource.Resource.prototype.sendRequest = function(url,
    callback, opt_method, opt_data, opt_cache_response) {
  var bound = goog.bind(this.handleResponse, this, callback, opt_cache_response,
      url);
  // Branch depending on configuration.
  if (pstj.resource.crossDomain_) {
    (new goog.net.Jsonp(url)).send(goog.isObject(opt_data) ? opt_data : null,
        bound, bound);
  } else {
    goog.net.XhrIo.send(url, bound, opt_method, opt_data);
  }
};


/**
 * Default implementation for parsing a server response from XHR request. Here
 * several assumptions are made based on the fact that the class is written
 * basically for VM servers:
 * - the response is in text format
 * - the response is valid JSON serialized object
 * Override in subclasses to handle different types of data and convert it to
 * whatever is needed/expected.
 *
 * @param {!goog.net.XhrIo} xhr The xhr request, note that it is passed along to
 * allow subclasses to extract the data as fit is seen.
 * @return {*}
 */
pstj.resource.Resource.prototype.parseResponse = function(xhr) {
  return pstj.resource.getJsonProcessor().parse(xhr.getResponseText());
};


/**
 * Handles the response from the server.
 *
 * @param {function(Error, ?): void} callback The callback function
 * for this particular request.
 * @param {boolean} cache If true - cache the result and use it subsequently.
 * @param {string} url The URL served, used for the cache key.
 * @param {?} ev The XHR complete event or the result from JSONP (the result
 * object).
 * @protected
 */
pstj.resource.Resource.prototype.handleResponse = function(callback, cache,
    url, ev) {

  var response = null;
  var error = null;

  if (goog.isNull(ev)) {
    error = new Error('Error receiving data on jsonp channel (500)');
  } else if (ev instanceof goog.events.Event) {
    var xhr = /** @type {!goog.net.XhrIo} */ (ev.target);
    try {
      response = this.parseResponse(xhr);
    } catch (e) {
      error = e;
    }
  } else {
    response = ev;
  }

  if (goog.isNull(error)) {
    error = this.checkResponseValidity(response);
  }

  if (goog.isNull(error)) {
    if (this.useCache_ && cache) {
      this.cache_.set(url, response);
    }
  }

  if (goog.isFunction(callback)) {
    callback(error, response);
  }
};


/**
 * Check to make over the recieved response after it was parsed to make sure
 * that the data received is in a format that is expected by the application.
 *
 * @param {?} response The response from the server.
 * @protected
 * @return {?Error}
 */
pstj.resource.Resource.prototype.checkResponseValidity = function(response) {
  if (goog.isDefAndNotNull(response)) {
    return null;
  } else {
    if (goog.DEBUG) {
      console.log('Received invalid response', response);
    }
    return new Error('The server result is not valid (null)');
  }
};


/**
 * Provides mechanism for subclasses to load stub data and query it. The
 * stubs are expected to match only the run parameter by value so options
 * cannot be used in the stubs at this time.
 *
 * @param {Object} data The stubs to load and use to reply to queries.
 */
pstj.resource.Resource.prototype.loadStubs = goog.nullFunction;



/**
 * Provides stub-able implementation for the Resource class. The resource
 *   package might return it but one should check the instance before
 *   attempting to load stubs and those should be used only in development!
 *
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
    cb(null, this.stubs[run]);
  }, this), 20);
};
