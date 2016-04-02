goog.provide('pstj.material.MenuItem');
goog.provide('pstj.material.MenuItemRenderer');

goog.require('goog.asserts');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.IconContainer');
/** @suppress {extraRequire} */
goog.require('pstj.material.Item');
goog.require('pstj.material.template');

goog.scope(function() {
var ER = pstj.material.ElementRenderer;


/** @extends {pstj.material.Element} */
pstj.material.MenuItem = goog.defineClass(pstj.material.Element, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    goog.base(this, opt_content, opt_renderer, opt_domHelper);
    this.setSupportedState(goog.ui.Component.State.DISABLED, true);
    this.setSupportedState(goog.ui.Component.State.SELECTED, true);
    this.setDispatchTransitionEvents(goog.ui.Component.State.SELECTED, true);
    this.setUsePointerAgent(true);
  },

  /**
   * Updates the icon in the menu item.
   * @param {pstj.autogen.icons.names} icon The icon name.
   */
  setIcon: function(icon) {
    goog.asserts.assertInstanceof(this.getChildAt(0),
        pstj.material.IconContainer).setIcon(icon);
  },


  /** @inheritDoc */
  setContent: function(c) {
    if (this.isInDocument()) {
      this.getChildAt(1).setContent(c);
    }
    this.setContentInternal(c);
  },

  /** @override */
  onTap: function(e) {
    if (this.isEnabled()) {
      this.setSelected(true);
    }
  }
});


/** @extends {pstj.material.ElementRenderer} */
pstj.material.MenuItemRenderer = goog.defineClass(ER, {
  constructor: function() {
    ER.call(this);
  },


  /** @inheritDoc */
  getCssClass: function() {
    return pstj.material.MenuItemRenderer.CSS_CLASS;
  },


  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.material.template.MenuItem(model);
  },

  /** @override */
  generateTemplateData: function(inst) {
    var content = inst.getContent();
    if (!goog.isString(content)) {
      content = '';
    }
    return {
      content: content,
      icon: 'none'
    };
  },

  statics: {
    /**
     * @type {string}
     * @final
     */
    CSS_CLASS: goog.getCssName('material-menu-item')
  }
});
goog.addSingletonGetter(pstj.material.MenuItemRenderer);


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.MenuItem,
    pstj.material.MenuItemRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.MenuItemRenderer.CSS_CLASS, function() {
      return new pstj.material.MenuItem(null);
    });

});  // goog.scope
