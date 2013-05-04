goog.provide('pstj.ui.ControlRenderer');

goog.require('goog.ui.ControlRenderer');

/**
 * My new class description
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
pstj.ui.ControlRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.ui.ControlRenderer, goog.ui.ControlRenderer);

/**
 * @const
 * @type {string}
 */
pstj.ui.ControlRenderer.CSS_CLASS = goog.getCssName('pstj-control');

goog.scope(function() {

  var _ = pstj.ui.ControlRenderer.prototype;
  /** @inheritDoc */
  _.createDom = function(control) {
    var element;
    if (!goog.isNull(control.getTemplate())) {
      element = control.getTemplate().createDom(control);
      this.setAriaStates(control, element);
      return element;
    } else {
      return goog.base(this, 'createDom', control);
    }
  };

  /** @inheritDoc */
  _.getCssClass = function() {
    return pstj.ui.ControlRenderer.CSS_CLASS;
  };
});

