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
 * The bindin count name to map in the element.
 *
 * @type {string}
 * @final
 */
pstj.ui.Template.DATA_BINDING_COUNT = 'bindingsCount';


/**
 * Creates an instance of the template that uses alternate class names.
 *
 * @param {Function} ctor The constructor of the renderer you are trying to
 * create.
 * @param {string} className The name of the CSS class for this renderer.
 * @return {goog.ui.ControlRenderer} An instance of the desired renderer with
 * its getCssClass() method overridden to return the supplied custom CSS class
 * name.
 */
pstj.ui.Template.getCustomTemplate = function(ctor, className) {
  var template = new ctor();

  template.getCssClass = function() {
    return className;
  };

  return template;
};


/**
 * Returns the base class name for the template.
 * @return {!string}
 */
pstj.ui.Template.prototype.getCssClass = function() {
  return 'template';
};


/**
 * Returns the constructed DOM for the create dom cycle in the component.
 * @param {goog.ui.Component} component The component to use as model.
 * @return {!Element} The element to be used as root node.
 */
pstj.ui.Template.prototype.createDom = function(component) {
  var htmlstring = this.getTemplate(this.generateTemplateData(component));
  var bindings = this.getBindingsCount(htmlstring);
  var el = /** @type {!Element} */(this.createElement(htmlstring));
  goog.dom.dataset.set(el, pstj.ui.Template.DATA_BINDING_COUNT,
      bindings.toString());
  return el;
};


/**
 * Will count the double moustaches occurences inside the element.
 * Note that here we do not assume component bounds and instead count all
 * occurences.
 *
 * @param {string} htmlstring The HTML string to inspect.
 * @return {number} The number of moustaches occurences.
 */
pstj.ui.Template.prototype.getBindingsCount = function(htmlstring) {
  var result = htmlstring.match(/{{.*}}/g);
  if (!result) return 0;
  return result.length;
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


/**
 * Transforms a string into document fragment.
 * @param {string} htmlstring The HTML as a string.
 * @return {!Element}
 */
pstj.ui.Template.prototype.createElement = function(htmlstring) {
  return /** @type {!Element} */(goog.dom.htmlToDocumentFragment(htmlstring));
};
