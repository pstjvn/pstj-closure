goog.provide('pstj.ui.Templated');

goog.require('goog.dom');
goog.require('goog.ui.Component');
goog.require('pstj.ui.Template');

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
 * @param {pstj.ui.Template=} opt_template The template to use in the component.
 */
pstj.ui.Templated = function(opt_template) {
  goog.base(this);
  /**
   * @private
   * @type {pstj.ui.Template}
   */
  this.template_ = opt_template || pstj.ui.Template.getInstance();
};
goog.inherits(pstj.ui.Templated, goog.ui.Component);

/** @inheritDoc */
pstj.ui.Templated.prototype.createDom = function() {
  this.decorateInternal(this.getTemplate().createDom(this));
};

/**
 * Returns the component's template generating instance.
 * @protected
 * @return {pstj.ui.Template} The templating instance used by this component.
 */
pstj.ui.Templated.prototype.getTemplate = function() {
  return this.template_;
};

/** @inheritDoc */
pstj.ui.Templated.prototype.getContentElement = function() {
  return this.getTemplate().getContentElement(this);
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

/**
 * Queries the root element of the component for a specific query pattern and
 *   returns the first match.
 * @param {string} query The query to look up.
 * @return {Element} The first matching element or null if none matches.
 */
pstj.ui.Templated.prototype.querySelector = function(query) {
  return this.getElement().querySelector(query);
};

/**
 * Queries the component's root node for elements mathicng the query string.
 * @param {string} query Css query string.
 * @return {!NodeList} The node collection. Collection could be empty.
 */
pstj.ui.Templated.prototype.querySelectorAll = function(query) {
  return this.getElement().querySelectorAll(query);
};

/** @inheritDoc */
pstj.ui.Templated.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.template_ = null;
};
