goog.provide('pstj.ui.TemplatedComponent');

goog.require('goog.ui.Component');

/**
 * My new class description
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

  _.getRenderer = function() {
    return this.renderer_;
  };

  _.createDom = function() {
    this.getRenderer().createDom(this.getModel()));
  };

  _.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.getRenderer().decorate(el);
  };

});

