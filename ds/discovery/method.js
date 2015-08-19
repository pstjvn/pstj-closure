/**
 * @fileoverview Provides parsing for a method definition in the discovery
 * document.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('pstj.ds.discovery.Method');

goog.require('goog.array');
goog.require('goog.object');
goog.require('pstj.ds.discovery.Parameter');


/** Implementation */
pstj.ds.discovery.Method = goog.defineClass(null, {
  /**
   * @constructor
   * @param  {string} name          The name of the parameter.
   * @param  {Object} scheme        The scheme.
   * @param  {string=} opt_namespace Optional namespace for resources.
   */
  constructor: function(name, scheme, opt_namespace) {
    /**
     * The name of the method (RPC method name).
     * @type {string}
     * @final
     */
    this.name = name;
    /**
     * The REST path of the method. It will be used to generate the
     * xhr calls.
     * @type {string}
     */
    this.path = scheme['path'];
    /**
     * The mthod used.
     * @type {string}
     */
    this.method = scheme['httpMethod'].toLowerCase();
    /**
     * The description of the rpc method.
     * @type {string}
     */
    this.description = scheme['description'];
    /**
     * The order of the parameters expected for the method.
     * @type {?Array<string>}
     */
    this.order = null;
    /**
     * The inner namespace of the method. This is used when the method is
     * part of a group resource.
     * @type {?string}
     */
    this.namespace = null;
    /**
     * The request payload (for post/put).
     * @type {?string}
     */
    this.request = null;
    /**
     * The respnse type: this is if the rpc call returns a new object/list it
     * will be denoted as a reference.
     * @type {?string}
     */
    this.response = null;
    /**
     * The parameteres ordered in the order as expected in the method call.
     * @type {!Array<?>}
     */
    this.parameters = [];

    if (goog.isDef(opt_namespace)) {
      this.namespace = opt_namespace;
    }
    this.process(scheme);
  },

  process: function(scheme) {
    if (goog.isString(scheme['response'])) {
      this.response = scheme['response'];
    }

    if (goog.isDef(scheme['parameterOrder'])) {
      this.order = scheme['parameterOrder'];
    }

    if (this.order) {
      goog.object.forEach(scheme['parameters'], function(value, key) {
        var param = new pstj.ds.discovery.Parameter(key, value);
        if (this.order && goog.array.contains(this.order, key)) {
          goog.array.insertAt(
              this.parameters, param, goog.array.indexOf(this.order, key));
        } else {
          goog.array.insert(this.parameters, param);
        }
      }, this);
    }

    if (goog.isDef(scheme['response'])) {
      this.response = scheme['response']['$ref'];
    }

    if (this.method == 'post' && goog.isDef(scheme['request'])) {
      this.request = scheme['request']['$ref'];
    }
  }
});
