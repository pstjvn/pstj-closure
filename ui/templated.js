goog.provide('pstj.ui.Templated');

goog.require('goog.ui.Component');
goog.require('goog.dom');

/**
 * @fileoverview Provides a class that automatically provides handing for a
 * widget that is generated from a template It also packs the needed type
 * checks and castings to make the compiler happy when working with
 * sub-elements of the widget.
 *
 * @author  regardingscot@gmail.com (Peter StJ)
 */

/**
 * Provides the base for components that are generated from templates. Those
 *   are used to construct the DOM from a closure template and this way
 *   utilize the class name reduction in advanced mode and keep the ability to
 *   use complex DOM structured.
 * @constructor
 * @extends {goog.ui.Component}
 */
pstj.ui.Templated = function() {
  goog.base(this);
};
goog.inherits(pstj.ui.Templated, goog.ui.Component);

/**
 * @inheritDoc
 */
pstj.ui.Templated.prototype.createDom = function() {
  this.decorateInternal(/** @type {!Element} */ (this.getTemplateCompiled()));
};

/**
 * Returns the widget's HTML.
 * @protected
 * @return {!string} The HTML of the template used to generate the DOM tree.
 */
pstj.ui.Templated.prototype.getTemplate = function() {
  return '<div></div>';
};

/**
 * The Node generate from the HTML of the template.
 * @protected
 * @return {!Node} The DOM node the widget tree is attached to.
 */
pstj.ui.Templated.prototype.getTemplateCompiled = function() {
  return goog.dom.htmlToDocumentFragment(this.getTemplate());
};

/**
 * Retrieves an element in the component that matches the provided class name.
 * @param  {string} selector The css class name to look up. It should be
 *   already retrieved with getCssName.
 * @return {!Element} The first matching element.
 */
pstj.ui.Templated.prototype.getEls = function(selector) {
  var el = goog.dom.getElementByClass(selector, this.getElement());
  if (el == null) throw Error('The element does not exists in the component');
  return el;
};
