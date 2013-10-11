/**
 * @fileoverview Provides simplified control that is tweaked to be used with
 * the multi view widget. It overrides the visibility handling and disables
 * the mouse handling to match more closely the simpler component interface.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.widget.MultiViewWrapper');
goog.provide('pstj.widget.MultiViewWrapperRenderer');

goog.require('goog.dom.classlist');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');
goog.require('pstj.ui.ControlRenderer');



/**
 * The wrapper is used to provide simplified and stripped down control that can
 * be easily used to host other components and controls inside a multi view
 * setup.
 *
 * @constructor
 * @extends {goog.ui.Control}
 * @param {goog.ui.ControlRenderer=} opt_renderer Optional renderer to use.
 * Notice that the renderer is the one that executed the UI state of visibility
 * for the control. Override its <code>setVisible</code> method if needed.
 */
pstj.widget.MultiViewWrapper = function(opt_renderer) {
  goog.base(this, '', opt_renderer ||
      pstj.widget.MultiViewWrapperRenderer.getInstance());

  this.setHandleMouseEvents(false);
  this.setAutoStates(goog.ui.Component.State.ALL, false);
  this.setSupportedState(goog.ui.Component.State.ALL, false);
};
goog.inherits(pstj.widget.MultiViewWrapper, goog.ui.Control);



/**
 * Custom renderer to use with our smstb components. We want to set the
 * visibility via classnames so we can apply some styling on the state
 * change (for example using keyframed animations).
 *
 * @constructor
 * @extends {pstj.ui.ControlRenderer}
 */
pstj.widget.MultiViewWrapperRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.widget.MultiViewWrapperRenderer, pstj.ui.ControlRenderer);
goog.addSingletonGetter(pstj.widget.MultiViewWrapperRenderer);

goog.scope(function() {
var _ = pstj.widget.MultiViewWrapperRenderer.prototype;


/** @inheritDoc */
_.setVisible = function(element, visible) {
  goog.dom.classlist.enable(element, goog.getCssName('smstb-hidden'), !visible);
};

});  // goog.scope
