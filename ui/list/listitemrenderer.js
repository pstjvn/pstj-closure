goog.provide('pstj.ui.ListItemRenderer');

goog.require('goog.ui.ControlRenderer');
goog.require('pstj.ui.ListItemTemplate');

/**
 * My new class description
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
pstj.ui.ListItemRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.ui.ListItemRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(pstj.ui.ListItemRenderer);

/**
 * @const
 * @type {string}
 */
pstj.ui.ListItemRenderer.CSS_CLASS = goog.getCssName('pstj-list-item');

goog.scope(function() {

  var _ = pstj.ui.ListItemRenderer.prototype;

  /** @inheritDoc */
  _.createDom = function(control) {
    return pstj.ui.ListItemTemplate.getInstance().createDom(control);
  };

  /** @inheritDoc */
  _.getCssClass = function() {
    return pstj.ui.ListItemRenderer.CSS_CLASS;
  };

});

