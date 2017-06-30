goog.provide('pstj.ui.List');
goog.provide('pstj.ui.ListTemplate');

goog.require('pstj.ds.List');
goog.require('pstj.ds.ListItem');
goog.require('pstj.templates');
goog.require('pstj.ui.Async');
goog.require('pstj.ui.ListItem');
goog.require('pstj.ui.Template');
goog.require('pstj.ui.Touchable');



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
  return pstj.templates.list({}).toString();
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
  /**
   * Cache Y coordinates of the touch / move events. When we want to simulate
   *   scroll in touch environment the children eat up the touch / move events
   *   and thus the scroll is not happenings, this is why we need to cache the
   *   Y coordinates of the children events and simulate scrolling if
   *   applicable. The native scroll bar is assumed.
   * @type {Array.<number>}
   * @private
   */
  this.yoffset_ = [0, 0];
  /**
   * Message to show in the list body if all the items are filtered.
   * @type {string}
   * @private
   */
  this.emptyListNotice_ = '';
  /**
   * The notice ready element.
   * @type {Element}
   * @private
   */
  this.noticeElement_ = null;
};
goog.inherits(pstj.ui.List, pstj.ui.Async);


/** @inheritDoc */
pstj.ui.List.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.listItemTemplate_ = null;
  this.noticeElement_ = null;
};


/**
 * Overrides the getter method from Component to let the compiler know the
 *   type of the model data.
 * @override
 * @return {pstj.ds.List} The list of items.
 */
pstj.ui.List.prototype.getModel;


/**
 * Sets the notice to be showing if no items are left after the list after
 *   filtering.
 * @param {string} notice The notice.
 */
pstj.ui.List.prototype.setEmptyListNotice = function(notice) {
  this.emptyListNotice_ = notice;
};


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
  if (goog.isDefAndNotNull(this.getModel())) {
    this.getHandler().unlisten(this.getModel(), [
      pstj.ds.List.EventType.ADD,
      pstj.ds.List.EventType.DELETE,
      pstj.ds.List.EventType.FILTERED
    ], this.handleModelChange);
  }

  goog.base(this, 'setModel', list);

  this.getHandler().listen(this.getModel(), [
    pstj.ds.List.EventType.ADD,
    pstj.ds.List.EventType.DELETE,
    pstj.ds.List.EventType.FILTERED
  ], this.handleModelChange);

  if (this.isInDocument()) {
    this.visualizeModel();
  }
};


/**
 * Handler for the events from the currently applied model. By default we
 *   handle only the FILTERED event and we simply set the child's state to
 *   disabled if it is filtered out.
 * @param {pstj.ds.List.Event|goog.events.Event} e The event from the list. It
 *   could be a complex (ADD) event ot a regular event with type only.
 * @protected
 */
pstj.ui.List.prototype.handleModelChange = function(e) {
  this.noticeElement_.innerHTML = '';

  if (e.type == pstj.ds.List.EventType.FILTERED) {
    // If filtering is performed remove reference to the currently selected
    // item.
    if (!goog.isNull(this.currentSelectedUIItem_)) {
      this.currentSelectedUIItem_.setActive(false);
      this.currentSelectedUIItem_ = null;
    }
    var ids = this.getModel().getFilteredIndexes();
    this.forEachChild(function(child, index) {
      if (goog.array.contains(ids, index)) {
        child.setEnabled(false);
      } else {
        child.setEnabled(true);
      }
    });
    // no items left in the list.
    if (this.getModel().getCount() > 0 &&
        ids.length == this.getModel().getCount()) {
      this.noticeElement_.innerHTML = this.emptyListNotice_;
    }
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
pstj.ui.List.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  this.noticeElement_ = this.getEls(goog.getCssName(
      'pstj-list-notice'));
};


/** @inheritDoc */
pstj.ui.List.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  if (goog.isDefAndNotNull(this.getModel())) {
    this.visualizeModel();
  }
  this.getHandler().listen(
      this, goog.ui.Component.EventType.HIGHLIGHT, this.handleItemHighlight)
      .listen(this,
          [pstj.ui.Touchable.EventType.MOVE,
            pstj.ui.Touchable.EventType.PRESS],
          this.handleMoveByChild);
};


/**
 * Handles move events in children of the list so that we can emulate the
 *   scroll events in the list when we have touch only (becasue the touches
 *   are stopped always in touchable components we need to intercept the move
 *   event abstraction and scroll from javascript.).
 * @param {pstj.ui.Touchable.Event} e The touch event abstraction from
 *   Touchable components.
 * @protected
 */
pstj.ui.List.prototype.handleMoveByChild = function(e) {
  if (e.type == pstj.ui.Touchable.EventType.PRESS) {
    this.yoffset_[0] = e.y;
  } else {
    this.yoffset_[1] = e.y;
    this.update();
  }
};


/** @inheritDoc */
pstj.ui.List.prototype.draw = function(ts) {
  if (this.yoffset_[0] - this.yoffset_[1]) {
    this.getElement().scrollTop = this.getElement().scrollTop + (
        this.yoffset_[0] - this.yoffset_[1]);
    this.yoffset_[0] = this.yoffset_[1];
  }
  return goog.base(this, 'draw', ts);
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
