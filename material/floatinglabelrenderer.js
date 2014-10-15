/**
 * @fileoverview Provides the renderer for the floating label used by the
 * material deisgn input element.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.FloatingLabelRenderer');

goog.require('goog.dom');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.template');



/**
 * Provides the renderer abstraction for the floating label helper
 * element.
 * @constructor
 * @extends {pstj.material.ElementRenderer}
 * @struct
 */
pstj.material.FloatingLabelRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.FloatingLabelRenderer,
    pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.FloatingLabelRenderer);


/**
 * The CSS class name to recognize the floating label for an input.
 * @type {string}
 * @final
 */
pstj.material.FloatingLabelRenderer.CSS_CLASS = goog.getCssName(
    'floating-label');


/** @override */
pstj.material.FloatingLabelRenderer.prototype.getTemplate = function(m) {
  return pstj.material.template.FloatingLabel(m);
};


/** @override */
pstj.material.FloatingLabelRenderer.prototype.generateTemplateData = function(
    control) {
  return {
    label: control.getContent()
  };
};


/** @override */
pstj.material.FloatingLabelRenderer.prototype.setContent = function(
    element, content) {
  // we require the content to be a string...
  goog.asserts.assertString(content);
  goog.dom.setTextContent(
      goog.dom.getElementByClass(
          goog.getCssName(
              pstj.material.FloatingLabelRenderer.CSS_CLASS, 'text'),
          element), content);
};


/** @override */
pstj.material.FloatingLabelRenderer.prototype.getCssClass = function() {
  return pstj.material.FloatingLabelRenderer.CSS_CLASS;
};
