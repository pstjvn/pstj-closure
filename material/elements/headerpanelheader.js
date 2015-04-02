goog.provide('pstj.material.HeaderPanelHeader');
goog.provide('pstj.material.HeaderPanelHeaderRenderer');

goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.template');



/**
 * The implementation for the Custom element.
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
pstj.material.HeaderPanelHeader = function(
    opt_content, opt_renderer, opt_domHelper) {
  goog.base(this, opt_content, opt_renderer, opt_domHelper);
};
goog.inherits(pstj.material.HeaderPanelHeader, pstj.material.Element);



/**
 * Implements the renderer for the element.
 * @constructor
 * @struct
 * @extends {pstj.material.ElementRenderer}
 */
pstj.material.HeaderPanelHeaderRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.HeaderPanelHeaderRenderer,
    pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.HeaderPanelHeaderRenderer);


/**
 * @type {string}
 * @final
 */
pstj.material.HeaderPanelHeaderRenderer.CSS_CLASS = goog.getCssName(
    'material-header-panel-header');


/** @inheritDoc */
pstj.material.HeaderPanelHeaderRenderer.prototype.getCssClass = function() {
  return pstj.material.HeaderPanelHeaderRenderer.CSS_CLASS;
};


/** @inheritDoc */
pstj.material.HeaderPanelHeaderRenderer.prototype.getTemplate = function(
    model) {
  return pstj.material.template.HeaderPanelHeader(model);
};



// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.HeaderPanelHeader,
    pstj.material.HeaderPanelHeaderRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.HeaderPanelHeaderRenderer.CSS_CLASS, function() {
      return new pstj.material.HeaderPanelHeader(null);
    });

