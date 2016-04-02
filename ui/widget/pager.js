/**
 * @fileoverview  Provides client side pagination of large data sets.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.widget.Pager');
goog.provide('pstj.widget.PagerTemplate');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('pstj.ds.List');
/** @suppress {extraRequire} */
goog.require('pstj.ds.ListItem');
goog.require('pstj.ng.Template');
goog.require('pstj.templates');
goog.require('pstj.ui.Template');
goog.require('pstj.ui.Templated');



/**
 * Template for the pager UI.
 * @constructor
 * @extends {pstj.ui.Template}
 */
pstj.widget.PagerTemplate = function() {
  goog.base(this);
};
goog.inherits(pstj.widget.PagerTemplate, pstj.ui.Template);
goog.addSingletonGetter(pstj.widget.PagerTemplate);


/** @inheritDoc */
pstj.widget.PagerTemplate.prototype.getTemplate = function(model) {
  return pstj.templates.pager(model);
};


/** @inheritDoc */
pstj.widget.PagerTemplate.prototype.generateTemplateData = function(comp) {
  return {
    itemsCount: comp.getNumberOfItemsRequired()
  };
};



/**
 * Pager is used on client side paging solutions, mainly in slow machines and
 *   stbs to avoid the overhead of dynamic lists.
 * @constructor
 * @extends {pstj.ui.Templated}
 * @param {number=} opt_items_per_page The number of items to use on one page.
 *   This will be enforced only for rendered instances, decorated instances
 *   use as much items as there are available in the template.
 * @param {pstj.ui.Template=} opt_template The optional template to use for DOM
 *   construction.
 */
pstj.widget.Pager = function(opt_items_per_page, opt_template) {
  goog.base(this, opt_template || pstj.widget.PagerTemplate.getInstance());
  /**
   * The items oer page to construct when creating the dom from scratch.
   * @type {number}
   * @private
   */
  this.itemsPerPage_ = opt_items_per_page || 1;
  /**
   * @private
   * @type {Array.<pstj.ng.Template>}
   */
  this.items_ = [];
  /**
   * @private
   * @type {number}
   */
  this.page_ = 0;
  /**
   * @private
   * @type {Element}
   */
  this.pageEl_ = null;
  /**
   * @private
   * @type {Element}
   */
  this.pagesEl_ = null;
};
goog.inherits(pstj.widget.Pager, pstj.ui.Templated);


/**
 * @override
 * @return {pstj.ds.List} The list that is set as model.
 */
pstj.widget.Pager.prototype.getModel;


/**
 * The number of items per page to use getter.
 * @return {number}
 */
pstj.widget.Pager.prototype.getNumberOfItemsRequired = function() {
  return this.itemsPerPage_;
};


/** @inheritDoc */
pstj.widget.Pager.prototype.setModel = function(model) {
  goog.asserts.assertInstanceof(model, pstj.ds.List,
      'Should be a list data structure');

  this.bindModel(model);
  goog.base(this, 'setModel', model);

  if (this.isInDocument()) {
    this.updatePagesNumber_();
    this.handleSelectionChange(null);
  }
};


/**
 * Bind handler to the selection change in current model.
 * @param {pstj.ds.List} model The model to bind to.
 * @protected
 */
pstj.widget.Pager.prototype.bindModel = function(model) {
  if (!goog.isNull(this.getModel())) {
    this.getHandler().unlisten(this.getModel(), pstj.ds.List.EventType.SELECTED,
        this.handleSelectionChange);
  }
  this.getHandler().listen(model, pstj.ds.List.EventType.SELECTED,
      this.handleSelectionChange);
};


/** @inheritDoc */
pstj.widget.Pager.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);

  var items = goog.dom.getElementsByClass(goog.getCssName('pstj-pager-item'));

  this.itemsPerPage_ = items.length;

  goog.array.forEach(items, function(el) {
    var template = new pstj.ng.Template();
    this.addChild(template);
    this.items_.push(template);
    template.decorate(el);
    this.registerDisposable(template);
  }, this);

  this.pageEl_ = this.getEls(goog.getCssName('pstj-pager-page'));
  this.pagesEl_ = this.getEls(goog.getCssName('pstj-pager-pages'));
};


/** @inheritDoc */
pstj.widget.Pager.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.updatePagesNumber_();
  if (goog.isDefAndNotNull(this.getModel())) {
    this.handleSelectionChange(null);
  } else {
    this.pageEl_.innerHTML = this.page_.toString();
  }
};


/**
 * Handles the change of selection item in the underlying model.
 * @param {goog.events.Event} e The SELECTED type event from list model.
 * @protected
 */
pstj.widget.Pager.prototype.handleSelectionChange = function(e) {

  // Remove the highlight from the current item.
  var item = this.getElementByClass(goog.getCssName('active'));
  var index = 0;
  if (!goog.isNull(item)) {
    goog.dom.classlist.remove(item, goog.getCssName('active'));
  }

  // find the new active index.
  if (this.getModel().getCount() == 0) {
    this.loadPage(0);
  } else {
    index = this.getModel().getCurrentIndex();
    this.loadPage(Math.floor(index / this.itemsPerPage_) + 1);
  }
  // Add highlight for current item.
  goog.dom.classlist.add(this.items_[index % this.itemsPerPage_].getElement(),
      goog.getCssName('active'));
};


/**
 * Updates the number of pages matching the current combination of page
 *   items and data items.
 * @private
 */
pstj.widget.Pager.prototype.updatePagesNumber_ = function() {
  var pagesCount = 0;
  if (goog.isDefAndNotNull(this.getModel())) {
    pagesCount = Math.ceil(this.getModel().getCount() / this.itemsPerPage_);
  }
  this.pagesEl_.innerHTML = pagesCount.toString();
};


/**
 * Sets the appropriate data to the template.
 * @param {pstj.ng.Template} template The template instance.
 * @param {number} index The index of that template on the pager.
 * @protected
 */
pstj.widget.Pager.prototype.setTemplateData = function(template, index) {
  var offset = (this.page_ - 1) * this.items_.length;
  template.setModel(this.getModel().getByIndex(offset + index));
};


/**
 * Loads a page into the pager's view.
 * @param {number} pageIndex The page to load.
 * @protected
 * @return {boolean} True if the page was loded, fale otherwise.
 */
pstj.widget.Pager.prototype.loadPage = function(pageIndex) {
  if (pageIndex != this.page_) {
    this.page_ = pageIndex;
    goog.array.forEach(this.items_, this.setTemplateData, this);
    this.pageEl_.innerHTML = this.page_.toString();
    return true;
  }
  return false;
};


/** @inheritDoc */
pstj.widget.Pager.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.pageEl_ = null;
  this.pagesEl_ = null;
  this.items_ = null;
};
