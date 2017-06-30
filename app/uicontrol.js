/**
 * @fileoverview Provides UI component that is easily bound to a control
 * instance. This is useful if the component needs to communicate back
 * to the controller layer.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.app.UiControl');

goog.require('goog.asserts');
goog.require('pstj.control.Control');
goog.require('pstj.material.Element');


/** @extends {pstj.material.Element} */
pstj.app.UiControl = goog.defineClass(pstj.material.Element, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.material.Element.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * Control instance that might be invoked in order to communicate global
     * scope changes and signals.
     *
     * @private
     * @type {pstj.control.Control}
     */
    this.control_ = null;
  },

  /**
   * Accessor for the controller instance for the component. If one does not
   * yes exists it will be created.
   *
   * The controller is considered potected and should be accessed only inside
   * the component itself and its subclasses.
   *
   * @return {!pstj.control.Control}
   * @protected
   */
  getController: function() {
    if (goog.isNull(this.control_)) {
      this.control_ = new pstj.control.Control(this);
      this.control_.init();
      this.registerDisposable(this.control_);
    }
    return goog.asserts.assertInstanceof(this.control_, pstj.control.Control);
  }
});
