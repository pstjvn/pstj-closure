goog.provide('pstj.ui.ControlRenderer');

goog.require('goog.asserts');
goog.require('goog.ui.Control');
goog.require('goog.ui.ControlRenderer');
goog.require('pstj.templates');

/**
 * My new class description
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

goog.scope(function() {

  var _ = pstj.ui.ControlRenderer.prototype;

  /** @inheritDoc */
  _.getCssClass = function() {
    return pstj.ui.ControlRenderer.CSS_CLASS;
  };

  /**
   * Should return the string template.
   * @param {goog.ui.Component} component The component instance.
   * @return {string}
   * @protected
   */
  _.getTemplate = function(component) {
    return pstj.templates.Control(this.generateTemplateData(component));
  };

  /**
   * Generates the data to be passed to the template instance.
   * @param {goog.ui.Component} component The component instance.
   * @return {Object.<string, *>} The generated template model.
   * @protected
   */
  _.generateTemplateData = function(component) {
    return {
      data: component.getModel()
    };
  };

  /** @inheritDoc */
  _.createDom = function(control) {
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
  _.getCompiledTemplate_ = function(component) {
    return /** @type {!Element} */ (goog.dom.htmlToDocumentFragment(
      this.getTemplate(component)));
  };

});
