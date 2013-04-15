goog.provide('pstj.widget.Pager');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('pstj.ds.List');
goog.require('pstj.ds.ListItem');
goog.require('pstj.ng.Template');
goog.require('pstj.templates');
goog.require('pstj.ui.Templated');

/**
 * @fileoverview  Provides client side pagination of large data sets.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Pager is used on client side paging solutions, mainly in slow machines and
 *   stbs to avoid the overhead of dynamic lists.
 * @constructor
 * @extends {pstj.ui.Templated}
 */
pstj.widget.Pager = function() {
  goog.base(this);
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
   * The index of the currently active element. It is offsetted for the page!
   * @type {number}
   * @private
   */
  this.activePageIndex_ = 0;
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
  /**
   * The number of pages that are needed to visualize the whole list in regard
   *   of the current visible elements.
   * @type {number}
   * @private
   */
  this.pagesCount_ = 0;
};
goog.inherits(pstj.widget.Pager, pstj.ui.Templated);

// allows for shorter typeing and hides the private method from the docs.
goog.scope(function() {

  var _ = pstj.widget.Pager.prototype;

  /**
   * @override
   * @return {pstj.ds.List} The list that is set as model.
   */
  _.getModel;

  /** @inheritDoc */
  _.getTemplate = function() {
    return pstj.templates.pager({});
  };

  /** @inheritDoc */
  _.setModel = function(model) {
    goog.asserts.assertInstanceof(model, pstj.ds.List,
      'Should be a list data structure');
    goog.base(this, 'setModel', model);
    if (this.isInDocument()) {
      this.updatePagesNumber_();
      this.initState_();
    }
  };

  /** @inheritDoc */
  _.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    // find all instances and apply them as templates.
    var items = goog.dom.getElementsByClass(goog.getCssName('pstj-pager-item'));
    goog.array.forEach(items, function(el) {
      var template = new pstj.ng.Template();
      this.addChild(template);
      this.items_.push(template);
      template.decorate(el);
    }, this);
    this.pageEl_ = this.getEls(goog.getCssName('pstj-pager-page'));
    this.pagesEl_ = this.getEls(goog.getCssName('pstj-pager-pages'));
  };

  /** @inheritDoc */
  _.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.updatePagesNumber_();
    if (goog.isDefAndNotNull(this.getModel())) {
      this.initState_();
    } else {
      this.pageEl_.innerHTML = this.page_.toString();
    }
  };
  /**
   * Sets the pager to the first page and the first item in the page.
   * @private
   */
  _.initState_ = function() {
    this.loadPage(1);
    this.activePageIndex_ = 0;
    goog.dom.classlist.add(this.items_[0].getElement(),
      goog.getCssName('active'));
  };

  /**
   * Selects the next item in the pager.
   */
  _.selectNext = function() {
    var next_record = this.getModel().getNext();
    if (goog.isNull(next_record)) return;
    // at this stage we know that the item is available as data record, now we
    // need to figure out how to show it in the pager.
    goog.dom.classlist.remove(this.items_[this.activePageIndex_].getElement(),
      goog.getCssName('active'));
    this.activePageIndex_++;
    if (this.activePageIndex_ >= this.items_.length) {
      this.activePageIndex_ = 0;
      this.loadPage(this.page_ + 1);
    }
    this.getModel().setCurrent(next_record);
    goog.dom.classlist.add(this.items_[this.activePageIndex_].getElement(),
      goog.getCssName('active'));
  };

  /**
   * Selects the previous item in the pager.
   */
  _.selectPrevious = function() {
    var item = this.getModel().getPrevious();
    if (goog.isNull(item)) return;
    goog.dom.classlist.remove(this.items_[this.activePageIndex_].getElement(),
      goog.getCssName('active'));
    this.activePageIndex_--;
    if (this.activePageIndex_ < 0) {
      this.loadPage(this.page_ - 1);
      this.activePageIndex_ = this.items_.length - 1;
    }
    this.getModel().setCurrent(item);
    goog.dom.classlist.add(this.items_[this.activePageIndex_].getElement(),
      goog.getCssName('active'));
  };

  /**
   * Loads the next page if one is available.
   */
  _.selectNextPage = function() {
    if (this.loadPage(this.page_ + 1)) {

      var ci = this.getModel().getCurrentIndex();
      if (ci + this.items_.length > (this.getModel().getCount() - 1)) {
        goog.dom.classlist.remove(
          this.items_[this.activePageIndex_].getElement(),
          goog.getCssName('active'));

        this.getModel().setCurrent(goog.asserts.assertInstanceof(
          this.getModel().getByIndex(
          this.getModel().getCount() - 1), pstj.ds.ListItem,
          'This code should be removed by the compiler.'));

        this.activePageIndex_ = this.activePageIndex_ - (
          (ci + this.items_.length) - (this.getModel().getCount() - 1));

        goog.dom.classlist.add(this.items_[this.activePageIndex_].getElement(),
          goog.getCssName('active'));
      } else {
        this.getModel().setCurrent(goog.asserts.assertInstanceof(
          this.getModel().getByIndex(ci + this.items_.length),
          pstj.ds.ListItem, 'This code should have been removed'));
      }
    }
  };

  /**
   * Loads the previous page if one is avilable.
   */
  _.selectPreviousPage = function() {
    if (this.loadPage(this.page_ - 1)) {
      this.getModel().setCurrent(goog.asserts.assertInstanceof(
        this.getModel().getByIndex(
        this.getModel().getCurrentIndex() - this.items_.length),
        pstj.ds.ListItem, 'Again - remove this code!'));
    }
  };

  /**
   * Updates the number of pages matching the current combination of page
   *   items and data items.
   * @private
   */
  _.updatePagesNumber_ = function() {
    if (goog.isDefAndNotNull(this.getModel())) {
      this.pagesCount_ = Math.ceil(this.getModel().getCount() /
        this.items_.length);
    }
    this.pagesEl_.innerHTML = this.pagesCount_.toString();
  };

  /**
   * Sets the appropriate data to the template.
   * @param {pstj.ng.Template} template The template instance.
   * @param {number} index The index of that template on the pager.
   * @protected
   */
  _.setTemplateData = function(template, index) {
    var offset = (this.page_ - 1) * this.items_.length;
    template.setModel(this.getModel().getByIndex(offset + index));
  };

  /**
   * Checks if the index is a valid page index in the context of the data
   *   loaded in the component.
   * @param {number} number The page index to use.
   * @return {boolean} True if the index is valid, false otherwise.
   * @protected
   */
  _.isValidPageIndex = function(number) {
    if (number < 1 || number > this.pagesCount_) {
      return false;
    }
    return true;
  };

  /**
   * Loads a page into the pager's view.
   * @param {number} pageIndex The page to load.
   * @protected
   * @return {boolean} True if the page was loded, fale otherwise.
   */
  _.loadPage = function(pageIndex) {
    if (this.isValidPageIndex(pageIndex)) {
      this.page_ = pageIndex;
      goog.array.forEach(this.items_, this.setTemplateData, this);
      this.pageEl_.innerHTML = this.page_.toString();
      return true;
    }
    return false;
  };

  /** @inheritDoc */
  _.disposeInternal = function() {
    goog.array.forEach(this.items_, function(template) {
      goog.dispose(template);
    });
    this.pageEl_ = null;
    this.pagesEl_ = null;
    this.items_ = null;
  };
});
