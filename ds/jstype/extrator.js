goog.provide('pstj.ds.jstype.Extractor');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('pstj.ds.jstype.Constructor');
goog.require('pstj.ds.jstype.Method');
goog.require('pstj.ds.jstype.Namespace');
goog.require('pstj.ds.jstype.Parameter');
goog.require('pstj.ds.jstype.Property');
goog.require('pstj.ds.jstype.StaticMethod');
goog.require('pstj.ds.jstype.StaticProperty');

goog.scope(function() {


/** Extraction JSType class. */
pstj.ds.jstype.Extractor = goog.defineClass(null, {
  /**
   * @constructor
   * @param {?Document} document The document to work on.
   */
  constructor: function(document) {
    this.document = document;
    /**
     * Contains all the items found in the document.
     * @type {Array<pstj.ds.jstype.Record>}
     * @protected
     */
    this.result = [];
  },


  /**
   * Sets the document to work on.
   * @param {!Document} doc
   */
  setDocument: function(doc) {
    this.document = doc;
  },


  /**
   * Extracts the JStype information from the attached document.
   */
  extract: function() {
    if (goog.isNull(this.document)) return;
    var nodes = this.document.querySelectorAll('a[name]');
    var isClass = false;
    var isStatic = false;
    goog.array.forEach(nodes, function(node, i) {
      console.log('Parsing item:' + node.outerHTML + ' Index:' + i);
      if (node.getAttribute('name') == 'constructor') {
        this.result.push(this.addConstructor(node));
        if (i == 0) {
          isClass = true;
        }
      } else if (node.getAttribute('name')[0] == '.') {
        if (goog.string.contains(this.extractName(node), '(')) {
          this.result.push(this.createStaticMethod(node));
        } else {
          var sp = this.createStaticProperty(node);
          if (!isStatic) {
            isStatic = true;
            var ns = new pstj.ds.jstype.Namespace();
            ns.setName(sp.name.replace(/\.[^.]*$/, ''));
            this.result.push(ns);
          }
          if (isStatic) {
            sp.setType(this.result[0].name);
          }
          this.result.push(sp);
        }
      } else {
        if (isClass) {
          this.addPropertyOrMethod(node, this.result[0]);
        } else {
          // TODO: add simple props and functions to namespace.
        }
      }
    }, this);
  },


  /**
   * Given a node attempts to extract a static property from it.
   * @param {Element} node
   * @return {pstj.ds.jstype.StaticProperty}
   */
  createStaticProperty: function(node) {
    var prop = new pstj.ds.jstype.StaticProperty();
    var name = this.extractName(node);
    var desc = this.extractDescription(node);
    prop.setName(name);
    prop.setDescription(desc);
    return prop;
  },


  /**
   * Create a static method.
   * @param {Element} node
   * @return {pstj.ds.jstype.StaticMethod}
   */
  createStaticMethod: function(node) {
    var m = new pstj.ds.jstype.StaticMethod();
    var name = this.extractName(node);
    var desc = this.extractDescription(node);
    m.setName(name);
    m.setDescription(desc);
    this.addParametersToCallable(m, node);

    return m;
  },


  /**
   * Adds a new property or method to the constructor class instance.
   * @param {Element} node The element to operate on.
   * @param {pstj.ds.jstype.Constructor} ctor The class to add to.
   * @protected
   */
  addPropertyOrMethod: function(node, ns) {
    var name = this.extractName(node);
    var isStatic = goog.string.contains(name, '.');
    if (goog.string.contains(name, '(')) {
      if (isStatic) {
        this.addStaticMethod(node);
      } else {
        ns.addMethod(this.createMethod(node));
      }
    } else {
      if (isStatic) {
        this.addStaticProperty(node);
      } else {
        ns.addProperty(this.createProperty(node));
      }
    }
  },


  createMethod: function(node) {
    var method = new pstj.ds.jstype.Method();
    var name = this.extractName(node);
    var desc = this.extractDescription(node);

    method.setName(name);
    method.setDescription(desc);

    this.addParametersToCallable(method, node);

    return method;
  },


  /**
   * Adds a new property to the given class.
   * @param {Element} node
   * @param {pstj.ds.jstype.Constructor} ns
   */
  createProperty: function(node, ns) {
    var prop = new pstj.ds.jstype.Property();
    var name = this.extractName(node);
    var type = this.extractType(node);
    var desc = this.extractDescription(node);

    prop.setName(name);
    prop.setType(type);
    prop.setDescription(desc);
    return prop;
  },


  /**
   * Iterates over all the found items and return their string representations
   * as strings.
   * @return {string}
   * @override
   */
  toString: function() {
    var strarr = goog.array.map(this.result, function(item) {
      return item.toString();
    });
    return strarr.join('\n\n\n');
  },


  /**
   * Adds constructor record to the list of items to serialize.
   * @param {Element} node The anchor tag that is matched to be link to
   * constructor documentation.
   */
  addConstructor: function(node) {
    var name = this.extractName(node);
    var desc = this.extractDescription(node);

    var record = new pstj.ds.jstype.Constructor();
    record.setName(name);
    record.setDescription(desc);

    this.addParametersToCallable(record, node);

    return record;
  },


  /**
   * Parses and adds the params to a callable JSType.
   * @param {pstj.ds.jstype.Function} callable
   * @param {Element} node The HTML element denoting the start of the callable.
   * @protected
   */
  addParametersToCallable: function(callable, node) {
    var del = this.getDetailsNode(node);
    if (del) {
      var dts = del.querySelectorAll('dt');
      var dds = del.querySelectorAll('dd');

      for (var i = 1; i < dts.length; i++) {
        var param = new pstj.ds.jstype.Parameter();
        param.setName(goog.dom.getTextContent(dts[i].querySelector('b')));
        param.setType(goog.dom.getTextContent(dts[i].querySelector('span')));
        param.setDescription(goog.dom.getTextContent(dds[i - 1]));
        callable.addParameter(param);
      }
    }
  },


  /**
   * Attempts to find node that is containing the nodes with details.
   * @param {Element} node
   * @return {Element}
   */
  getDetailsNode: function(node) {
    var d = node.parentElement.querySelector('a[name="' +
        node.getAttribute('name') + '"] ~ dl[class="detailList"]');
    if (!d) {
      console.log('WARNING: Cannot find param list element');
    }
    return d;
  },


  /**
   * Extract the name portion from an html tree. The name is assumed to be
   * found right after the anchor node for the item.
   * @param {Element} node
   * @return {string}
   */
  extractName: function(node) {
    var d = node.parentElement.querySelector('a[name="' +
        node.getAttribute('name') + '"] ~ div[class="fixedFont"]');
    if (!d) throw new Error('Cannot find name element');
    return goog.dom.getTextContent(d);
  },


  /**
   * Attempts to exctract the description portion of a record based on the
   * singlings of the anchor node for it.
   * @param {Element} node
   * @return {string}
   */
  extractDescription: function(node) {
    var d = node.parentElement.querySelector('a[name="' +
        node.getAttribute('name') + '"] ~ div[class="description"]');
    if (!d) throw new Error('Cannot find description element');
    return goog.dom.getTextContent(d);
  },


  /**
   * Attempts to extract the type information from the description node. Works
   * for instance properties and methods.
   * NOTE: the call has side effect of removing the type from the description so
   * you can call it only once. make sure to cache the result.
   * @param {Element} node
   * @return {string}
   */
  extractType: function(node) {
    var d = node.parentElement.querySelector('a[name="' +
        node.getAttribute('name') +
        '"] ~ div[class="description"] > .fixedFont');
    if (!d) throw new Error('Cannot find property type element');
    var res = goog.dom.getTextContent(d);
    d.parentNode.removeChild(d);
    return res;
  },

  statics: {

    /**
     * @param {Document} document
     * @param {string} anchorSelector
     * @return {Array<string>}
     */
    getLinkList: function(document, anchorSelector) {
      var a = document.querySelector(anchorSelector);
      if (!a) throw new Error('Cannot find such element: ' + anchorSelector);
      var list = a.parentElement.querySelectorAll(anchorSelector +
          ' ~ ul > li > a');
      var result = [];
      for (var i = 0; i < list.length; i++) {
        var item = list.item(i).href;
        if (goog.string.startsWith(item, 'file')) {
          item = item.replace('file://', '');
        }
        if (!goog.string.contains(item, 'index-all')) {
          result.push(item);
        }
      }
      return result;
    }
  }
});

});  // goog.scope

