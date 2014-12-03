goog.provide('pstj.material.HeaderPanelMain');
goog.provide('pstj.material.HeaderPanelMainRenderer');

goog.require('goog.ui.registry');
goog.require('pstj.agent.Scroll');
goog.require('pstj.agent.ScrollEvent');
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
pstj.material.HeaderPanelMain = function(
    opt_content, opt_renderer, opt_domHelper) {
  goog.base(this, opt_content, opt_renderer, opt_domHelper);
};
goog.inherits(pstj.material.HeaderPanelMain, pstj.material.Element);


/**
 * Creates a new instance from a JSON config.
 * @param {MaterialConfig} json
 * @return {pstj.material.HeaderPanelMain}
 */
pstj.material.HeaderPanelMain.fromJSON = function(json) {
  var i = new pstj.material.HeaderPanelMain();
  i.setUseScrollAgent(json.useScroll || false);
  pstj.material.Element.fromJSON(json, i);
  return i;
};


/** @inheritDoc */
pstj.material.HeaderPanelMain.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  if (this.hasUseScrollAgent()) {
    this.dispatchEvent(new pstj.agent.ScrollEvent(this));
  }
};


/**
 * Implements the IScrollable interface to be able to wrk correctly with the
 * Scroll agent.
 * @return {!Element}
 */
pstj.material.HeaderPanelMain.prototype.getScrollElement = function() {
  return /** @type {!Element} */ (this.querySelector('.' +
      goog.getCssName(this.getRenderer().getCssClass(), 'container')));
};



/**
 * Implements the renderer for the element.
 * @constructor
 * @struct
 * @extends {pstj.material.ElementRenderer}
 */
pstj.material.HeaderPanelMainRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.HeaderPanelMainRenderer,
    pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.HeaderPanelMainRenderer);


/**
 * @type {string}
 * @final
 */
pstj.material.HeaderPanelMainRenderer.CSS_CLASS = goog.getCssName(
    'material-header-panel-main');


/** @inheritDoc */
pstj.material.HeaderPanelMainRenderer.prototype.getCssClass = function() {
  return pstj.material.HeaderPanelMainRenderer.CSS_CLASS;
};


/** @inheritDoc */
pstj.material.HeaderPanelMainRenderer.prototype.getTemplate = function(model) {
  return pstj.material.template.HeaderPanelMain(model);
};


/** @inheritDoc */
pstj.material.HeaderPanelMainRenderer.prototype.getContentElement = function(
    el) {
  return goog.dom.getElementByClass(goog.getCssName(
      this.getCssClass(), 'content'), el);
};


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.HeaderPanelMain,
    pstj.material.HeaderPanelMainRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.HeaderPanelMainRenderer.CSS_CLASS, function() {
      return new pstj.material.HeaderPanelMain(null);
    });


