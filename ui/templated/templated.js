/**
 * @fileoverview Provides a class that automatically provides handing for a
 * widget that is generated from a template It also packs the needed type
 * checks and castings to make the compiler happy when working with
 * sub-elements of the widget.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.Templated');

goog.require('goog.dom');
goog.require('goog.dom.dataset');
goog.require('goog.ui.Component');
goog.require('pstj.ui.Template');



/**
 * Provides the base for components that are generated from templates. Those
 *   are used to construct the DOM from a closure template and this way
 *   utilize the class name reduction in advanced mode and keep the ability to
 *   use complex DOM structured.
 * @constructor
 * @extends {goog.ui.Component}
 * @param {pstj.ui.Template=} opt_template The template to use in the component.
 * @param {goog.dom.DomHelper=} opt_domHelper The DOM helper to use.
 */
pstj.ui.Templated = function(opt_template, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
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
 * Override the deault decoration to enable the behaviors we want to gtant the
 * users for declarative properties and actions. Basically we need a list
 * flags that will apply to the element, for example touch-action could
 * automatically setup the listeners in the touch agent as well as parsing
 * the model bindginds. We will not support the full fledged binding model
 * or Polymer or Angular, but we can safely apply it to text nodes as well as
 * attributes, which is pretty easy to accomplish using DOM interfaces.
 *
 * In this implementation we assume that the model should be applied only
 * in the boundary of the template itself, so basically we will not support
 * using properties to bind to data. This means that your element will be
 * scanned for one way data binding only one at its decoration. If you
 * are going to use 'decorate' you can still use decorate.
 *
 * When using decorate on the HTML we use the tag name to determine which
 * tag is which component. In such case we start from the top nodes and go
 * deep in the three - this makes it impossible to determine where is
 * the boundary of our components ends and where the child component starts
 * Several solutions are possible:
 *
 * a) postpose the data binding for after the decoration (using timeout or
 * better yet wait for the next tick) - this will allow the iterative JS to
 * finish the decoration of all branches and leaves. However we still cannot
 * have boundary between the Element's actual element and the root elements
 * of its children.
 *
 * b) use property on the boundary elements to determine that bellow the element
 * a new component starts and the modeling should be delegated. This will force
 * us to play woth model scopes - the model of the parent component should
 * be tranposed to the child component if there is binding in there. Walking
 * up the model scope chain could become expensive...
 *
 * c) iteratively lookup bindings going from nbesting level to nexting level
 * This will allow us to have binding ready in sync with decoration.
 *
 * It is unclear which method is fastest and also those do not cover cases
 * where the server genrates HTML code that need to be decorated after the
 * initial app loading (i.e. modules etc).
 *
 * ALso we need to implement automatic two way bindings for input elements
 *
 * One more problem is that if we bind child component.s model to parent
 * component model the child cannot have its own model. SOmetimes we
 * need to have access to the parent model scope, but if we do so
 * changes cannot be propagated to the children because the events only
 * bubble upwards the tree. So if childA has its own model and is bound
 * to a parent components model the value is retrieved by walking up the
 * component chain and looking up the models of each parent. THis isa
 * a) slow and b) unsafe because if change occurs on a model in a parent
 * the child binding cannot recognize it.
 *
 * @override
 */
pstj.ui.Templated.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);
  if (goog.dom.dataset.get(element, pstj.ui.Template.DATA_BINDING_COUNT) > 0) {
    this.createBindings();
  }
};


/**
 * Actual implementation for the data binding.
 * @protected
 */
pstj.ui.Templated.prototype.createBindings = function() {

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
 * @param {!string} query The query to look up.
 * @return {Element} The first matching element or null if none matches.
 */
pstj.ui.Templated.prototype.querySelector = function(query) {
  return this.getElement().querySelector(query);
};


/**
 * Queries the component's root node for elements mathicng the query string.
 * @param {!string} query Css query string.
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
