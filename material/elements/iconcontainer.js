goog.provide('pstj.material.IconContainer');
goog.provide('pstj.material.IconContainerRenderer');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.html.uncheckedconversions');
goog.require('goog.labs.net.xhr');
goog.require('goog.object');
goog.require('goog.soy.data.SanitizedHtml');
goog.require('goog.string.Const');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.autogen.icons.names');
goog.require('pstj.configure');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.Icon');
goog.require('pstj.material.Icon.EventType');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');
goog.require('pstj.material.template');
goog.require('soydata.VERY_UNSAFE');

goog.scope(function() {
var E = pstj.material.Element;
var ER = pstj.material.ElementRenderer;
var iconnames = pstj.autogen.icons.names;
// Set this to true to test behaviour as if the code was compiled:
// this is - after you run the code generation step
// var COMPILED = true;

/**
 * Implementation for the Icon container class for icon swapping and
 * visualization.
 */
pstj.material.IconContainer = goog.defineClass(E, {
  /**
   * Implements the container for icons which allows dynamically swapping icons.
   * @constructor
   * @extends {E}
   * @struct
   * @param {?goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {?goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {?goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    goog.base(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * @type {?pstj.material.Icon}
     * @protected
     */
    this.icon = null;
    /**
     * The type of icon we want to show currently.
     * @type {!iconnames}
     * @protected
     */
    this.type = iconnames.NONE;
    /**
     * The type of icon we want to show currently.
     * @type {?iconnames}
     * @private
     */
    this.tmpType_ = null;
    this.setSupportedState(goog.ui.Component.State.EMPTY, true);
  },


  /** @inheritDoc */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(
        this, pstj.material.Icon.EventType.MORPHEND, this.onMorphEnd);
  },


  /**
   * Handles the end of the morphing of an Icon instance. If the icon instance
   * that ended its morphing is not the one we currently have as active icon
   * element we remove it (@see indirect mutations) and we prevent the default
   * action, which in the default implementation should reset the icon type
   * and fix its view properties (useful for SVG icons that support more than
   * one icon type).
   *
   * @param {!goog.events.Event} e
   * @protected
   */
  onMorphEnd: function(e) {
    var target = goog.asserts.assertInstanceof(e.target, pstj.material.Icon);
    if (target != this.icon) {
      e.preventDefault();
      this.removeChild(/** @type {!pstj.material.Icon} */ (target), true);
    } else if (this.icon.type == iconnames.NONE) {
      e.preventDefault();
      this.removeChild(this.icon, true);
      this.icon = null;
      this.setEmpty(true);
    }
  },


  /**
   * Accessor method for the current icon / type applied to the container.
   * @return {!pstj.autogen.icons.names}
   */
  getIcon: function() { return this.type; },


  /**
   * Sets the icon to use by its name.
   * @param {!pstj.autogen.icons.names} iconName
   */
  setIcon: function(iconName) {
    if (COMPILED || pstj.material.IconContainer.XMLLoaded) {
      if (!goog.isNull(this.tmpType_)) {
        iconName = this.tmpType_;
        this.tmpType_ = null;
      }
      if (this.type != iconName) {
        if (goog.isNull(this.icon)) {
          this.setEmpty(false);
          this.icon = this.createIcon(iconName);
          this.addChild(this.icon, true);
          // this will set the type from 'none' to 'from-none-to-{$iconName}'
          this.icon.setIcon(iconName);
        } else {
          // first try to mutate the icon
          var sr = this.getSuitableRenderer(iconName);
          if (goog.isNull(sr) || this.icon.getRenderer() == sr) {
            this.icon.setIcon(iconName);
          } else {
            // If mutation is not possible
            this.icon.setIcon(pstj.autogen.icons.names.NONE);
            this.icon = this.createIcon(iconName);
            this.addChild(this.icon, true);
            this.icon.setIcon(iconName);
          }
        }
        this.type = iconName;
        this.getRenderer().setType(this);
      }
    } else {
      // alternative path for handling icons in source mode.
      pstj.material.IconContainer.registerPending(this, iconName);
    }
    if (goog.isNull(this.getElement())) {
      this.tmpType_ = iconName;
    }
  },


  /**
   * Create a custom icon instance matchin the desired type.
   * @param {!pstj.autogen.icons.names} iconName
   * @return {!pstj.material.Icon}
   */
  createIcon: function(iconName) {
    if (COMPILED) {
      return new pstj.material.Icon(
          null, pstj.material.icons.registry.getRenderer(iconName),
          this.getDomHelper());
    } else {
      // this path is taken in dev mode - the instances must be handled here.
      return new pstj.material.Icon(
          null, pstj.material.IconContainer.getCustomRenderer(iconName),
          this.getDomHelper());
    }
  },

  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    var type = this.getElement().getAttribute('type');
    if (!type) type = 'none';
    // set icon - will update the type and set the icon internally.
    this.setIcon(/** @type {!pstj.autogen.icons.names} */ (type));
  },


  /**
   * Easier way to get to a suitable renderer for an icon type.
   * @param {!pstj.autogen.icons.names} iconName
   * @return {?pstj.material.IconRenderer}
   */
  getSuitableRenderer: function(iconName) {
    if (COMPILED) {
      return pstj.material.icons.registry.getRenderer(iconName);
    } else {
      if (iconName == iconnames.NONE) return null;
      return pstj.material.IconContainer.getCustomRenderer(iconName);
    }
  },

  /**
   * @override
   * @return {!pstj.material.IconContainerRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(
        goog.base(this, 'getRenderer'), pstj.material.IconContainerRenderer);
  },

  statics: {
    /**
     * Adds an instance to the list of pending updates for when the XML with
     * icons has been received.
     * @param {!pstj.material.IconContainer} control
     * @param {string} icon
     */
    registerPending: function(control, icon) {
      var i = goog.array.indexOf(pstj.material.IconContainer.pending_, control);
      if (i > -1) {
        pstj.material.IconContainer.pending_[i + 1] = icon;
      } else {
        pstj.material.IconContainer.pending_.push(control);
        pstj.material.IconContainer.pending_.push(icon);
      }
    },


    /**
     * Contains the caches renderers for development mode renderer resolution.
     * @type {!Object<!pstj.material.IconRenderer>}
     * @private
     */
    rendererCache_: {},


    /**
     * Retrieves a custom renderer instance matching the icon name.
     * @param {!pstj.autogen.icons.names} icon
     * @return {!pstj.material.IconRenderer}
     */
    getCustomRenderer: function(icon) {
      if (goog.object.containsKey(
              pstj.material.IconContainer.rendererCache_, icon)) {
        return goog.object.get(
            pstj.material.IconContainer.rendererCache_, icon);
      } else {
        var names = pstj.material.IconContainer.getNamesByIcon(icon);
        var r = pstj.material.ElementRenderer.getCustomRenderer(
            pstj.material.IconRenderer, null,
            pstj.material.IconContainer.getCustomTemplateFn(icon));
        goog.array.forEach(names, function(name) {
          goog.object.set(pstj.material.IconContainer.rendererCache_, name, r);
        });
        return r;
      }
    },

    /**
     * Given a single icon name, filtering the svg nodes returns the icons that
     * are supported by the node that supports the queried icon name.
     *
     * Note that if the icon name provided is not supported at all then an empty
     * list will be returned.
     *
     * @param {string} icon
     * @return {!Array<string>}
     */
    getNamesByIcon: function(icon) {
      // look into the dom and fine the matching SVG element, then extract the
      // name attribute and return all names as an array.
      var svg = pstj.material.IconContainer.dom_.querySelector(
          '[name*="' + icon + '"]');
      if (svg && svg.hasAttribute('name')) {
        var names = svg.getAttribute('name');
        return names.split(',');
      } else {
        if (goog.DEBUG) {
          console.warn(
              'Tryin to look up supported icon names for icon name that is not found');
        }
        return [];
      }
    },



    /**
     * Given an icon name returns a function that returns the SVG string
     * representing the development version of the template for this icon.
     *
     * FIXME: use newer conventions to pass the code of the icon as safe in dev
     * mode.
     *
     * @param {string} icon
     * @return {function(!Object<string, *>=):
     *    !goog.soy.data.SanitizedHtml.SanitizedHtml}
     */
    getCustomTemplateFn: function(icon) {
      // get the svg node from the DOM, clone it and turn it into string
      // to be returned by a function
      // The resutned SVG is an Element in the modern browsers.
      var svg = pstj.material.IconContainer.dom_.querySelector(
          '[name*="' + icon + '"]');
      if (!svg) throw new Error('Cannot find SVG node with name: ' + icon);
      svg.removeAttribute('name');
      var htmlstring = goog.dom.getOuterHtml(/** @type {!Element} */ (svg));
      return (
          /** @type {function(!Object<string, *>=):
              !goog.soy.data.SanitizedHtml} */ (function(m) {
            return soydata.VERY_UNSAFE.ordainSanitizedHtml(htmlstring);
          }));
    },


    /**
     * Locally cached version of the xml for the icons built as fragment.
     * @type {?Node}
     * @private
     */
    dom_: null,


    /**
     * List of instances that require resetting the icon once the XML with icons
     * have been loaded.
     * @type {!Array<(!pstj.material.IconContainer|string)>}
     * @private
     */
    pending_: [],


    /**
     * Flag if the XML for icons has been already loaded.
     * @type {boolean}
     */
    XMLLoaded: false
  }
});


/** Implements th renderer for the container */
pstj.material.IconContainerRenderer = goog.defineClass(ER, {
  /**
   * @constructor
   * @extends {pstj.material.ElementRenderer}
   * @struct
   */
  constructor: function() { goog.base(this); },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.material.template.IconContainer(model);
  },

  /**
   * Reflects the type of the icon back in the HTML.
   * @param {!pstj.material.IconContainer} control
   */
  setType: function(control) {
    control.getElement().setAttribute('type', control.getIcon());
  },

  /** @inheritDoc */
  generateTemplateData: function(control) { return {type: control.type}; },


  /** @inheritDoc */
  getCssClass: function() {
    return pstj.material.IconContainerRenderer.CSS_CLASS;
  },


  statics: {
    /**
     * @type {string}
     * @final
     */
    CSS_CLASS: goog.getCssName('material-icon-container')
  }
});
goog.addSingletonGetter(pstj.material.IconContainerRenderer);

goog.ui.registry.setDefaultRenderer(
    pstj.material.IconContainer, pstj.material.IconContainerRenderer);

goog.ui.registry.setDecoratorByClassName(
    pstj.material.IconContainerRenderer.CSS_CLASS,
    function() { return new pstj.material.IconContainer(null); });


// If working in dev mode load the svg.
if (!COMPILED) {
  goog.labs.net.xhr
      .get(
          goog.asserts.assertString(
              pstj.configure.getRuntimeValue(
                  'XML_ICON_SOURCE', '../pstj/templates/icons.xml',
                  'PSTJ.MATERIAL')))
      .then(function(txt) {
        var dom = goog.dom.safeHtmlToNode(
            goog.html.uncheckedconversions
                .safeHtmlFromStringKnownToSatisfyTypeContract(
                    goog.string.Const.from(
                        'Used only in tests, in prod those are precompiled to safe html from soy'),
                    txt));
        pstj.material.IconContainer.dom_ = dom;
        pstj.material.IconContainer.XMLLoaded = true;
        var len = pstj.material.IconContainer.pending_.length;
        // In this cycle it is impossible to enforce a valid icon name,
        // thus the developer should make sure that only valid icon names are
        // added (i.e. icon names that are matched by an SVG element)
        for (var i = 0; i < len; i = i + 2) {
          pstj.material.IconContainer.pending_[i].setIcon(
              /** @type {!pstj.autogen.icons.names} */ (
                  pstj.material.IconContainer.pending_[i + 1]));
        }
        goog.array.clear(pstj.material.IconContainer.pending_);
      });
}

});  // goog.scope
