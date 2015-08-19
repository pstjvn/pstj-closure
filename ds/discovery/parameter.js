goog.provide('pstj.ds.discovery.Parameter');


/** Implements parser for rpc method parameter. */
pstj.ds.discovery.Parameter = goog.defineClass(null, {
  constructor: function(name, scheme) {
    /**
     * The name of the parameter.
     * @type {string}
     */
    this.name = name;
    /** @type {?string} */
    this.type = null;
    /** @type {?string} */
    this.description = null;
    /** @type {!boolean} */
    this.required = false;
    /** @type {?string} */
    this.location = null;

    this.process(scheme);
  },

  process: function(scheme) {
    if (goog.isDef(scheme['required'])) {
      this.required = scheme['required'];
    }

    if (goog.isDef(scheme['type'])) {
      this.type = scheme['type'];
    }

    if (goog.isDef(scheme['description'])) {
      this.description = scheme['description'];
    }

    if (goog.isDef(scheme['location'])) {
      this.location = scheme['location'];
    }
  }
});
