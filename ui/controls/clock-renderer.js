goog.provide('pstj.widget.ClockRenderer');

goog.require('pstj.templates');
goog.require('pstj.ui.ControlRenderer');

/**
 * Demoes the clock contorl. This is the custom renderer for it.
 * @constructor
 * @extends {pstj.ui.ControlRenderer}
 */
pstj.widget.ClockRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.widget.ClockRenderer, pstj.ui.ControlRenderer);
goog.addSingletonGetter(pstj.widget.ClockRenderer);

/**
 * @const
 * @type {string}
 */
pstj.widget.ClockRenderer.CSS_CLASS = goog.getCssName('pstj-widget-clock');


/** @inheritDoc */
pstj.widget.ClockRenderer.prototype.getTemplate = function(component) {
  return pstj.templates.clock({});
};


/** @inheritDoc */
pstj.widget.ClockRenderer.prototype.getCssClass = function() {
  return pstj.widget.ClockRenderer.CSS_CLASS;
};
