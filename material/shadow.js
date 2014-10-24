goog.provide('pstj.material.Shadow');
goog.provide('pstj.material.ShadowRenderer');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
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
  var oc = this.getCssClass() + '-' + from;
  var nc = this.getCssClass() + '-' + to;
  goog.dom.classlist.swap(control.getElement(), oc, nc);
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
