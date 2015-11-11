/**
 * @fileoverview Provides virtual page to be embedded in 'Pages' widget.
 *
 * A page can be selected (potentially animating the transition).
 *
 * Pages that are not currently selected are by default styles with
 * 'display:none' to make the layout tree smaller.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.app.Page');
goog.provide('pstj.app.PageRenderer');

goog.require('goog.array');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.app.UiControl');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.templates');


/** @extends {pstj.app.UiControl} */
pstj.app.Page = goog.defineClass(pstj.app.UiControl, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.app.UiControl.call(this, opt_content, opt_renderer, opt_domHelper);

    // Allow selected state, pages should be able to be selected.
    this.setSupportedState(goog.ui.Component.State.SELECTED, true);
  },

  /**
   * Intentionally dispose of the children, we are not going to use them again.
   * @override
   */
  removeChildren: function() {
    var children = goog.base(this, 'removeChildren');
    goog.array.forEach(children, function(component) {
      goog.dispose(component);
    });
    return children;
  }
});


/** @extends {pstj.material.ElementRenderer} */
pstj.app.PageRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return pstj.app.PageRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return pstj.templates.AppPage(model);
  },

  statics: {
    /**
     * @const {string}
     */
    CSS_CLASS: goog.getCssName('app-page')
  }
});
goog.addSingletonGetter(pstj.app.PageRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.app.Page,
    pstj.app.PageRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.app.PageRenderer.CSS_CLASS, function() {
      return new pstj.app.Page(null);
    });
