goog.provide('pstj.ui.List');
goog.provide('pstj.ui.ListTemplate');

goog.require('pstj.ds.List');
goog.require('pstj.templates');
goog.require('pstj.ui.Async');
goog.require('pstj.ui.ListItem');
goog.require('pstj.ui.Template');

/**
 * The list template.
 * @constructor
 * @extends {pstj.ui.Template}
 */
pstj.ui.ListTemplate = function() {
  goog.base(this);
};
goog.inherits(pstj.ui.ListTemplate, pstj.ui.Template);
goog.addSingletonGetter(pstj.ui.ListTemplate);

/** @inheritDoc */
pstj.ui.ListTemplate.prototype.getTemplate = function(model) {
  return pstj.templates.list({});
};

/** @inheritDoc */
pstj.ui.ListTemplate.prototype.getContentElement = function(comp) {
  return comp.getEls(goog.getCssName('pstj-list-container'));
};


/**
 * My new class description
 * @constructor
 * @extends {pstj.ui.Async}
 * @param {pstj.ui.Template=} opt_template Optional template.
 * @param {pstj.ui.Template=} opt_item_template Optionaly tell the list item
 *   template instance to use.
 */
pstj.ui.List = function(opt_template, opt_item_template) {
  goog.base(this, opt_template || pstj.ui.ListTemplate.getInstance());
  /**
   * @private
   * @type {pstj.ui.Template}
   */
  this.listItemTemplate_ = opt_item_template || null;
  /**
   * The item that is currently selected.
   * @type {pstj.ui.ListItem}
   * @private
   */
  this.currentSelectedUIItem_ = null;
};
goog.inherits(pstj.ui.List, pstj.ui.Async);

/** @inheritDoc */
pstj.ui.List.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.listItemTemplate_ = null;
};

/**
 * Overrides the getter method from Component to let the compiler know the
 *   type of the model data.
 * @override
 * @return {pstj.ds.List} The list of items.
 */
pstj.ui.List.prototype.getModel;

/** @inheritDoc */
pstj.ui.List.prototype.setModel = function(model) {
  // expect an array and convert internally to list.
  if (!(model instanceof pstj.ds.List)) {
    if (!goog.isArray(model)) {
      throw new Error('Model for select widget should be ' +
        'either pstj.ds.List instance or an array or literal objects');
    }
    var list = new pstj.ds.List();
    goog.array.forEach(/** @type {Array} */ (model), function(item) {
      var listitem = new pstj.ds.ListItem(item);
      list.add(listitem);
    });
  } else {
    list = model;
  }
  goog.base(this, 'setModel', list);
  if (this.isInDocument()) {
    this.visualizeModel();
  }
};

/**
 * Visualize the items in the model as list items.
 * @protected
 */
pstj.ui.List.prototype.visualizeModel = function() {
  var model = /** @type {pstj.ds.List} */ (this.getModel());
  var count = model.getCount();
  for (var i = 0; i < count; i++) {
    this.createListItem(model.getByIndex(i));
  }
};

/**
 * Create a new list item in the view from a list item record data.
 * @param {pstj.ds.ListItem} listitem The data record to use.
 * @protected
 */
pstj.ui.List.prototype.createListItem = function(listitem) {
  var child = new pstj.ui.ListItem(this.listItemTemplate_);
  child.setModel(listitem);
  this.addChild(child, true);
};

/**
 * Returns the currently selected item's data model.
 * @return {pstj.ds.ListItem}
 */
pstj.ui.List.prototype.getSelectionData = function() {
  if (goog.isNull(this.currentSelectedUIItem_)) return null;
  return this.currentSelectedUIItem_.getModel();
};

/** @inheritDoc */
pstj.ui.List.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  if (goog.isDefAndNotNull(this.getModel())) {
    this.visualizeModel();
  }
  this.getHandler().listen(this, goog.ui.Component.EventType.HIGHLIGHT,
    this.handleItemHighlight);
};

/**
 * Handles the highlight of a list item.
 * @param {goog.events.Event} e The HIGHLIGHT event from component class.
 * @protected
 */
pstj.ui.List.prototype.handleItemHighlight = function(e) {
  var item = /** @type {pstj.ui.ListItem} */ (e.target);
  if (this.currentSelectedUIItem_ != item) {
    if (!goog.isNull(this.currentSelectedUIItem_)) {
      this.currentSelectedUIItem_.setActive(false);
    }
    if (item.isEnabled()) {
      this.currentSelectedUIItem_ = item;
      this.currentSelectedUIItem_.setActive(true);
    }
  }
};
