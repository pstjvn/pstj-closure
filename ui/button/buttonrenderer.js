/**
 * @fileoverview Provide custom renderer on top of the simple button
 * renderer. This renderer is used with 'div' tags to make buttons out of
 * them and make them behave like such, i.e. receive focus, receive aria roles
 * and receive outline.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.CustomButtonRenderer');

goog.require('goog.a11y.aria.Role');
goog.require('goog.dom.classes');
goog.require('goog.ui.ButtonRenderer');



/**
 * Provides custom renderer for the text buttons to match our styling needs.
 * @constructor
 * @extends {goog.ui.ButtonRenderer}
 */
pstj.ui.CustomButtonRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.ui.CustomButtonRenderer, goog.ui.ButtonRenderer);
goog.addSingletonGetter(pstj.ui.CustomButtonRenderer);


/**
 * The class name to use when composing custom states for the button. Because
 *   the button is actually a DIV element, the states are composed as css
 *   class combinations: eg. baseclass-* where * is the state (focused,
 *   hovered, active etc).
 * @type {string}
 */
pstj.ui.CustomButtonRenderer.CSS_CLASS = goog.getCssName('pstj-button');


/** @inheritDoc */
pstj.ui.CustomButtonRenderer.prototype.getAriaRole = function() {
  return goog.a11y.aria.Role.BUTTON;
};


/**
 * Sets the value for the button text.
 * @param {Element} el The button element.
 * @param {string} value The new text value of the button.
 */
pstj.ui.CustomButtonRenderer.prototype.setValue = function(el, value) {
  el.innerHTML = value;
};


/**
 * Simply forvide this for now, if we need to change content this might change
 *   as well
 * @param  {Element} element The element that is assigned to the component
 *   i.e. component.getElement().
 * @return {Element} The element to consider as content element, i.e. if we
 *   want to put content where should it go.
 */
pstj.ui.CustomButtonRenderer.prototype.getContentElement = function(element) {
  return element;
};


/**
 * Called internally when decorateInternal is called on the button component.
 * @param  {goog.ui.Control} control The custom button component instance to
 *   work with.
 * @param  {Element} element The HTML element that we want to make the root of
 *   the component.
 * @return {Element} The decorated element. basically the same element.
 */
pstj.ui.CustomButtonRenderer.prototype.decorate = function(control, element) {
  var button = /** @type {goog.ui.Button} */ (control);
  goog.dom.classes.add(element, this.getCssClass());
  return goog.base(this, 'decorate', button, element);
};


/**
 * Returns the basic css class for this component, see CSS_CLASS description.
 * @return {string} The related CSS class.
 */
pstj.ui.CustomButtonRenderer.prototype.getCssClass = function() {
  return pstj.ui.CustomButtonRenderer.CSS_CLASS;
};
