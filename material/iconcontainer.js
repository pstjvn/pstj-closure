goog.provide('pstj.material.IconContainer');
goog.provide('pstj.material.IconContainerRenderer');

goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.Icon');
goog.require('pstj.material.Icon.EventType');
goog.require('pstj.material.State');
goog.require('pstj.material.icon');
goog.require('pstj.material.template');

goog.scope(function() {
var E = pstj.material.Element;
var ER = pstj.material.ElementRenderer;
var I = pstj.material.Icon;
var icon = pstj.material.icon;


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
     * @type {icon.Name}
     * @protected
     */
    this.type = icon.Name.NONE;
    this.setSupportedState(goog.ui.Component.State.EMPTY, true);
  },


  /** @inheritDoc */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this, I.EventType.MORPHEND, this.onMorphEnd);
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
    var target = goog.asserts.assertInstanceof(e.target, I);
    if (target != this.icon) {
      e.preventDefault();
      this.removeChild(target, true);
    } else if (this.icon.type == icon.Name.NONE) {
      e.preventDefault();
      this.removeChild(this.icon, true);
      this.icon = null;
      this.setEmpty(true);
    }
  },


  /**
   * Sets the icon to use by its name.
   * @param {icon.Name} iconName
   */
  setIcon: function(iconName) {
    if (this.type != iconName) {
      if (goog.isNull(this.icon)) {
        this.setEmpty(false);
        this.icon = this.createIcon(iconName);
        this.addChild(this.icon, true);
        // this will set the type from 'none' to 'from-none-to-{$iconName}'
        this.icon.setIcon(iconName);
      } else {
        // first try to mutate the icon.
        if (!this.icon.setIcon(iconName)) {
          // If mutation is not possible
          this.icon.setIcon(icon.Name.NONE);
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
   * @param {icon.Name} iconName
   * @return {pstj.material.Icon}
   */
  createIcon: function(iconName) {
    return new pstj.material.Icon(null,
        icon.resolveRenderer(iconName),
        this.getDomHelper());
  }
});


/** Implements th renderer for the container */
pstj.material.IconContainerRenderer = goog.defineClass(ER, {
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

goog.ui.registry.setDefaultRenderer(pstj.material.IconContainer,
    pstj.material.IconContainerRenderer);

goog.ui.registry.setDecoratorByClassName(
    pstj.material.IconContainerRenderer.CSS_CLASS, function() {
      return new pstj.material.IconContainer(null);
    });

});  // goog.scope
