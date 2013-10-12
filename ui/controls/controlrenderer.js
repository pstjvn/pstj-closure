goog.provide('pstj.ui.ControlRenderer');

goog.require('goog.asserts');
goog.require('goog.ui.Control');
goog.require('goog.ui.ControlRenderer');
goog.require('pstj.ds.ListItem');
goog.require('pstj.templates');



/**
 * Provides basic renderer that has the following advantages over the default
 *   control renderer:
 *   - provides abstraction of template
 *   - provides abstraction off the model:
 *
 * Basically it allow the widget author to extend by either chaning the
 *   template, changing the model tunneling to the template ot both.
 *
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
pstj.ui.ControlRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.ui.ControlRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(pstj.ui.ControlRenderer);


/**
 * @const
 * @type {string}
 */
pstj.ui.ControlRenderer.CSS_CLASS = goog.getCssName('pstj-control');


/** @inheritDoc */
pstj.ui.ControlRenderer.prototype.getCssClass = function() {
  return pstj.ui.ControlRenderer.CSS_CLASS;
};


/**
 * Should return the string template.
 * @param {goog.ui.Component} component The component instance.
 * @return {string}
 * @protected
 */
pstj.ui.ControlRenderer.prototype.getTemplate = function(component) {
  return pstj.templates.Control(this.generateTemplateData(component));
};


/**
 * Generates the data to be passed to the template instance.
 * @param {goog.ui.Component} component The component instance.
 * @return {Object.<string, *>} The generated template model.
 * @protected
 */
pstj.ui.ControlRenderer.prototype.generateTemplateData = function(component) {
  var model = component.getModel();
  if (model instanceof pstj.ds.ListItem) {
    return model.getRawData();
  }
  if (model instanceof Object) return model;
  return {};
};


/** @inheritDoc */
pstj.ui.ControlRenderer.prototype.createDom = function(control) {
  goog.asserts.assertInstanceof(control, goog.ui.Control);
  var element = this.getCompiledTemplate_(control);
  this.setAriaStates(control, element);
  return element;
};


/**
 * Returns the compiled DOM from the html template. This is required to
 *   allow the component to have referrence to a root DOM node.
 * @param {goog.ui.Component} component The component to render for.
 * @return {!Element} The constructed element.
 * @private
 */
pstj.ui.ControlRenderer.prototype.getCompiledTemplate_ = function(component) {
  return /** @type {!Element} */ (goog.dom.htmlToDocumentFragment(
      this.getTemplate(component)));
};
