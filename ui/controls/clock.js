goog.provide('pstj.widget.Clock');

goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');
goog.require('pstj.ds.ListItem');
goog.require('pstj.ui.ClockAgent');
goog.require('pstj.ui.ngAgent');
goog.require('pstj.widget.ClockRenderer');

/**
 * Proof of concept clock widget / control that uses the agent interface.
 * @constructor
 * @extends {goog.ui.Control}
 * @param {pstj.ui.ControlRenderer=} opt_render Optional renderer to use to
 *   draw the clock control.
 */
pstj.widget.Clock = function(opt_render) {
  goog.base(this, '',
    opt_render || pstj.widget.ClockRenderer.getInstance());
  this.setSupportedState(goog.ui.Component.State.ACTIVE, false);
  this.setSupportedState(goog.ui.Component.State.FOCUSED, false);
  this.setAutoStates(goog.ui.Component.State.ACTIVE, false);
  this.setAutoStates(goog.ui.Component.State.FOCUSED, false);
  //this.setDispatchTransitionEvents(goog.ui.Component.State.ACTIVE, true);
  this.setModel(new pstj.ds.ListItem({
    'id': goog.now(),
    'time': 0
  }));
  pstj.ui.ClockAgent.getInstance().attach(this);
};
goog.inherits(pstj.widget.Clock, goog.ui.Control);

goog.scope(function() {

  var _ = pstj.widget.Clock.prototype;

  /** @inheritDoc */
  _.enterDocument = function() {
    goog.base(this, 'enterDocument');
    pstj.ui.ngAgent.getInstance().apply(this);
  };

  /** @inheritDoc */
  _.setModel = function(model) {
    if (goog.isNumber(model)) {
      this.getModel().mutate('time', model);
    } else {
      goog.base(this, 'setModel', model);
    }
    pstj.ui.ngAgent.getInstance().apply(this);
  };

});
