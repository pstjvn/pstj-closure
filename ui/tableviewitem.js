goog.provide('pstj.ui.TableViewItem');
goog.provide('pstj.ui.TableViewItemRenderer');

goog.require('pstj.templates');
goog.require('pstj.ui.ControlRenderer');
goog.require('pstj.ui.ngAgent');



/**
 * Provides the default renderer for the table view item (cell).
 * Note that the renderer should be provided as to understands the data
 * structire that will be used as model.
 *
 * @constructor
 * @extends {pstj.ui.ControlRenderer}
 */
pstj.ui.TableViewItemRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.ui.TableViewItemRenderer, pstj.ui.ControlRenderer);
goog.addSingletonGetter(pstj.ui.TableViewItemRenderer);


/**
 * @type {string}
 * @final
 */
pstj.ui.TableViewItemRenderer.CSS_CLASS = goog.getCssName('tableviewitem');


/** @inheritDoc */
pstj.ui.TableViewItemRenderer.prototype.getTemplate = function(component) {
  return pstj.templates.TableViewItem({});
};


/** @inheritDoc */
pstj.ui.TableViewItemRenderer.prototype.getCssClass = function() {
  return pstj.ui.TableViewItemRenderer.CSS_CLASS;
};



/**
 * @constructor
 * @extends {goog.ui.Control}
 * @param {pstj.ui.ControlRenderer=} opt_renderer Optional alternative renderer
 * to use to render the instance.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 * document interaction.
 */
pstj.ui.TableViewItem = function(opt_renderer, opt_domHelper) {
  goog.base(this, '',
      opt_renderer || pstj.ui.TableViewItemRenderer.getInstance(),
      opt_domHelper);
  // disable handling of events - we are going to deal with this from the
  // TableView instance.
  // this.setHandleMouseEvents(false);
};
goog.inherits(pstj.ui.TableViewItem, goog.ui.Control);


/** @inheritDoc */
pstj.ui.TableViewItem.prototype.setModel = function(model) {
  goog.base(this, 'setModel', model);
  pstj.ui.ngAgent.getInstance().apply(this);
};
