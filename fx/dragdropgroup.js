/**
 * @fileoverview Dragger group designed to utilize the custom dragger class for
 * smoother animation of dragged elements where complex DOM structure is
 * dragged. Beyound that is a simple overlay on top of the default dragger group
 * used in closure library.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('pstj.fx.DragDropGroup');

goog.require('goog.dom.classlist');
goog.require('goog.fx.DragDropGroup');
goog.require('pstj.fx.Dragger');



/**
 * Overloads the drag drop group of closure library to allow us to use more
 *   smooth techniques for drawing the UI.
 * @constructor
 * @extends {goog.fx.DragDropGroup}
 */
pstj.fx.DragDropGroup = function() {
  goog.base(this);
};
goog.inherits(pstj.fx.DragDropGroup, goog.fx.DragDropGroup);


/**
 * The template class name to look up in the DOM tree when cloning for drag
 *   HTMLElement.
 * @type {string}
 * @protected
 */
pstj.fx.DragDropGroup.prototype.templateClassName = goog.getCssName(
    'drag-template');


/** @inheritDoc */
pstj.fx.DragDropGroup.prototype.createDraggerFor = function(sourceEl, el,
    event) {
  // position the new element absolutely
  el.style.position = 'absolute';
  el.style.left = event.clientX + 'px';
  el.style.top = event.clientY + 'px';
  return new pstj.fx.Dragger(el);
};


/**
 * Alternative implementation of the method that allows the user to provide
 *   the element to be used for the template creation when a drag is started.
 *   In default closure implementation the clicked upon element is cloned,
 *   however in more complex drag items this is not the desired behavior,
 *   instead in this implementation a parent element is looked up by matching
 *   class name or until the body element is reached. If none is found, the
 *   clicked upon element is used.
 * @override
 */
pstj.fx.DragDropGroup.prototype.createDragElement = function(srcElement) {
  var el = srcElement;
  while (el != document.body) {
    if (goog.dom.classlist.contains(el, this.templateClassName)) {
      return goog.base(this, 'createDragElement', el);
    } else {
      el = el.parentElement;
    }
  }
  return goog.base(this, 'createDragElement', srcElement);
};
