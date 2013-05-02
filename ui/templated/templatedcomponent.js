goog.provide('pstj.ui.TemplatedComponent');

goog.require('goog.ui.Component');

/**
 * Provides meaningful component base for components created by template. This
 *   is a redesign of the pstj.ui.Templated class of components to allow the
 *   component to be reused without being subclasses by simply replacing the
 *   renderer and thus allowing for more diversed UI presentation of the same
 *   base logic. Simply put it will allow the developer to select a template
 *   at runtime and use the same component logic in it as if the original
 *   template was used as whenever the DOM is touched the renderer is
 *   consulted. It will also allow to build complex components with standard
 *   compisition (i.e. a select widget with several buttons or tabbed UI
 *   library etc).
 * @constructor
 * @extends {goog.ui.Component}
 */
pstj.ui.TemplatedComponent = function(opt_renderer) {
  goog.base(this);
  this.renderer_ = opt_renderer || pstj.ui.TemplateRenderer.getInstance();
};
goog.inherits(pstj.ui.TemplatedComponent, goog.ui.Component);

goog.scope(function() {

  var _ = pstj.ui.TemplatedComponent.prototype;

  /**
   * Getter for the renderer instance used.
   * @return {pstj.ui.TemplateRenderer}
   */
  _.getRenderer = function() {
    return this.renderer_;
  };

  /** @inheritDoc */
  _.createDom = function() {
    this.getRenderer().createDom(this.getModel()));
  };

  /** @inheritDoc */
  _.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.getRenderer().decorate(el);
  };

  /** @inheritDoc */
  _.disposeInternal = function() {
    goog.base(this, 'disposeInternal');
    this.renderer_ = null;
  };

  /** @inheritDoc */
  _.getContentElement = function() {
    return this.getRenderer().getContentElement(this.getElement());
  };

});

