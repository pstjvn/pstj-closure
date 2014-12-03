goog.provide('pstj.material.MenuItem');
goog.provide('pstj.material.MenuItemRenderer');

goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.ds.ListItem');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.IconContainer');
goog.require('pstj.material.Item');
goog.require('pstj.material.State');
goog.require('pstj.material.template');

goog.scope(function() {
var ER = pstj.material.ElementRenderer;


/**
 * The implementation for the material menu item.
 * By default it is a simple container with padding (like the material Item).
 * Additionally it can have an icon.
 */
pstj.material.MenuItem = goog.defineClass(pstj.material.Element, {
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
    this.setSupportedState(goog.ui.Component.State.EMPTY, true);
    this.setSupportedState(goog.ui.Component.State.SELECTED, true);
    // by default we do not have an icon.
    this.setEmpty(true);
  },


  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.setIcon();
  },


  setModel: function(model) {
    this.swapModelItem(model);
    goog.base(this, 'setModel', model);
    if (this.isInDocument()) {
    }
  },


  /**
   * Updates the content from the current model.
   */
  setContentFromModel: function() {
    var content = '';
    if (!goog.isNull(this.getModel())) {
      content = this.getModel().getProp('content');
      if (goog.isNull(content)) {
        content = '';
      }
    }
    this.setContent(content);
  },


  /**
   * Updates the ico from the model.
   */
  setIconFromModel: function() {
    if (!goog.isNull(this.getModel())) {
      this.setIconInternal(
          /** @type {pstj.material.Icon.Name} */ (
          this.getModel().getProp('icon') ||
          pstj.material.Icon.Name.NONE));
    }
  },


  /**
   * Sets the icon to be used with the menu item. If set to NONE the icon will
   * be hidden.
   * @param {pstj.material.Icon.Name} icon
   */
  setIconInternal: function(icon) {
    this.setEmpty(icon == pstj.material.Icon.Name.NONE);
    if (this.isInDocument()) {
      this.getChildAt(0).setIcon(icon);
    }
  },


  /** @inheritDoc */
  setContent: function(c) {
    if (this.isInDocument()) {
      this.getChildAt(1).setContent(c);
    }
    this.setContentInternal(c);
  },


  statics: {
    fromJSON: function(config) {
      var i = new pstj.material.MenuItem();
      i.setModel(new pstj.ds.ListItem(config));
      return i;
    }
  }
});



/**
 * Implements the renderer for the element.
 * @constructor
 * @struct
 * @extends {pstj.material.ElementRenderer}
 */
pstj.material.MenuItemRenderer = goog.defineClass(ER, {
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getCssClass: function() {
    return pstj.material.MenuItemRenderer.CSS_CLASS;
  },


  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.material.template.MenuItem(model);
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
