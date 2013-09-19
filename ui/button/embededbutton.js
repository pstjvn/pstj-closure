/**
 * @fileoverview Provides the customized renderer for when the button needs to
 * be a child of another control element.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('pstj.ui.EmbededButtonRenderer');

goog.require('pstj.ui.CustomButtonRenderer');



/**
 * We need to extend the renderer in such a way as to disallow key event
 * handling (for key handlers / focus) in the case where the button is embedded
 * in another control element instance. The problem is that while the event
 * travels to the parent (mainly clicks and hovers) the top component returns
 * its own root element as key handler and the library simply changes the
 * keyHandler target which makes the child control to loose its active state and
 * when the mouse is released the component is not in active state and thus the
 * ACTION event is not fired. Returning null as the target for the key handler
 * event will prevent the loss of focus.
 *
 * @constructor
 * @extends {pstj.ui.CustomButtonRenderer}
 */
pstj.ui.EmbededButtonRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.ui.EmbededButtonRenderer, pstj.ui.CustomButtonRenderer);
goog.addSingletonGetter(pstj.ui.EmbededButtonRenderer);


/** @inheritDoc */
pstj.ui.EmbededButtonRenderer.prototype.getKeyEventTarget = function() {
  return null;
};
