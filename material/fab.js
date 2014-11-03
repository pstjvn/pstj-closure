goog.provide('pstj.material.Fab');
goog.provide('pstj.material.FabRenderer');

goog.require('goog.ui.registry');
goog.require('pstj.ds.ListItem');
goog.require('pstj.material.Button');
goog.require('pstj.material.ButtonRenderer');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.Icon');
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
  i.setModel(new pstj.ds.ListItem(conf));
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
 * We want the model to be ListItem or decendant.
 * @override
 */
_.setModel = function(model) {
  goog.asserts.assertInstanceof(model, pstj.ds.ListItem);
  this.swapModelItem(model);
  goog.base(this, 'setModel', model);
  if (this.getElement()) {
    this.updateIcon();
  }
};


/** @inheritDoc */
_.createDom = function() {
  goog.base(this, 'createDom');
  // after all children have been created we can set the icon as well.
  this.updateIcon();
};


/**
 * Updates the type of the icon to match the model.
 * @protected
 */
_.updateIcon = function() {
  if (this.getModel()) {
    this.setIcon(
        /** @type {pstj.material.Icon.Name} */ (
            goog.asserts.assertString(this.getModel().getProp('icon'))));
  }
};


/**
 * Always make sure to be ListItem.
 * @return {pstj.ds.ListItem}
 * @override
 */
_.getModel = function() {
  var model = goog.base(this, 'getModel');
  if (!goog.isNull(model)) {
    return goog.asserts.assertInstanceof(model, pstj.ds.ListItem);
  } else {
    return model;
  }
};


/**
 * Sets the icon to be used in the FAB.
 * @param {pstj.material.Icon.Name} iconName
 */
_.setIcon = function(iconName) {
  this.getIcon().setIcon(iconName);
};


/**
 * Getter for the icon instance that is used in the FAB.
 * @return {pstj.material.Icon}
 */
_.getIcon = function() {
  return goog.asserts.assertInstanceof(this.getChildAt(1), pstj.material.Icon);
};


/** @inheritDoc */
_.handleModelEvent = function(e) {
  this.updateIcon();
};


/** @inheritDoc */
r.getCssClass = function() {
  return pstj.material.FabRenderer.CSS_CLASS;
};


/** @inheritDoc */
r.getTemplate = function(model) {
  return pstj.material.template.Fab(model);
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
