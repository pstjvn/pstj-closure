/**
 * @fileoverview Simple error messge widget. It supports automatic hiding after
 * a configurable delay.
 *
 * NOTE: the component is designed to be used in templates and thus it is
 * configured based on the DOM attrobutes it finds. The automatic hiding and the
 * delay with automatic hiding cannot be configured imperatively. If you need
 * this feel free to submit a pull request.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.app.ErrorMsg');
goog.provide('pstj.app.ErrorMsgRenderer');

goog.require('goog.async.Delay');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.templates');

goog.scope(function() {
var E = pstj.material.Element;
var ER = pstj.material.ElementRenderer;


/** @extends {E} */
pstj.app.ErrorMsg = goog.defineClass(E, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    E.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * If the message should hide automatically after a period of time.
     * @type {boolean}
     * @private
     */
    this.autoHide_ = false;
    /**
     * The current message to show.
     * @type {!string}
     */
    this.message = '';
    /**
     * @type {goog.async.Delay}
     * @private
     */
    this.disableDelayed_ = null;

    this.setSupportedState(goog.ui.Component.State.DISABLED, true);
    this.setEnabled(false);
  },

  /**
   * Show a new error message.
   * @param {string} message
   */
  showMessage: function(message) {
    this.message = message;
    this.setContent(this.message);
    this.setEnabled(true);
    if (this.autoHide_) this.disableDelayed_.start();
  },

  /**
   * Hide the current message.
   */
  hideMessage: function() {
    this.setEnabled(false);
  },

  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    var delay = 5000;
    if (this.getElementStrict().hasAttribute('auto')) {
      this.autoHide_ = true;
    }
    if (this.getElementStrict().hasAttribute('delay')) {
      var userDelay = parseInt(this.getElementStrict().getAttribute('delay'),
          10);
      if (!isNaN(userDelay)) delay = userDelay;
    }
    this.disableDelayed_ = new goog.async.Delay(this.hideMessage, delay,
        this);
    this.registerDisposable(this.disableDelayed_);
  }
});


/** @extends {ER} */
pstj.app.ErrorMsgRenderer = goog.defineClass(ER, {
  constructor: function() {
    ER.call(this);
  },

  /** @override */
  getTemplate: function(model) {
    return pstj.templates.ErrorMsg(model);
  },

  /** @override */
  generateTemplateData: function(instance) {
    return null;
  },

  /** @override */
  getCssClass: function() {
    return pstj.app.ErrorMsgRenderer.CSS_CLASS;
  },

  statics: {
    /**
     * @type {string}
     * @final
     */
    CSS_CLASS: goog.getCssName('app-error-message')
  }
});

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.app.ErrorMsg,
    pstj.app.ErrorMsgRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.app.ErrorMsgRenderer.CSS_CLASS, function() {
      return new pstj.app.ErrorMsg(null);
    });

});  // goog.scope
