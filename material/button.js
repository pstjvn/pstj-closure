goog.provide('pstj.material.Button');
goog.provide('pstj.material.ButtonRenderer');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.object');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.EventType');
goog.require('pstj.material.IconContainer');
goog.require('pstj.material.Ripple');
goog.require('pstj.material.Shadow');
goog.require('pstj.material.State');
goog.require('pstj.material.icon');
goog.require('pstj.material.template');

goog.scope(function() {
var ER = pstj.material.ElementRenderer;


/**
 * Implementation for the Material Button UI component. This is the basic
 * button that supports both label and icons. If an icon or label or both
 * should be used is commanded by the selected renderer, this is why
 * we proved them all in this file.
 */
pstj.material.Button = goog.defineClass(pstj.material.Element, {
  /**
   * @constructor
   * @struct
   * @extends {pstj.material.Element}
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
     * The 'depth' that will be applied to the button when it is enabled
     * but not active (pressed).
     * @type {number}
     * @protected
     */
    this.baseDepth = 1;
    /**
     * The 'depth' that will be applied to this button when it is enabled and
     * active (pressed).
     * @type {number}
     * @protected
     */
    this.activeDepth = 2;
    /**
     * The depth that will be applie to the button when it is disabled.
     * @type {number}
     * @protected
     */
    this.disabledDepth = 0;
    /**
     * The icon to display in the button.
     * @type {pstj.material.icon.Name}
     * @protected
     */
    this.icon = pstj.material.icon.Name.NONE;
    /**
     * Flag, if we should suppress the icon animation until the
     * ripple fx is done.
     * @type {boolean}
     * @private
     */
    this.suppressIconAnimation_ = false;
    /**
     * Public flag for using delay in setting the icon's new value.
     * @type {boolean}
     */
    this.useIconAnimationDelay = false;

    this.setSupportedState(goog.ui.Component.State.DISABLED, true);
    this.setSupportedState(goog.ui.Component.State.RAISED, true);
    this.setSupportedState(goog.ui.Component.State.ACTIVE, true);
    this.setSupportedState(goog.ui.Component.State.FOCUSED, true);
    this.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);
    // Enable automatic entering of ACTIVE state (when pressed)
    this.setAutoStates(goog.ui.Component.State.ACTIVE, true);
    // Enable automatic handlers for PRESS and RELEASE pointer events.
    this.setAutoEventsInternal(pstj.material.EventMap.EventFlag.PRESS |
        pstj.material.EventMap.EventFlag.RELEASE);
    // ENable transitions by default
    this.setTransitioning(true);
    // Use the pointer agent to subscribe to DOM events.
    this.setUsePointerAgent(true);
  },


  /** @inheritDoc */
  decorateInternal: function(el) {
    goog.base(this, 'decorateInternal', el);
    if (this.getShadow()) {
      this.getShadow().setTransitioning(this.isTransitioning());
    }
    this.adjustDepth_();
    this.setIcon(this.icon);
  },


  /** @inheritDoc */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    if (this.getRipple()) {
      this.getHandler().listen(this.getRipple(),
          pstj.material.EventType.RIPPLE_END,
          this.setIconAfterDelay);
    }
  },


  /**
   * Method used solely to delay the icon setter.
   * @param {goog.events.Event} e The ripple-ready event.
   * @protected
   */
  setIconAfterDelay: function(e) {
    this.suppressIconAnimation_ = false;
    if (this.useIconAnimationDelay) {
      this.setIcon(this.icon);
    }
  },


  /**
   * Sets the icon to be used in the button, if icon is supported by the
   * renderer.
   * @param {pstj.material.icon.Name} icon
   */
  setIcon: function(icon) {
    this.icon = icon;
    if (!this.useIconAnimationDelay || !this.suppressIconAnimation_) {
      if (this.getIcon()) this.getIcon().setIcon(this.icon);
    }
  },


  /**
   * Updates the depth of the shadow (if the button is raised) to match
   * the current state.
   * @private
   */
  adjustDepth_: function() {
    if (this.getShadow()) {
      if (!this.isEnabled()) {
        this.getShadow().setDepth(this.disabledDepth);
      } else {
        if (this.isRaised()) {
          if (this.isActive()) {
            this.getShadow().setDepth(this.activeDepth);
          } else {
            this.getShadow().setDepth(this.baseDepth);
          }
        }
      }
    }
  },


  /** @inheritDoc */
  onPress: function(e) {
    if (this.isEnabled()) {
      if (this.getRipple()) {
        this.getRipple().onPress(e);
        this.suppressIconAnimation_ = true;
      }
      if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
        this.setActive(true);
      }
      this.adjustDepth_();
    }
  },


  /** @inheritDoc */
  onRelease: function(e) {
    if (this.getRipple()) {
      this.getRipple().onRelease(e);
    }
    this.handleMouseUp(null);
    this.adjustDepth_();
  },

  /** @inheritDoc */
  setContent: function(cont) {
    if (this.getLabel()) {
      this.getLabel().setContent(cont);
    }
    this.setContentInternal(cont);
  },


  /**
   * Override this so we know what is the type of renderer and call it.
   * @override
   * @return {pstj.material.ButtonRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        pstj.material.ButtonRenderer);
  },

  /**
   * Abstracts child retrieval, allowing rearranegemtn of children in the
   * template/renderer so that the structure determines where the child
   * should be expected at and thus allowing fast access to specific
   * children by the main component.
   * @param {string} name
   * @return {goog.ui.Component}
   */
  getNamedChild: function(name) {
    var index = this.getRenderer().getChildIndex(name);
    if (index > -1) {
      return this.getChildAt(index);
    } else {
      return null;
    }
  },


  /**
   * Getter for the shadow element that is part of the button.
   * @return {pstj.material.Shadow}
   */
  getShadow: function() {
    var shadow = this.getNamedChild(pstj.material.Button.Children.SHADOW);
    if (shadow) return goog.asserts.assertInstanceof(shadow,
        pstj.material.Shadow);
    return shadow;
  },


  /**
   * Getter for the label component if one exists.
   * @return {pstj.material.Element}
   */
  getLabel: function() {
    var label = this.getNamedChild(pstj.material.Button.Children.LABEL);
    if (label) return goog.asserts.assertInstanceof(label,
        pstj.material.Element);
    return label;
  },


  /**
   * Getter for the icon element if one exists in the DOM structure.
   * @return {pstj.material.IconContainer}
   */
  getIcon: function() {
    var icon = this.getNamedChild(pstj.material.Button.Children.ICON);
    if (icon) return goog.asserts.assertInstanceof(icon,
        pstj.material.IconContainer);
    return icon;
  },


  /**
   * Getter for the ripple.
   * @return {pstj.material.Ripple}
   */
  getRipple: function() {
    var ripple = this.getNamedChild(pstj.material.Button.Children.RIPPLE);
    if (ripple) return goog.asserts.assertInstanceof(ripple,
        pstj.material.Ripple);
    return ripple;
  },


  statics: {
    /**
     * Constructs the instance from UI config.
     * @param {MaterialConfig} conf
     * @return {pstj.material.Button}
     */
    fromJSON: function(conf) {
      // Initialization takes care of the label
      var i = new pstj.material.Button(conf.label || 'Button');
      // consifure raised, enable state and icon
      i.setRaised(conf.raised);
      i.setEnabled(!conf.disabled);
      i.setIcon(conf.icon || pstj.material.icon.Name.NONE);
      return i;
    },


    /**
     * Enumaration of the names the renderer should understand and point to
     * as children of the main component.
     * @enum {string}
     */
    Children: {
      SHADOW: 'shadow',
      ICON: 'iconcontainer',
      LABEL: 'label',
      RIPPLE: 'ripple'
    }
  }
});


/**
 * IMplements the basic button renderer.You should not use this one
 * as it is only designed to be used as method holder for the real
 * renderers that have the ability to decide what to do with
 * icons etc.
 */
pstj.material.ButtonRenderer = goog.defineClass(ER, {
  /**
   * @constructor
   * @struct
   * @extends {pstj.material.ElementRenderer}
   */
  constructor: function() {
    goog.base(this);
    /**
     * Provides the needed abstraction over the position of the
     * sub-elements in the button.
     * @type {Object.<string, number>}
     */
    this.childrenNames = goog.object.create(
        pstj.material.Button.Children.ICON, 1,
        pstj.material.Button.Children.LABEL, 2,
        pstj.material.Button.Children.RIPPLE, 3,
        pstj.material.Button.Children.SHADOW, 0);
  },


  /** @inheritDoc */
  generateTemplateData: function(control) {
    goog.asserts.assertInstanceof(control, pstj.material.Element);
    return {
      label: control.getContent()
    };
  },


  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.material.template.Button(model);
  },


  /** @inheritDoc */
  getCssClass: function() {
    return pstj.material.ButtonRenderer.CSS_CLASS;
  },


  /**
   * Retrieves the index of a specific child if one is supported.
   * Otherwise resutns the invalix index of -1;
   * @param {string} name
   * @return {number}
   */
  getChildIndex: function(name) {
    var i = this.childrenNames[name];
    if (goog.isDef(i)) return i;
    return -1;
  },


  statics: {
    /**
     * @type {string}
     * @final
     */
    CSS_CLASS: goog.getCssName('material-button')
  }
});
goog.addSingletonGetter(pstj.material.ButtonRenderer);


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.Button,
    pstj.material.ButtonRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.ButtonRenderer.CSS_CLASS, function() {
      return new pstj.material.Button(null);
    });

});  // goog.scope
