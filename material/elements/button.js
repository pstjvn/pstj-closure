goog.provide('pstj.material.Button');
goog.provide('pstj.material.ButtonRenderer');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.Event');
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
    /**
     * If ink should be utilized on the button
     * @type {boolean}
     * @private
     */
    this.useInk_ = false;
    /**
     * A named action model - a string that could be matched in the app logic.
     * This is useful if you have mutliple buttons in the same container and you
     * need to use event delegation. Instead of counting the buttons you can
     * assign them 'an action' name and use it to recognize the button later on.
     * @type {!string}
     * @private
     */
    this.action_ = '';
    /**
     * Reference to a delayed event we can use to recreate a tactile triggered
     * action.
     * @type {goog.events.Event}
     * @private
     */
    this.delayedEvent_ = null;

    this.setSupportedState(goog.ui.Component.State.DISABLED, true);
    this.setSupportedState(goog.ui.Component.State.RAISED, true);
    this.setSupportedState(goog.ui.Component.State.ACTIVE, true);
    this.setSupportedState(goog.ui.Component.State.FOCUSED, true);
    this.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);
    this.setSupportedState(goog.ui.Component.State.TACTILE, true);
    // Enable automatic entering of ACTIVE state (when pressed)
    this.setAutoStates(goog.ui.Component.State.ACTIVE, true);
    this.setAutoStates(goog.ui.Component.State.FOCUSED, true);
    // Enable automatic handlers for PRESS and RELEASE pointer events.
    this.setAutoEventsInternal(pstj.material.EventMap.EventFlag.PRESS |
        pstj.material.EventMap.EventFlag.RELEASE);
    // Dissallow text selection by accident
    this.setAllowTextSelection(false);
    // Use the pointer agent to subscribe to DOM events.
    this.setUsePointerAgent(true);
  },


  /** @inheritDoc */
  decorateInternal: function(el) {
    goog.base(this, 'decorateInternal', el);

    var es = this.getElementStrict();
    if (es.hasAttribute('icon')) {
      var icon = es.getAttribute('icon');
      if (icon) {
        this.icon = /** @type {pstj.material.icon.Name} */ (icon);
      } else {
        if (this.getIcon()) {
          this.icon = this.getIcon().getIcon();
        }
      }
    }
    this.setIcon(this.icon);
    if (es.hasAttribute('ink')) {
      this.setUseInk(true);
    }
    this.useIconAnimationDelay = es.hasAttribute('delay');
    this.action_ = el.getAttribute('action') || '';
  },

  /** @override */
  createDom: function() {
    goog.base(this, 'createDom');
    this.setIcon(this.icon);
  },


  /** @inheritDoc */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    // adjust shadow transitioning to always perform with animation.
    if (this.getShadow()) {
      this.getShadow().setTransitioning(this.isTransitioning());
    }
    this.adjustDepth_();
  },


  /** @inheritDoc */
  setTransitioning: function(enable) {
    goog.base(this, 'setTransitioning', enable);
    if (this.getShadow()) this.getShadow().setTransitioning(enable);
  },


  /**
   * Setter for if we should use ink on the button
   * @param {boolean} enable
   */
  setUseInk: function(enable) {
    this.useInk_ = enable;
  },


  /** @inheritDoc */
  disposeInternal: function() {
    goog.base(this, 'disposeInternal');
    this.delayedEvent_ = null;
  },


  /** @inheritDoc */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    if (this.getRipple()) {
      this.getHandler().listen(this.getRipple(),
          pstj.material.EventType.RIPPLE_END,
          this.onRippleEnd);
    }
  },

  /**
   * Handles the ripple end effect.
   * @param {goog.events.Event} e The RIPPLE_END event.
   * @protected
   */
  onRippleEnd: function(e) {
    if (this.isTactile() && !goog.isNull(this.delayedEvent_)) {
      this.triggerTactileAction();
      this.setIconAfterDelay(e);
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
        } else {
          this.getShadow().setDepth(this.disabledDepth);
        }
      }
    }
  },


  /** @inheritDoc */
  onPress: function(e) {
    if (this.isEnabled()) {
      if (this.useInk_) {
        if (this.getRipple()) {
          this.getRipple().onPress(e);
          this.suppressIconAnimation_ = true;
        }
      }
      if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
        this.setActive(true);
      }
      this.adjustDepth_();
    }
  },


  /** @inheritDoc */
  onRelease: function(e) {
    if (this.useInk_) {
      if (this.getRipple()) {
        this.getRipple().onRelease(e);
      }
    }
    this.handleMouseUp(null);
    this.adjustDepth_();
  },

  /** @inheritDoc */
  performActionInternal: function(e) {
    if (this.isTactile()) {
      if (this.isAutoState(goog.ui.Component.State.CHECKED)) {
        this.setChecked(!this.isChecked());
      }
      if (this.isAutoState(goog.ui.Component.State.SELECTED)) {
        this.setSelected(true);
      }
      if (this.isAutoState(goog.ui.Component.State.OPENED)) {
        this.setOpen(!this.isOpen());
      }
      var actionEvent = new goog.events.Event(
          goog.ui.Component.EventType.ACTION,
          this);
      if (e && goog.asserts.assertInstanceof(e, goog.events.BrowserEvent)) {
        actionEvent.altKey = e.altKey;
        actionEvent.ctrlKey = e.ctrlKey;
        actionEvent.metaKey = e.metaKey;
        actionEvent.shiftKey = e.shiftKey;
        actionEvent.platformModifierKey = e.platformModifierKey;
      }
      this.delayedEvent_ = actionEvent;
      return true;
    } else {
      return goog.base(this, 'performActionInternal', e);
    }
  },

  /**
   * Triggers the default mouse up action after the tactile delay.
   * @protected
   */
  triggerTactileAction: function() {
    this.dispatchEvent(this.delayedEvent_);
    this.delayedEvent_ = null;
  },


  /** @inheritDoc */
  setContent: function(cont) {
    if (this.getLabel()) {
      goog.base(this, 'setContent', cont);
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

  /** @override */
  getKeyEventTarget: function() {
    return this.getElement();
  },

  /**
   * Retrieves the named user action.
   * @return {!string}
   */
  getAction: function() {
    return this.action_;
  },


  statics: {
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
    goog.asserts.assertInstanceof(control, pstj.material.Button);
    return {
      content: control.getContent() || '',
      icon: control.icon
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

  /** @inheritDoc */
  getContentElement: function(el) {
    return goog.dom.getElementByClass(
        goog.getCssName(this.getCssClass(), 'label'), el);
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
