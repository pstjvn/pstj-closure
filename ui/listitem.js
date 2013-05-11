goog.provide('pstj.ui.ListItem');
goog.provide('pstj.ui.ListItemTemplate');

goog.require('goog.asserts');
goog.require('goog.dom.classlist');
goog.require('pstj.configure');
goog.require('pstj.ds.ListItem');
goog.require('pstj.templates');
goog.require('pstj.ui.Template');
goog.require('pstj.ui.Touchable');

/**
 * The default template for list item view.
 * @constructor
 * @extends {pstj.ui.Template}
 */
pstj.ui.ListItemTemplate = function() {
  goog.base(this);
};
goog.inherits(pstj.ui.ListItemTemplate, pstj.ui.Template);
goog.addSingletonGetter(pstj.ui.ListItemTemplate);

/** @inheritDoc */
pstj.ui.ListItemTemplate.prototype.getTemplate = function(model) {
  return pstj.templates.listitem(model);
};

/**
 * The default thumbnail to use if one is not found.
 * @type {string}
 */
pstj.ui.ListItemTemplate.prototype.defaultThumbnail = goog.asserts.assertString(
  pstj.configure.getRuntimeValue('THUMBNAIL',
    'assets/default-select-image.png', 'PSTJ.WIDGET.LISTITEM').toString());

/** @inheritDoc */
pstj.ui.ListItemTemplate.prototype.generateTemplateData = function(comp) {
  goog.asserts.assertInstanceof(comp.getModel(), pstj.ds.ListItem);
  return {
    thumbnail: comp.getModel().getProp('thumbnail') || this.defaultThumbnail,
    name: comp.getModel().getProp('name') || '&nbsp;'
  };
};

/**
 * My new class description
 * @constructor
 * @extends {pstj.ui.Touchable}
 * @param {pstj.ui.Template} opt_template Optional template.
 */
pstj.ui.ListItem = function(opt_template) {
  goog.base(this, opt_template || pstj.ui.ListItemTemplate.getInstance());
  this.lastTs_ = 0;
  this.active_ = false;
  this.enabled_ = true;
};
goog.inherits(pstj.ui.ListItem, pstj.ui.Touchable);

/**
 * @const
 * @type {string}
 */
pstj.ui.ListItem.CSS_CLASS = goog.getCssName('pstj-list-item');

/**
 * @override
 * @return {pstj.ds.ListItem}
 */
pstj.ui.ListItem.prototype.getModel;

/** @inheritDoc */
pstj.ui.ListItem.prototype.setModel = function(model) {
  goog.base(this, 'setModel', goog.asserts.assertInstanceof(
    model, pstj.ds.ListItem, 'Only list item instances are supported'));
};

/** @inheritDoc */
pstj.ui.ListItem.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this, goog.ui.Component.EventType.ACTIVATE,
    this.handleActivateEvent);
};

/**
 * Handles for the activate event, it happens when the item is clicked or
 *   touched.
 * @param {goog.events.Event} e The ACTIVATE component event.
 * @protected
 */
pstj.ui.ListItem.prototype.handleActivateEvent = function(e) {
  e.stopPropagation();
  var ts = goog.now();
  if (ts - this.lastTs_ < 450) {
    this.dispatchEvent(goog.ui.Component.EventType.SELECT);
  } else {
    this.lastTs_ = ts;
    this.dispatchEvent(goog.ui.Component.EventType.HIGHLIGHT);
  }
};

/**
 * Activates / deactivates the component.
 * @param {boolean} enable True to mark the component as activated.
 */
pstj.ui.ListItem.prototype.setActive = function(enable) {
  if (this.active_ != enable) {
    this.active_ = enable;
    this.update();
  }
};

/**
 * Enables / disabled the component.
 * @param {boolean} enable True to mark the component as enabled.
 */
pstj.ui.ListItem.prototype.setEnabled = function(enable) {
  if (this.enabled_ != enable) {
    this.enabled_ = enable;
    if (!this.enabled_) this.active_ = false;
    this.update();
  }
};

/**
 * Getter for the enable / disbaled state.
 * @return {boolean} True if the item is enabled.
 */
pstj.ui.ListItem.prototype.isEnabled = function() {
  return this.enabled_;
};

/** @inheritDoc */
pstj.ui.ListItem.prototype.draw = function(ts) {

  if (!this.enabled_) {
    goog.dom.classlist.add(this.getElement(), goog.getCssName(
      pstj.ui.ListItem.CSS_CLASS, 'disabled'));

  } else {
    goog.dom.classlist.remove(this.getElement(), goog.getCssName(
      pstj.ui.ListItem.CSS_CLASS, 'disabled'));
  }

  if (this.active_) {
    goog.dom.classlist.add(this.getElement(), goog.getCssName(
      pstj.ui.ListItem.CSS_CLASS, 'active'));
  } else {
    goog.dom.classlist.remove(this.getElement(), goog.getCssName(
      pstj.ui.ListItem.CSS_CLASS, 'active'));
  }

  return goog.base(this, 'draw', ts);
};
