goog.provide('pstj.material.IconButton');
goog.provide('pstj.material.IconButtonRenderer');

goog.require('goog.ui.registry');
goog.require('pstj.material.Button');
goog.require('pstj.material.ButtonRenderer');


/** @extends {pstj.material.Button} */
pstj.material.IconButton = goog.defineClass(pstj.material.Button, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.material.Button.call(this, opt_content, opt_renderer, opt_domHelper);
  }
});


/** @extends {pstj.material.ButtonRenderer} */
pstj.material.IconButtonRenderer = goog.defineClass(
    pstj.material.ButtonRenderer, {
      constructor: function() {
        pstj.material.ButtonRenderer.call(this);
        /**
         * @override
         */
        this.childrenNames = goog.object.create(
            pstj.material.Button.Children.ICON, 0,
            pstj.material.Button.Children.LABEL, -1,
            pstj.material.Button.Children.RIPPLE, -1,
            pstj.material.Button.Children.SHADOW, -1);
      },

      /** @override */
      getCssClass: function() {
        return pstj.material.IconButtonRenderer.CSS_CLASS;
      },

      /** @override */
      getTemplate: function(model) {
        return pstj.material.template.IconButton(model);
      },

      statics: {
        /**
         * @final
         * @type {string}
         */
        CSS_CLASS: goog.getCssName('material-icon-button')
      }
    });
goog.addSingletonGetter(pstj.material.IconButtonRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.IconButton,
    pstj.material.IconButtonRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.IconButtonRenderer.CSS_CLASS, function() {
      return new pstj.material.IconButton(null);
    });
