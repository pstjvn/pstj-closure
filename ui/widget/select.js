goog.provide('pstj.widget.Select');
goog.provide('pstj.widget.SelectionItem');

goog.require('goog.array');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.CustomButton');
goog.require('pstj.configure');
goog.require('pstj.ds.List');
goog.require('pstj.ds.ListItem');
goog.require('pstj.graphics.Smooth');
goog.require('pstj.select');
goog.require('pstj.ui.CustomButtonRenderer');
goog.require('pstj.ui.Templated');

/**
 * @fileoverview Provides a widget to perform a selection of a single item.
 *   The design is comparable to the OSX selection dialog.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Provides a reusable select-like widget that has the feel of OSX select
 *   panel. The widget exposes runtime configuration option
 *
 * PSTJ.WIDGET.SELECT.DEFAULT_IMAGE (string) => assets/default-select-image.png
 *
 * @constructor
 * @extends {pstj.ui.Templated}
 */
pstj.widget.Select = function() {
  goog.base(this);
  this.smooth = new pstj.graphics.Smooth(this.draw, this);
  this.selectButton = new goog.ui.CustomButton('',
    pstj.ui.CustomButtonRenderer.getInstance());
  this.cancelButton = new goog.ui.CustomButton('',
    pstj.ui.CustomButtonRenderer.getInstance());
  this.addChild(this.cancelButton);
  this.addChild(this.selectButton);

  /**
   * @private
   * @type {boolean}
   */
  this.opened_ = false;

  /**
   * @private
   * @type {pstj.widget.SelectionItem}
   */
  this.currentlySelected_ = null;

  /**
   * @private
   * @type {boolean}
   */
  this.selectButtonDisabled_ = true;
};
goog.inherits(pstj.widget.Select, pstj.ui.Templated);

/**
 * Overrides the getter method from Component to let the compiler know the
 *   type of the model data.
 * @override
 * @return {pstj.ds.List} The list of items.
 */
pstj.widget.Select.prototype.getModel;

/** @inheritDoc */
pstj.widget.Select.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  goog.dispose(this.smooth);
  goog.dispose(this.selectButton);
  goog.dispose(this.cancelButton);
  this.currentlySelected_ = null;
};

/**
 * Overrides the method to check if the provided data is indeed a list. The
 *   list will be transformed to the pstj.ds.List data structure
 *   automatically. The expected format is array of objects really.
 * @override
 */
pstj.widget.Select.prototype.setModel = function(model) {
  // expect an array and convert internally to list.
  if (!goog.isArray(model)) {
    throw new Error('The model should be an array of objects');
  }
  var list = new pstj.ds.List();
  goog.array.forEach(/** @type {Array} */ (model), function(item) {
    var listitem = new pstj.ds.ListItem(item);
    list.add(listitem);
  });
  goog.base(this, 'setModel', list);
  this.visualizeModel();
};

/**
 * Toggles the state of the selection view.
 */
pstj.widget.Select.prototype.toggle = function() {
  this.opened_ = !this.opened_;
  this.update();
};

/**
 * Close the view.
 */
pstj.widget.Select.prototype.close = function() {
  this.setState(false);
};

/**
 * Opens the view.
 */
pstj.widget.Select.prototype.open = function() {
  this.setState(true);
};

/**
 * Signal the internal state needs update on screen.
 */
pstj.widget.Select.prototype.update = function() {
  this.smooth.update();
};

/**
 * Returns the selected data record id.
 * @return {pstj.ds.ListItem} The ID of the selected record or null if
 *   record is not currently selected.
 */
pstj.widget.Select.prototype.getSelection = function() {
  if (goog.isNull(this.currentlySelected_)) return null;
  return this.currentlySelected_.getModel();
};

/** @inheritDoc */
pstj.widget.Select.prototype.getTemplate = function() {
  return pstj.select.Select({});
};

/**
 * Protected method that assures creation of selection items can be
 *   overridden by subclasses.
 * @param {pstj.ds.ListItem} model The model for the new selection item.
 * @protected
 */
pstj.widget.Select.prototype.createSelectionItem = function(model) {
  var child = new pstj.widget.SelectionItem();
  child.setModel(model);
  this.addChild(child, true);
};

/**
 * Visualizes the selection items (i.e. ads them to the view).
 * @protected.
 */
pstj.widget.Select.prototype.visualizeModel = function() {
  var model = /** @type {pstj.ds.List} */ (this.getModel());
  var count = model.getCount();
  for (var i = 0; i < count; i++) {
    this.createSelectionItem(model.getByIndex(i));
  }
};

/** @inheritDoc */
pstj.widget.Select.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  this.selectButton.decorate(this.getEls(goog.getCssName(
    'pstj-action-select')));
  this.cancelButton.decorate(this.getEls(goog.getCssName(
    'pstj-action-cancel')));
};

/** @inheritDoc */
pstj.widget.Select.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this, goog.ui.Component.EventType.HIGHLIGHT,
    this.handleHighlight);

  this.getHandler().listen(this, goog.ui.Component.EventType.SELECT,
    this.handleSelect);

  this.getHandler().listen(this.cancelButton,
    goog.ui.Component.EventType.ACTION, this.handleCancel);

  this.getHandler().listen(this.selectButton,
    goog.ui.Component.EventType.ACTION, this.handleSelect);

  this.selectButton.setEnabled(false);
};

/**
 * Handles the highlight of an item in the list.
 * @param {goog.events.Event} e The highlight event.
 * @protected
 */
pstj.widget.Select.prototype.handleHighlight = function(e) {
  var comp = /** @type {pstj.widget.SelectionItem} */ (e.target);
  if (this.selectButtonDisabled_) {
    this.selectButtonDisabled_ = false;
    this.selectButton.setEnabled(true);
  }
  if (this.currentlySelected_ != comp) {
    if (!goog.isNull(this.currentlySelected_)) {
      this.currentlySelected_.setActiveState(false);
    }
    this.currentlySelected_ = comp;
    this.currentlySelected_.setActiveState(true);
  }
};

/**
 * Handles the selection when coming from double click of a child.
 * @param {goog.events.Event} e The SELECT event from a child.
 * @protected
 */
pstj.widget.Select.prototype.handleSelect = function(e) {
  // We assume we already know the active component so we will simply invoke
  // the action event here.
  e.stopPropagation();
  this.close();
  this.dispatchEvent(goog.ui.Component.EventType.ACTION);
};

/**
 * Handles the cancel button action.
 * @param {goog.events.Event} e The ACTION event from the button.
 * @protected
 */
pstj.widget.Select.prototype.handleCancel = function(e) {
  e.stopPropagation();
  this.close();
};

/** @inheritDoc */
pstj.widget.Select.prototype.getContentElement = function() {
  return this.getEls(goog.getCssName('pstj-select-body'));
};

/**
 * Sets the visibility state
 * @param {boolean} open If true the selection menu is shown.
 * @protected
 */
pstj.widget.Select.prototype.setState = function(open) {
  if (this.opened_ != open) {
    this.opened_ = open;
    this.update();
  }
};

/**
 * Draws the update on screen.
 * @param {number} ts The TS as per the RAF.
 * @return {boolean} True if any more updates are needed.
 * @protected
 */
pstj.widget.Select.prototype.draw = function(ts) {
  if (this.opened_) {
    goog.dom.classlist.add(this.getElement(), goog.getCssName(
      'pstj-select-active'));

  } else {
    goog.dom.classlist.remove(this.getElement(), goog.getCssName(
      'pstj-select-active'));
  }
  return false;
};

/**
 * Provides a basic selection item for the selection widget. It has only a
 *   thumbnail and name.
 * @constructor
 * @extends {pstj.ui.Templated}
 */
pstj.widget.SelectionItem = function() {
  goog.base(this);
};
goog.inherits(pstj.widget.SelectionItem, pstj.ui.Templated);

/**
 * The default thumbnail to use for selection item in select widget.
 * @type {string}
 * @protected
 */
pstj.widget.SelectionItem.defaultThumbnail = pstj.configure.getRuntimeValue(
  'DEFAULT_IMAGE', 'assets/default-select-image.png',
  'PSTJ.WIDGET.SELECT').toString();

/**
 * Easier to spot naming convention.
 * @type {string}
 */
pstj.widget.SelectionItem.prototype.thumnailPropertyName = 'thumbnail';

/**
 * Easier to spot naming convention.
 * @type {string}
 */
pstj.widget.SelectionItem.prototype.namePropertyname = 'name';

/**
 * The last time stamp a click was registered.
 * @type {number}
 * @private
 */
pstj.widget.SelectionItem.prototype.lastTs_ = 0;


/**
 * Overrides the return pattern, we actually return a list item.
 * @override
 * @return {pstj.ds.ListItem} The data record constituting the item.
 */
pstj.widget.SelectionItem.prototype.getModel;

/**
 * This method is designed to be called by the collection handler instance
 *   and not internally, as internally we only dispatch the events.
 * @param {boolean} active True if the element should be marked as active.
 */
pstj.widget.SelectionItem.prototype.setActiveState = function(active) {
  if (this.active_ != active) {
    this.active_ = active;
    this.update();
  }
};

/**
 * Updates the UI state of the component.
 */
pstj.widget.SelectionItem.prototype.update = function() {
  if (this.active_) {
    goog.dom.classlist.add(this.getElement(), goog.getCssName('active'));
  } else {
    goog.dom.classlist.remove(this.getElement(), goog.getCssName('active'));
  }
};

/** @inheritDoc */
pstj.widget.SelectionItem.prototype.getTemplate = function() {
  var thumb = this.getModel().getProp(this.thumnailPropertyName);
  if (!goog.isString(thumb) || goog.string.trim(thumb) == '') {
    thumb = pstj.widget.SelectionItem.defaultThumbnail;
  }
  return pstj.select.SelectionItem({
    thumbnail: thumb,
    name: this.getModel().getProp(this.namePropertyname)
  });
};

/** @inheritDoc */
pstj.widget.SelectionItem.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
    this.handleClick);
};

/**
 * Handles the clicks, if it is a double click we dispatch the SELECT event,
 *   else the HIGHLIGHT event is dispatched.
 * @param {goog.events.Event} e The click event.
 * @protected
 */
pstj.widget.SelectionItem.prototype.handleClick = function(e) {
  var ts = goog.now();
  if ((ts - this.lastTs_) < 500) {
    this.dispatchEvent(goog.ui.Component.EventType.SELECT);
  } else {
    this.lastTs_ = ts;
    this.dispatchEvent(goog.ui.Component.EventType.HIGHLIGHT);
  }
};
