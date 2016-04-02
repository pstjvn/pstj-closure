/**
 * @fileoverview Provides the 'shadow' for material elements. The element is
 * simple enough and does not require a separate model, thus controlling it
 * and setting its state cannot be bound to a specific model. Logic for that
 * can be delegated to controllers if needed, but in most cases the element is
 * used directly by another element and it should manages the shadow state /
 * depth.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.Shadow');
goog.provide('pstj.material.ShadowRenderer');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
/** @suppress {extraRequire} */
goog.require('pstj.material.State');
goog.require('pstj.material.template');

goog.scope(function() {



/**
 * @constructor
 * @struct
 * @extends {pstj.material.Element}
 */
pstj.material.Shadow = function() {
  goog.base(this);
  /**
   * The depth of the shadow. Used to skip setters when there is no need.
   * @type {number}
   * @private
   */
  this.depth_ = 0;
  this.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);
  this.setStateInternal(goog.ui.Component.State.TRANSITIONING);
};
goog.inherits(pstj.material.Shadow, pstj.material.Element);



/**
 * @constructor
 * @struct
 * @extends {pstj.material.ElementRenderer}
 */
pstj.material.ShadowRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.ShadowRenderer, pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.ShadowRenderer);


/**
 * @type {string}
 * @final
 */
pstj.material.ShadowRenderer.CSS_CLASS = goog.getCssName('material-shadow');


var _ = pstj.material.Shadow.prototype;
var r = pstj.material.ShadowRenderer.prototype;


/**
 * Sets the Z / depth of the shadow. The larger the value - the bugger the
 * shadow. Note that in Material design depth is reversed - items with larger
 * depth are drawn as hovering above the plane.
 * @param {number} depth
 */
_.setDepth = function(depth) {
  if (depth != this.depth_) {
    this.getRenderer().setDepth(this, this.depth_, depth);
    this.depth_ = depth;
  }
};


/**
 * Override this so we know what is the type of renderer and call it.
 * @override
 * @return {pstj.material.ShadowRenderer}
 */
_.getRenderer = function() {
  return goog.asserts.assertInstanceof(
      goog.base(this, 'getRenderer'), pstj.material.ShadowRenderer);
};


/** @inheritDoc */
r.getCssClass = function() {
  return pstj.material.ShadowRenderer.CSS_CLASS;
};


/** @inheritDoc */
r.getTemplate = function(model) {
  return pstj.material.template.Shadow(model);
};


/**
 * Updates the Z/depth of the element.
 * @param {pstj.material.Element} control
 * @param {number} from
 * @param {number} to
 */
r.setDepth = function(control, from, to) {
  var oc = this.getCssNameByNumber_(from);
  var nc = this.getCssNameByNumber_(to);
  goog.dom.classlist.swap(control.getElement(), oc, nc);
};


/**
 * The CSS compiler does not understand the number part of a class name as
 * a number and treats it as a regulsr string. Thus class names such as
 * 'material-shadow-1' are renamed to something similar to 'a-b-c' instead of
 * 'a-b-1' and this means that we cannot used the depth index directly in the
 * css name when using css renaming.
 *
 * This method maps the numbers back to CSS names that the compiler can
 * understand and inline and fixes the problem.
 *
 * @param {number} num The shadow depth to get CSS class name for.
 * @return {string} The class name as the css compiler would see it.
 * @private
 */
r.getCssNameByNumber_ = function(num) {
  if (num == 0) {
    return goog.getCssName(this.getCssClass(), '0');
  } else if (num == 1) {
    return goog.getCssName(this.getCssClass(), '1');
  } else if (num == 2) {
    return goog.getCssName(this.getCssClass(), '2');
  } else if (num == 3) {
    return goog.getCssName(this.getCssClass(), '3');
  } else if (num == 4) {
    return goog.getCssName(this.getCssClass(), '4');
  } else if (num == 5) {
    return goog.getCssName(this.getCssClass(), '5');
  } else {
    throw new Error('Unsupported shadow depth: ' + num);
  }
};


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.Shadow,
    pstj.material.ShadowRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.ShadowRenderer.CSS_CLASS, function() {
      return new pstj.material.Shadow();
    });

});  // goog.scope
