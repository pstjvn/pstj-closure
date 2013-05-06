goog.provide('pstj.ui.PopOverLayer');
goog.provide('pstj.ui.PopOverLayerTemplate');

goog.require('pstj.templates');
goog.require('pstj.ui.Template');
goog.require('pstj.ui.Templated');

/**
 * @fileoverview Provides pop over layer (input blocker) with the ability to
 *   embed a single item to display. The item is expected to be a component.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * My new class description
 * @constructor
 * @extends {pstj.ui.Template}
 */
pstj.ui.PopOverLayerTemplate = function() {
  goog.base(this);
};
goog.inherits(pstj.ui.PopOverLayerTemplate, pstj.ui.Template);
goog.addSingletonGetter(pstj.ui.PopOverLayerTemplate);
/** @inheritDoc */
pstj.ui.PopOverLayerTemplate.prototype.getTemplate = function(model) {
  return pstj.templates.popover({});
};
/** @inheritDoc */
pstj.ui.PopOverLayerTemplate.prototype.getContentElement = function(comp) {
  return comp.getEls(goog.getCssName('popover-frame'));
};


/**
 * My new class description
 * @constructor
 * @extends {pstj.ui.Templated}
 * @param {pstj.ui.Template=} opt_template Optional alternative template to use.
 */
pstj.ui.PopOverLayer = function(opt_template) {
  goog.base(this, opt_template || pstj.ui.PopOverLayerTemplate.getInstance());
};
goog.inherits(pstj.ui.PopOverLayer, pstj.ui.Templated);

goog.scope(function() {

  var _ = pstj.ui.PopOverLayer.prototype;

  /**
   * Sets the visibility state of the component, basically enables is or
   *   disables it.
   * @param {boolean} enable True to visualize the pop over with the currently
   *   embeded component.
   */
  _.setVisible = function(enable) {
    if (this.visible_ != enable) {
      this.visible_ = enable;
      if (this.visible_) this.getElement().style.display = 'table';
      else this.getElement().style.display = 'none';
    }
  };

  /** @inheritDoc */
  _.addChild = function(component, opt_render) {
    if (this.hasChildren()) {
      if (component != this.getChildAt(0)) {
        this.removeChildren();
      }
    }
    goog.base(this, 'addChild', component, opt_render);
  };

});

