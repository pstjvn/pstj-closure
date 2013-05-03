goog.provide('pstj.ui.Control');

goog.require('goog.ui.Control');
goog.require('goog.ui.registry');
goog.require('pstj.ui.Template');

/**
 * My new class description
 * @constructor
 * @extends {goog.ui.Control}
 * @param {?string} contet The content to use, this is not really used here.
 * @param {pstj.ui.ControlRenderer=} opt_renderer The renderer to use, it
 *   should understand templates.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *   document interaction.
 * @param {pstj.ui.Template=} opt_template The template instance creator to
 *   use to generate the DOM.
 */
pstj.ui.Control = function(content, opt_renderer, opt_domHelper, opt_template) {
  goog.base(this, content, opt_renderer, opt_domHelper);
  /**
   * @private
   * @type {pstj.ui.Template}
   */
  this.template_ = opt_template || pstj.ui.Template.getInstance();
};
goog.inherits(pstj.ui.Control, goog.ui.Control);

goog.scope(function() {

  var _ = pstj.ui.Control.prototype;

  /**
   * Getter for the template assigned to this instance.
   * @return {pstj.ui.Template}
   */
  _.getTemplate = function() {
    return this.template_;
  };

  /** @inheritDoc */
  _.disposeInternal = function() {
    goog.base(this, 'disposeInternal');
    this.template_ = null;
  };

});

// Register the default renderer for goog.ui.Controls.
goog.ui.registry.setDefaultRenderer(pstj.ui.Control, pstj.ui.ControlRenderer);

// Register a decorator factory function for goog.ui.Controls.
goog.ui.registry.setDecoratorByClassName(pstj.ui.ControlRenderer.CSS_CLASS,
  function() {
    return new pstj.ui.Control(null);
  });
