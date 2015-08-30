goog.provide('pstj.ui.Button');

goog.require('goog.dom.dataset');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.registry');
goog.require('pstj.ui.CustomButtonRenderer');
goog.require('pstj.ui.TouchAgent');



/**
 * Provides shorthand for our button. The button is also optimized for touch
 *   events (i.e. it handles the touches directly and thus is much more
 *   responsive than regular buttons that awai the click simulation).
 * @constructor
 * @param {goog.ui.ButtonRenderer=} opt_renderer Optional renderer to use.
 * @extends {goog.ui.CustomButton}
 */
pstj.ui.Button = function(opt_renderer) {
  goog.base(this, '', opt_renderer ||
      pstj.ui.CustomButtonRenderer.getInstance());
};
goog.inherits(pstj.ui.Button, goog.ui.CustomButton);


/**
 * Custom method to allow the templates to give names to the actions and thus
 *   allow controllers to bind indirectly to component and sub-component
 *   actions.
 * @return {?string} The action name if any, null if none.
 */
pstj.ui.Button.prototype.getActionName = function() {
  return goog.dom.dataset.get(this.getElement(), 'action');
};


/** @inheritDoc */
pstj.ui.Button.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  pstj.ui.TouchAgent.getInstance().attach(this);
};

// Register a decorator factory function for pstj.ui.Button
goog.ui.registry.setDecoratorByClassName(pstj.ui.CustomButtonRenderer.CSS_CLASS,
    function() {
      return new pstj.ui.Button();
    }
);
