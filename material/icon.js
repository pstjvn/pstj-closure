goog.provide('pstj.material.Icon');
goog.provide('pstj.material.IconContainer');
goog.provide('pstj.material.IconRenderer');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');


/**
 * Implements the material icon. The class representa a single icon and is
 * static, meaning that its renderer will pick up the icon at creation time and
 * from then on the icon can only mutate to known configurations. Should
 * the icon need to mutate to somethinf else it will fire the 'REPLACE' event
 * and the container should instanciate a new icon which contains the required
 * SVG set for that icon instead and dispose of the previous instance.
 *
 * The class implements a single instance with its mutations. The allowed
 * mutations are pre-defined fir each SVG set. The IconContainer class should
 * manage those.
 *
 * In order to allow animated change of icons when the same renderer does not
 * support the state we want to go into 'indirect mutation' could be aplpied.
 * For this to work you need to use the {@see IconContainer} class.
 */
pstj.material.Icon = goog.defineClass(pstj.material.Element, {
  /**
   * @constructor
   * @extends {pstj.material.Element}
   * @struct
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    goog.base(this, opt_content, opt_renderer, opt_domHelper);
    /** @type {pstj.material.Icon.Name} */
    this.type = pstj.material.Icon.Name.NONE;
  },


  /** @inheritDoc */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this.getElementStrict(),
        goog.events.EventType.ANIMATIONEND, this.onAnimationEnd);
  },


  /**
   * Handles the end of an animation (keyframes).
   * @param {goog.events.BrowserEvent} e
   * @protected
   */
  onAnimationEnd: function(e) {
    if (this.dispatchEvent(pstj.material.Icon.EventType.MORPHEND)) {
      this.getRenderer().resetType(this);
    }
  },


  /**
   * Sets the icon type.
   * @param {pstj.material.Icon.Name} iconName
   * @return {boolean}
   */
  setIcon: function(iconName) {
    if (!this.getRenderer().setType(this, iconName)) {
      return false;
    } else {
      this.type = iconName;
      return true;
    }
  },


  /**
   * @override
   * @return {pstj.material.IconRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        pstj.material.IconRenderer);
  }
});


/**
 * Enumerates all icons we know about. Those are names for the icons and do not
 * directly correspond to the Icon instances, instead are used to determine the
 * renderer to use.
 * @enum {string}
 */
pstj.material.Icon.Name = {
  NONE: 'none',
  // MenuIcon
  MENU: 'menu',
  PLUS: 'plus',
  CLOSE: 'close',
  CHECK: 'check',
  BACK_ARROW: 'arrow',
  // UserIcon
  USER: 'user'
};


/**
 * The event type we fire when an icon finished transforming from one to
 * another.
 * @enum {string}
 */
pstj.material.Icon.EventType = {
  MORPHEND: goog.events.getUniqueId('morph-end')
};


/**
 * Implementation for the Icon container class for icon swapping and
 * visualization.
 */
pstj.material.IconContainer = goog.defineClass(pstj.material.Element, {
  /**
   * Implements the container for icons which allows dynamically swapping icons.
   * @constructor
   * @extends {pstj.material.Element}
   * @struct
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    goog.base(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * @type {pstj.material.Icon}
     * @protected
     */
    this.icon = null;
    /**
     * The type of icon we want to show currently.
     * @type {pstj.material.Icon.Name}
     * @protected
     */
    this.type = pstj.material.Icon.Name.NONE;
  },


  /** @inheritDoc */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this, pstj.material.Icon.EventType.MORPHEND,
        this.onMorphEnd);
  },


  /**
   * Handles the end of the morphing of an Icon instance. If the icon instance
   * that ended its morphing is not the one we currently have as active icon
   * element we remove it (@see indirect mutations) and we prevent the default
   * action, which in the default implementation should reset the icon type
   * and fix its view properties (useful for SVG icons that support more than
   * one icon type).
   *
   * @param {goog.events.Event} e
   * @protected
   */
  onMorphEnd: function(e) {
    var target = goog.asserts.assertInstanceof(e.target, pstj.material.Icon);
    if (target != this.icon) {
      e.preventDefault();
      this.removeChild(target, true);
    }
  },


  /**
   * Sets the icon to use by its name.
   * @param {pstj.material.Icon.Name} iconName
   */
  setIcon: function(iconName) {
    if (this.type != iconName) {
      if (goog.isNull(this.icon)) {
        this.icon = this.createIcon(iconName);
        this.addChild(this.icon, true);
        // this will set the type from 'none' to 'from-none-to-{$iconName}'
        this.icon.setIcon(iconName);
      } else {
        // first try to mutate the icon.
        if (!this.icon.setIcon(iconName)) {
          // If mutation is not possible
          this.icon.setIcon(pstj.material.Icon.Name.NONE);
          this.icon = this.createIcon(iconName);
          this.addChild(this.icon, true);
          this.icon.setIcon(iconName);
        }
      }
      this.type = iconName;
    }
  },


  /**
   * Create a custom icon instance matchin the desired type.
   * @param {pstj.material.Icon.Name} iconName
   * @return {pstj.material.Icon}
   */
  createIcon: function(iconName) {
    return new pstj.material.Icon(null, this.resolveRenderer(iconName),
        this.getDomHelper());
  },


  /**
   * Attempts to resolve the icon renderer to use for the particular icon
   * by its name/type.
   * @param {pstj.material.Icon.Name} name
   * @return {pstj.material.IconRenderer}
   */
  resolveRenderer: function(name) {
    switch (name) {
      case pstj.material.Icon.Name.MENU:
      case pstj.material.Icon.Name.PLUS:
      case pstj.material.Icon.Name.CLOSE:
      case pstj.material.Icon.Name.BACK_ARROW:
      case pstj.material.Icon.Name.CHECK:
        return pstj.material.MenuIconRenderer.getInstance();
      case pstj.material.Icon.Name.USER:
        return pstj.material.UserIconRenderer.getInstance();
      default:
        throw new Error('Cannot recognize the icon type');
    }
  }
});


/** Implements th renderer for the container */
pstj.material.IconContainerRenderer = goog
    .defineClass(pstj.material.ElementRenderer, {
      /**
       * @constructor
       * @extends {pstj.material.ElementRenderer}
       * @struct
       */
      constructor: function() {
        goog.base(this);
      },


      /** @inheritDoc */
      getTemplate: function(model) {
        return pstj.material.template.IconContainer(model);
      },


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



/**
 * The basic icon renderer class. For each SVG set you need to extend this
 * class so that it will know which transformations it can support.
 * @constructor
 * @extends {pstj.material.ElementRenderer}
 * @struct
 */
pstj.material.IconRenderer = function() {
  goog.base(this);
  /**
   * @type {Array.<pstj.material.Icon.Name>}
   * @protected
   */
  this.names = null;
};
goog.inherits(pstj.material.IconRenderer, pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.IconRenderer);


/**
 * @type {string}
 * @final
 */
pstj.material.IconRenderer.CSS_CLASS = goog.getCssName('material-icon');


/** @override */
pstj.material.IconRenderer.prototype.getCssClass = function() {
  return pstj.material.IconRenderer.CSS_CLASS;
};


/**
 * Setter for the supported names to call in the children.
 * @param {Array.<pstj.material.Icon.Name>} names
 * @protected
 */
pstj.material.IconRenderer.prototype.setSupportedNames = function(names) {
  this.names = names;
};


/** @inheritDoc */
pstj.material.IconRenderer.prototype.getTemplate = function(model) {
  throw new Error('You should override this with your icon implementation');
};


/**
 * Checks if the current template supports the icon name we want to show.
 * @param {string} name
 * @return {boolean}
 */
pstj.material.IconRenderer.prototype.hasSupportFor = function(name) {
  return goog.array.contains(this.names, name);
};


/**
 * Sets the icon type on the DOM element.
 * @param {pstj.material.Icon} iconInstance
 * @param {pstj.material.Icon.Name} to
 * @return {boolean} Returns true if the icon can actually be mutated to the
 * one we want, false otherwise.
 */
pstj.material.IconRenderer.prototype.setType = function(iconInstance, to) {
  if (this.hasSupportFor(to)) {
    var from = iconInstance.type;
    iconInstance.getElement().setAttribute(
        'type', 'from-' + from + '-to-' + to);
    return true;
  } else {
    return false;
  }
};


/**
 * Removes mutating types from the attribute.
 * @param {pstj.material.Icon} control
 */
pstj.material.IconRenderer.prototype.resetType = function(control) {
  control.getElement().setAttribute('type', control.type);
};


/**
 * Implements th yser icon renderer.
 */
pstj.material.UserIconRenderer = goog.defineClass(pstj.material.IconRenderer, {
  /**
   * @constructor
   * @extends {pstj.material.IconRenderer}
   * @struct
   */
  constructor: function() {
    pstj.material.IconRenderer.call(this);
    this.setSupportedNames([
      pstj.material.Icon.Name.NONE,
      pstj.material.Icon.Name.USER
    ]);
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.material.template.UserIcon(model);
  }
});
goog.addSingletonGetter(pstj.material.UserIconRenderer);


/**
 * Implements the menu icon renderer.
 */
pstj.material.MenuIconRenderer = goog.defineClass(pstj.material.IconRenderer, {
  /**
   * @constructor
   * @extends {pstj.material.IconRenderer}
   * @struct
   */
  constructor: function() {
    pstj.material.IconRenderer.call(this);
    this.setSupportedNames([
      pstj.material.Icon.Name.NONE,
      pstj.material.Icon.Name.MENU,
      pstj.material.Icon.Name.PLUS,
      pstj.material.Icon.Name.CLOSE,
      pstj.material.Icon.Name.CHECK,
      pstj.material.Icon.Name.BACK_ARROW
    ]);
  },


  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.material.template.MenuIcon(model);
  }
});
goog.addSingletonGetter(pstj.material.MenuIconRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.IconContainer,
    pstj.material.IconContainerRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.IconContainerRenderer.CSS_CLASS, function() {
      return new pstj.material.IconContainer();
    });
