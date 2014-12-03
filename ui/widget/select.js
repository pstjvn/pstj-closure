goog.provide('pstj.widget.Select');
goog.provide('pstj.widget.SelectTemplate');

goog.require('goog.ui.Component.EventType');
goog.require('pstj.templates');
goog.require('pstj.ui.Button');
goog.require('pstj.ui.List');
goog.require('pstj.ui.Template');
goog.require('pstj.ui.Templated');



/**
 * The select widget template.
 * @constructor
 * @extends {pstj.ui.Template}
 */
pstj.widget.SelectTemplate = function() {
  goog.base(this);
};
goog.inherits(pstj.widget.SelectTemplate, pstj.ui.Template);
goog.addSingletonGetter(pstj.widget.SelectTemplate);


/** @inheritDoc */
pstj.widget.SelectTemplate.prototype.getTemplate = function(model) {
  return pstj.templates.select({});
};



/**
 * My new class description
 * @constructor
 * @extends {pstj.ui.Templated}
 * @param {pstj.ui.Template=} opt_template The template to use for select box.
 * @param {pstj.ui.Template=} opt_item_template The template to use for
 *   selection item.
 */
pstj.widget.Select = function(opt_template, opt_item_template) {
  goog.base(this, opt_template || pstj.widget.SelectTemplate.getInstance());
  this.list_ = new pstj.ui.List(undefined, opt_item_template);
  this.selectButton_ = new pstj.ui.Button();
  this.cancelButton_ = new pstj.ui.Button();
  this.addChild(this.list_);
  this.addChild(this.selectButton_);
  this.addChild(this.cancelButton_);
};
goog.inherits(pstj.widget.Select, pstj.ui.Templated);


/**
 * Sets the text to be shown when list is empty.
 * @param {string} str String.
 */
pstj.widget.Select.prototype.setEmptyListText = function(str) {
  this.list_.setEmptyListNotice(str);
};


/**
 * @override
 */
pstj.widget.Select.prototype.setModel = function(model) {
  this.list_.setModel(model);
};


/**
 * Retrtieves the currently selected data.
 * @return {pstj.ds.ListItem}
 */
pstj.widget.Select.prototype.getSelection = function() {
  return this.list_.getSelectionData();
};


/** @inheritDoc */
pstj.widget.Select.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  this.cancelButton_.decorate(this.querySelector('[data-action="cancel"]'));
  this.selectButton_.decorate(this.querySelector('[data-action="select"]'));
  this.list_.decorate(this.querySelector('.' + goog.getCssName('pstj-list')));
};


/** @inheritDoc */
pstj.widget.Select.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this, [
    goog.ui.Component.EventType.HIGHLIGHT,
    goog.ui.Component.EventType.SELECT,
    goog.ui.Component.EventType.ACTION], this.handleSubcomponentEvent);
  this.selectButton_.setEnabled(false);
};


/**
 * Handles for the events coming from the sub components.
 * @param {goog.events.Event} e The Component events.
 * @protected
 */
pstj.widget.Select.prototype.handleSubcomponentEvent = function(e) {
  switch (e.type) {
    case goog.ui.Component.EventType.HIGHLIGHT:
      e.stopPropagation();
      this.selectButton_.setEnabled(true);
      break;
    case goog.ui.Component.EventType.SELECT:
      // let it propagate!
      break;
    case goog.ui.Component.EventType.ACTION:
      if (e.target == this.cancelButton_) {
        this.dispatchEvent(goog.ui.Component.EventType.CLOSE);
      } else if (e.target == this.selectButton_) {
        e.stopPropagation();
        this.dispatchEvent(goog.ui.Component.EventType.SELECT);
      }
      break;
  }
};


/**
 * Set the filter to the list's model directly (helper method to access the
 *   model of the select).
 * @param {function(pstj.ds.ListItem): boolean=} opt_fn Function that accepts
 * each list item and returns true if the item should be removed (filtered out).
 */
pstj.widget.Select.prototype.setFilter = function(opt_fn) {
  if (goog.isDefAndNotNull(this.list_.getModel())) {
    this.selectButton_.setEnabled(false);
    this.list_.getModel().setFilter(opt_fn);
  }
};
