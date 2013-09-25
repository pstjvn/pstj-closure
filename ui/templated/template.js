/**
 * @fileoverview Provides a new approach to the templatizing of the
 *   componenets, instead of implementing the view logic in the template it is
 *   safe to use the template instance to handle all the DOM actions such as
 *   template selection, template rendering and content element finding.
 *   Decoration is intentionally left out as it is best set in the renderer
 *   for more complex controls.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.Template');

goog.require('goog.dom');
goog.require('goog.ui.Component');



/**
 * Provides templates for the components.
 * @constructor
 */
pstj.ui.Template = function() {};
goog.addSingletonGetter(pstj.ui.Template);


/**
 * Returns the constructed DOM for the create dom cycle in the component.
 * @param {goog.ui.Component} templated The component to use as model.
 * @return {!Element} The element to be used as root node.
 */
pstj.ui.Template.prototype.createDom = function(templated) {
  return /** @type {!Element} */ (
      this.getCompiledTemplate_(this.generateTemplateData(templated)));
};


/**
 * Method to generate data that the template will understand from the model
 *   data of the component.
 * @param {goog.ui.Component} component The model of the component.
 * @return {Object.<string, *>} The generated template model.
 * @protected
 */
pstj.ui.Template.prototype.generateTemplateData = function(component) {
  return {
    data: component.getModel()
  };
};


/**
 * Returns the compiled DOM from the html template. This is required to
 *   allow the component to have referrence to a root DOM node.
 * @param {Object.<string, *>} model The model of the component if any to
 *   use in building the template.
 * @return {Element} The constructed element.
 * @private
 */
pstj.ui.Template.prototype.getCompiledTemplate_ = function(model) {
  return /** @type {!Element} */ (goog.dom.htmlToDocumentFragment(
      this.getTemplate(model)));
};


/**
 * Returns the html sring to be the DOM for a component instance.
 * @param {Object.<string, *>} model The component's model if any.
 * @return {string} The HTML of the component.
 * @protected
 */
pstj.ui.Template.prototype.getTemplate = function(model) {
  return '<div></div>';
};


/**
 * Getter for the component's content element.
 * @param {goog.ui.Component} component The component who's content element
 *   to look up.
 * @return {Element}
 */
pstj.ui.Template.prototype.getContentElement = function(component) {
  return component.getElement();
};
