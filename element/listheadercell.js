/**
 * @fileoverview Implementation for simple header cell. It only has a label
 * and an arrow icon that indicates a 'sorted' state.
 *
 * Note that the developer is free to indicate any state and the actual logic
 * should be implemented elsewhere.
 *
 * The component reacts to pointer agent by default so a parent component is
 * expected to listen for the needed pointer events (tap, for example).
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.element.ListHeaderCell');
goog.provide('pstj.element.ListHeaderCellRenderer');

goog.require('goog.asserts');
goog.require('goog.log');
goog.require('goog.ui.registry');
/** @suppress {extraRequire} */
goog.require('pstj.autogen.iconrenderer.ArrowDropDown');
/** @suppress {extraRequire} */
goog.require('pstj.autogen.iconrenderer.ArrowDropUp');
goog.require('pstj.autogen.icons.names');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.IconContainer');
goog.require('pstj.templates');


goog.scope(function() {
var element = pstj.element;
var material = pstj.material;
var inames = pstj.autogen.icons.names;


/** @extends {material.Element} */
element.ListHeaderCell = goog.defineClass(material.Element, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    material.Element.call(this, opt_content, opt_renderer, opt_domHelper);
    this.setUsePointerAgent(true);
  },

  /**
   * Updates the sorting view state based on predefined states.
   * @param {element.ListHeaderCell.SortState} state
   */
  setSortingState: function(state) {
    var icon = inames.NONE;
    switch (state) {
      case element.ListHeaderCell.SortState.SORTED_ASCENDING:
        icon = inames.ARROW_DROP_DOWN;
        break;
      case element.ListHeaderCell.SortState.SORTED_DESCENDING:
        icon = inames.ARROW_DROP_UP;
        break;
    }
    goog.log.info(this.logger, 'switching to icon: ' + icon);
    this.getRenderer().setIcon(this, icon);
  },

  /**
   * @override
   * @return {!element.ListHeaderCellRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
                                         element.ListHeaderCellRenderer);
  },

  /**
   * @type {goog.debug.Logger}
   * @protected
   */
  logger: goog.log.getLogger('pstj.element.ListHeaderCell'),

  statics: {
    /**
     * Provides the sort states.
     * @enum {number}
     */
    SortState: {NOT_SORTED: 0, SORTED_ASCENDING: 1, SORTED_DESCENDING: -1}
  }
});


/** @extends {material.ElementRenderer} */
element.ListHeaderCellRenderer = goog.defineClass(material.ElementRenderer, {
  constructor: function() { material.ElementRenderer.call(this); },

  /** @override */
  getCssClass: function() { return element.ListHeaderCellRenderer.CSS_CLASS; },

  /** @override */
  getTemplate: function(model) { return pstj.templates.ListHeaderCell(model); },

  /**
   * Sets the icon to match the sort state directed from outside.
   * @param {element.ListHeaderCell} instance
   * @param {pstj.autogen.icons.names} icon
   */
  setIcon: function(instance, icon) {
    goog.asserts.assertInstanceof(instance.getChildAt(0),
                                  material.IconContainer)
        .setIcon(icon);
  },

  statics: {
    /** @const {string} */
    CSS_CLASS: goog.getCssName('list-header-cell')
  }
});


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.element.ListHeaderCell,
                                    pstj.element.ListHeaderCellRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.element.ListHeaderCellRenderer.CSS_CLASS,
    function() { return new pstj.element.ListHeaderCell(null); });

});  // goog.scope
