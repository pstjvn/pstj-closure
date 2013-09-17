/**
 * @fileoverview Provides pop over layer (input blocker) with the ability to
 * embed a single item to display. The item is expected to be a component.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.PopOverLayer');
goog.provide('pstj.ui.PopOverLayerTemplate');

goog.require('pstj.templates');
goog.require('pstj.ui.Template');
goog.require('pstj.ui.Templated');



/**
 * Template specific for the popover layer component. It uses the template from
 * the library.
 *
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
  return comp.getEls(goog.getCssName('pstj-popover-frame'));
};



/**
 * Provides very simple component that supports only one child to be embeeded in
 * it at a time and supports visibility state. Designed to be used as popover.
 * @constructor
 * @extends {pstj.ui.Templated}
 * @param {pstj.ui.Template=} opt_template Optional alternative template to use.
 */
pstj.ui.PopOverLayer = function(opt_template) {
  goog.base(this, opt_template || pstj.ui.PopOverLayerTemplate.getInstance());
  /**
   * Flag if the UI component is currently visible.
   * @type {boolean}
   * @private
   */
  this.visible_ = false;
};
goog.inherits(pstj.ui.PopOverLayer, pstj.ui.Templated);


/**
 * Sets the visibility state of the component, basically enables is or
 *   disables it.
 * @param {boolean} enable True to visualize the pop over with the currently
 *   embeded component.
 */
pstj.ui.PopOverLayer.prototype.setVisible = function(enable) {
  if (this.visible_ != enable) {
    this.visible_ = enable;
    if (this.visible_) this.getElement().style.display = 'table';
    else this.getElement().style.display = 'none';
  }
};


/** @inheritDoc */
pstj.ui.PopOverLayer.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this, goog.ui.Component.EventType.CLOSE,
      function() {
        this.setVisible(false);
      });
};


/** @inheritDoc */
pstj.ui.PopOverLayer.prototype.addChild = function(component) {
  if (this.hasChildren()) {
    if (component != this.getChildAt(0)) {
      this.getChildAt(0).getElement().style.display = 'none';
      this.removeChildren();
    }
  }
  goog.base(this, 'addChild', component);
  component.getElement().style.display = 'block';
};

