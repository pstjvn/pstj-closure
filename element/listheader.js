/**
 * @fileoverview General purpose list header that contains configurable
 * cells that should match the items in your table view.
 *
 * It could be bound to a model and thus allows directly sorting sortable
 * models. If you need you can also listen on the taps on list header cells and
 * sort your models via a controller.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.element.ListHeader');
goog.provide('pstj.element.ListHeaderRenderer');

goog.require('goog.events');
goog.require('goog.log');
goog.require('goog.ui.registry');
goog.require('pstj.element.ListHeaderCell');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.EventMap');
goog.require('pstj.templates');


goog.scope(function() {
var ER = pstj.material.ElementRenderer;
var element = pstj.element;


/** @extends {pstj.material.Element} */
pstj.element.ListHeader = goog.defineClass(pstj.material.Element, {
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
     * @type {number}
     * @private
     */
    this.index_ = -1;
    // Automatically bind to updating model changes and override - we will not
    // be using the template.
    this.setUseNGTemplateSyntax(true);
    // Automatically listen for tap events.
    this.setAutoEventsInternal(pstj.material.EventMap.EventFlag.TAP);
    // Disallow text selection.
    this.setAllowTextSelection(false);
  },

  /** @override */
  onTap: function(e) {
    goog.log.info(this.logger, 'Tap event detected from child');
    e.stopPropagation(e);
    var idx = this.indexOfChild(/** @type {!goog.ui.Component} */(e.target));
    goog.log.info(this.logger, 'Index of child: ' + idx);
    if (idx != -1) {
      if (this.dispatchEvent(
          pstj.element.ListHeader.EventType.SORT_REQUESTED)) {
        if (!goog.isNull(this.getModel())) {
          this.getModel().sort(idx);
        }
      }
    }
  },

  /** @override */
  handleModelChange: function(e) {
    if (this.isInDocument()) {
      if (!goog.isNull(this.getModel())) {
        this.setSorting(this.getModel().getKey(), this.getModel().getAsc());
      }
    }
  },

  /**
   * Reflects the currently applied sorting state on the list header UI.
   * @param {number} index The list header to select on.
   * @param {boolean} asc If the sorting is ascending or descending.
   */
  setSorting: function(index, asc) {
    if (index != this.index_) {
      if (this.index_ != -1) {
        this.getChildAt(this.index_).setSortingState(
            element.ListHeaderCell.SortState.NOT_SORTED);
      }
      this.index_ = index;
      if (this.index_ != -1) {
        this.getChildAt(this.index_).setSortingState(
            asc ?
                element.ListHeaderCell.SortState.SORTED_ASCENDING :
                element.ListHeaderCell.SortState.SORTED_DESCENDING);
      }
    }
  },

  /**
   * @override
   * @return {!pstj.element.ListHeaderCell}
   */
  getChildAt: function(index) {
    return goog.asserts.assertInstanceof(goog.base(this, 'getChildAt', index),
        pstj.element.ListHeaderCell);
  },

  /**
   * @protected
   * @type {goog.debug.Logger}
   */
  logger: goog.log.getLogger('pstj.element.ListHeader'),

  statics: {
    /**
     * The events this component will be abl to emit.
     * @enum {string}
     */
    EventType: {
      SORT_REQUESTED: goog.events.getUniqueId('sort-req')
    }
  }
});


/** @extends {pstj.material.ElementRenderer} */
pstj.element.ListHeaderRenderer = goog.defineClass(ER, {
  constructor: function() {
    ER.call(this);
  },

  /** @override */
  getCssClass: function() {
    return pstj.element.ListHeaderRenderer.CSS_CLASS;
  },

  /**
   * Returns listheader without any cells, you should always decorate this for
   * it to work or you should override the renderer.
   * @override
   */
  getTemplate: function(model) {
    return pstj.templates.ListHeader(model);
  },

  statics: {
    /** @const {string} */
    CSS_CLASS: goog.getCssName('list-header')
  }
});


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.element.ListHeader,
    pstj.element.ListHeaderRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.element.ListHeaderRenderer.CSS_CLASS, function() {
      return new pstj.element.ListHeader(null);
    });

});  // goog.scope

