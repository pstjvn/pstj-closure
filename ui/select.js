goog.provide('pstj.ui.Select');
goog.provide('pstj.ui.SelectionItem');

goog.require('goog.array');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.CustomButton');
goog.require('pstj.ds.List');
goog.require('pstj.ds.ListItem');
goog.require('pstj.graphics.Smooth');
goog.require('pstj.select');
goog.require('pstj.ui.CustomButtonRenderer');
goog.require('pstj.ui.Templated');

/**
 * Provides a reusable select-like widget that has the feel of OSX select
 *   panel.
 * @constructor
 * @extends {pstj.ui.Templated}
 */
pstj.ui.Select = function() {
  goog.base(this);
  this.smooth = new pstj.graphics.Smooth(this.draw, this);
  this.selectButton = new goog.ui.CustomButton('',
    pstj.ui.CustomButtonRenderer.getInstance());
  this.cancelButton = new goog.ui.CustomButton('',
    pstj.ui.CustomButtonRenderer.getInstance());
  this.addChild(this.cancelButton);
  this.addChild(this.selectButton);
  this.opened_ = false;
  this.currentlySelected_ = null;
  this.selectButtonDisabled_ = true;
};
goog.inherits(pstj.ui.Select, pstj.ui.Templated);

goog.scope(function() {
  var _ = pstj.ui.Select.prototype;
  var classlist = goog.dom.classlist;
  var tpl = pstj.select;
  var array = goog.array;
  var CET = goog.ui.Component.EventType;

  /**
   * Overrides the method to check if the provided data is indeed a list. The
   *   list will be transformed to the pstj.ds.List data structure
   *   automatically. The expected format is array of objects really.
   * @override
   */
  _.setModel = function(model) {
    // expect an array and convert internally to list.
    if (!goog.isArray(model)) {
      throw new Error('The model should be an array of objects');
    }
    var list = new pstj.ds.List();
    array.forEach(model, function(item) {
      var listitem = new pstj.ds.ListItem(item);
      list.add(listitem);
    });
    goog.base(this, 'setModel', list);
    this.visualizeModel();
  };

  /**
   * Toggles the state of the selection view.
   */
  _.toggle = function() {
    this.opened_ = !this.opened_;
    this.update();
  };

  /**
   * Close the view.
   */
  _.close = function() {
    this.setState(false);
  };

  /**
   * Opens the view.
   */
  _.open = function() {
    this.setState(true);
  };

  /**
   * Signal the internal state needs update on screen.
   */
  _.update = function() {
    this.smooth.update();
  };

  /**
   * Returns the selected data record id.
   * @return {pstj.ds.ListItem} The ID of the selected record or null if
   *   record is not currently selected.
   */
  _.getSelection = function() {
    if (goog.isNull(this.currentlySelected_)) return null;
    return this.currentlySelected_.getModel();
  };

  /** @inheritDoc */
  _.getTemplate = function() {
    return tpl.Select({});
  };

  /**
   * Protected method that assures creation of selection items can be
   *   overridden by subclasses.
   * @param {pstj.ds.ListItem} model The model for the new selection item.
   * @protected
   */
  _.createSelectionItem = function(model) {
    var child = new pstj.ui.SelectionItem();
    child.setModel(model);
    this.addChild(child, true);
  };

  /**
   * Visualizes the selection items (i.e. ads them to the view).
   * @protected.
   */
  _.visualizeModel = function() {
    var model = /** @type {pstj.ds.List} */ (this.getModel());
    var count = model.getCount();
    for (var i = 0; i < count; i++) {
      this.createSelectionItem(model.getByIndex(i));
    }
  };

  /** @inheritDoc */
  _.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.selectButton.decorate(this.getEls(goog.getCssName(
      'pstj-action-select')));
    this.cancelButton.decorate(this.getEls(goog.getCssName(
      'pstj-action-cancel')));
  };

  /** @inheritDoc */
  _.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this, CET.HIGHLIGHT, this.handleHighlight);
    this.getHandler().listen(this, CET.SELECT, this.handleSelect);
    this.getHandler().listen(this.cancelButton, CET.ACTION, this.handleCancel);
    this.getHandler().listen(this.selectButton, CET.ACTION, this.handleSelect);
    this.selectButton.setEnabled(false);
  };

  /**
   * Handles the highlight of an item in the list.
   * @param {goog.events.Event} e The highlight event.
   * @protected
   */
  _.handleHighlight = function(e) {
    var comp = e.target;
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
  _.handleSelect = function(e) {
    // We assume we already know the active component so we will simply invoke
    // the action event here.
    e.stopPropagation();
    this.close();
    this.dispatchEvent(CET.ACTION);
  };

  /**
   * Handles the cancel button action.
   * @param {goog.events.Event} e The ACTION event from the button.
   * @protected
   */
  _.handleCancel = function(e) {
    e.stopPropagation();
    this.close();
  };

  /** @inheritDoc */
  _.getContentElement = function() {
    return this.getEls(goog.getCssName('pstj-select-body'));
  };

  /**
   * Sets the visibility state
   * @param {boolean} open If true the selection menu is shown.
   * @protected
   */
  _.setState = function(open) {
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
  _.draw = function(ts) {
    if (this.opened_) {
      classlist.add(this.getElement(), goog.getCssName('pstj-select-active'));
    } else {
      classlist.remove(this.getElement(), goog.getCssName(
        'pstj-select-active'));
    }
    return false;
  };
});

/**
 * @constructor
 * @extends {pstj.ui.Templated}
 */
pstj.ui.SelectionItem = function() {
  goog.base(this);
};
goog.inherits(pstj.ui.SelectionItem, pstj.ui.Templated);

goog.scope(function() {
  var _ = pstj.ui.SelectionItem.prototype;
  var tpl = pstj.select;
  var BET = goog.events.EventType;
  var CET = goog.ui.Component.EventType;
  var classlist = goog.dom.classlist;

  /**
   * Easier to spot naming convention.
   * @type {string}
   */
  _.thumnailPropertyName = 'thumbnail';

  /**
   * Easier to spot naming convention.
   * @type {string}
   */
  _.namePropertyname = 'name';

  /**
   * The last time stamp a click was registered.
   * @type {number}
   * @private
   */
  _.lastTs_ = 0;


  /**
   * Overrides the return pattern, we actually return a list item.
   * @override
   * @return {pstj.ds.ListItem}
   */
  _.getModel;

  /**
   * This method is designed to be called by the collection handler instance
   *   and not internally, as internally we only dispatch the events.
   * @param {boolean} active True if the element should be marked as active.
   */
  _.setActiveState = function(active) {
    if (this.active_ != active) {
      this.active_ = active;
      this.update();
    }
  };

  /**
   * Updates the UI state of the component.
   */
  _.update = function() {
    if (this.active_) {
      classlist.add(this.getElement(), goog.getCssName('active'));
    } else {
      classlist.remove(this.getElement(), goog.getCssName('active'));
    }
  };

  /** @inheritDoc */
  _.getTemplate = function() {
    return tpl.SelectionItem({
      thumbnail: this.getModel().getProp(this.thumnailPropertyName) ||
        'assets/def-mov.png',
      name: this.getModel().getProp(this.namePropertyname)
    });
  };

  /** @inheritDoc */
  _.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this.getElement(), BET.CLICK, this.handleClick);
  };

  /**
   * Handles the clicks, if it is a double click we dispatch the SELECT event,
   *   else the HIGHLIGHT event is dispatched.
   * @param {goog.events.Event} e The click event.
   * @protected
   */
  _.handleClick = function(e) {
    var ts = goog.now();
    if ((ts - this.lastTs_) < 500) {
      this.dispatchEvent(CET.SELECT);
    } else {
      this.lastTs_ = ts;
      this.dispatchEvent(CET.HIGHLIGHT);
    }
  };

});
