goog.provide('pstj.material.Fab');
goog.provide('pstj.material.FabRenderer');

goog.require('goog.ui.registry');
goog.require('pstj.material.Button');
goog.require('pstj.material.ButtonRenderer');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.Icon');
goog.require('pstj.material.IconContainer');
goog.require('pstj.material.Ripple');
goog.require('pstj.material.Shadow');
goog.require('pstj.material.template');

goog.scope(function() {



/**
 * The implementation for the Custom element.
 * @constructor
 * @struct
 * @extends {pstj.material.Button}
 * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
 *     to display as the content of the control (if any).
 * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
 *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 */
pstj.material.Fab = function(opt_content, opt_renderer, opt_domHelper) {
  goog.base(this, opt_content, opt_renderer, opt_domHelper);
  /**
   * The icon to use in the fab. We need this as the icon might be set before
   * the DOM is created and thus the icont container might not exists yet.
   * @type {pstj.material.Icon.Name}
   * @private
   */
  this.icon_ = pstj.material.Icon.Name.NONE;
  this.activeDepth = 4;
};
goog.inherits(pstj.material.Fab, pstj.material.Button);


/**
 * Creates a new instance from a config. In the case of FAB we assume the
 * config to be a model.
 * @param {MaterialConfig} conf
 */
pstj.material.Fab.fromJSON = function(conf) {
  var i = new pstj.material.Fab();
  if (conf.icon) {
    i.setIcon(conf.icon);
  }
  return i;
};



/**
 * Implements the renderer for the element.
 * @constructor
 * @struct
 * @extends {pstj.material.ButtonRenderer}
 */
pstj.material.FabRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.FabRenderer, pstj.material.ButtonRenderer);
goog.addSingletonGetter(pstj.material.FabRenderer);


/**
 * @type {string}
 * @final
 */
pstj.material.FabRenderer.CSS_CLASS = goog.getCssName('material-fab');


var _ = pstj.material.Fab.prototype;
var r = pstj.material.FabRenderer.prototype;


/**
 * Sets the icon to be used in the FAB.
 * @param {pstj.material.Icon.Name} iconName
 */
_.setIcon = function(iconName) {
  this.icon_ = iconName;
  this.getRenderer().setIcon(this, this.icon_);
};


/**
 * @override
 * @return {pstj.material.FabRenderer}
 */
_.getRenderer = function() {
  return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
      pstj.material.FabRenderer);
};


/** @inheritDoc */
r.getCssClass = function() {
  return pstj.material.FabRenderer.CSS_CLASS;
};


/** @inheritDoc */
r.getTemplate = function(model) {
  return pstj.material.template.Fab(model);
};


/**
 * Sets the icon to use on the fab. Mutation is upported as usual.
 * @param {pstj.material.Element} el
 * @param {pstj.material.Icon.Name} icon
 */
r.setIcon = function(el, icon) {
  if (el.getElement() && el.getChildAt(1)) {
    goog.asserts.assertInstanceof(el.getChildAt(1),
        pstj.material.IconContainer).setIcon(icon);
  }
};


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.Fab,
    pstj.material.FabRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.FabRenderer.CSS_CLASS, function() {
      return new pstj.material.Fab(null);
    });

});  // goog.scope
