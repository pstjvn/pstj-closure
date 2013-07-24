goog.provide('pstj.ui.ListItemControl');

goog.require('goog.ui.Control');
goog.require('pstj.ui.ListItemRenderer');

/**
 * My new class description
 * @constructor
 * @extends {goog.ui.Control}
 * @param {goog.ui.ControlRenderer} opt_renderer The renderer instance to use.
 */
pstj.ui.ListItemControl = function(opt_renderer) {
  goog.base(this, '', opt_renderer || pstj.ui.ListItemRenderer.getInstance());
  this.setSupportedState(goog.ui.Component.State.SELECTED, true);
};
goog.inherits(pstj.ui.ListItemControl, goog.ui.Control);

goog.scope(function() {
  var _ = pstj.ui.ListItemControl.prototype;
  /** @inheritDoc */
  _.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this, goog.ui.Component.EventType.ACTIVATE,
      this.onActivate);
  };
  /** @inheritDoc */
  _.onActivate = function(e) {
    this.setSelected(true);
  };
});
