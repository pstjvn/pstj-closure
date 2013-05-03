goog.provide('pstj.ui.List');

goog.require('pstj.ui.Control');

/**
 * My new class description
 * @constructor
 * @extends {pstj.ui.Control}
 * @param {pstj.ui.ControlRenderer=} opt_renderer The renderer to use, it
 *   should understand templates.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *   document interaction.
 * @param {pstj.ui.Template=} opt_template The template instance creator to
 *   use to generate the DOM.
 */
pstj.ui.List = function(opt_renderer, opt_domHelper, opt_template) {
  goog.base(this, null, opt_renderer, opt_domHelper, opt_template)
};
goog.inherits(pstj.ui.List, pstj.ui.Control);

goog.scope(function() {

  var _ = pstj.ui.List.prototype;

});


pstj.ui.ListItem = function() {

}
