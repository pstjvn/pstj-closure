goog.provide('pstj.material.RadioGroup');
goog.provide('pstj.material.RadioGroupRenderer');

goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.RadioButton');
goog.require('pstj.material.RadioButtonRenderer');


goog.scope(function() {



/**
 * Provides implementation for the material radio button.
 * @constructor
 * @extends {pstj.material.Element}
 * @struct
 * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
 *     to display as the content of the control (if any).
 * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
 *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 */
pstj.material.RadioGroup = function(opt_content, opt_renderer, opt_domHelper) {
  goog.base(this, opt_content, opt_renderer, opt_domHelper);
  /** @type {string} */
  this.value = '';
  /** @type {string} */
  this.values = '';
  /** @type {string} */
  this.name = '';
  /** @type {string} */
  this.labels = '';
  /**
   * @type {pstj.material.RadioButton}
   * @private
   */
  this.selectedChild_ = null;
};
goog.inherits(pstj.material.RadioGroup, pstj.material.Element);


/**
 * Creates a new instance from a configuration JSON file.
 * @param {RadioGroupConfig} json
 * @return {pstj.material.RadioGroup}
 */
pstj.material.RadioGroup.fromJSON = function(json) {
  var i = new pstj.material.RadioGroup();
  i.values = json.values;
  i.labels = json.labels;
  i.value = json.value;
  i.name = json.name;
  return i;
};



/**
 * Provides the default renderer for the radio button implementation.
 * @constructor
 * @extends {pstj.material.ElementRenderer}
 */
pstj.material.RadioGroupRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.RadioGroupRenderer, pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.RadioGroupRenderer);


/**
 * @type {string}
 * @final
 */
pstj.material.RadioGroupRenderer.CSS_CLASS = goog.getCssName(
    'material-radio-group');


var _ = pstj.material.RadioGroup.prototype;
var r = pstj.material.RadioGroupRenderer.prototype;


/** @inheritDoc */
_.decorateInternal = function(el) {
  if (!this.values) {
    this.values = el.getAttribute('values') || '';
  }
  if (!this.labels) {
    this.labels = el.getAttribute('labels') || this.values;
  }
  if (!this.name) this.name = el.getAttribute('name') || '';
  goog.base(this, 'decorateInternal', el);
  // If there are no children BUT we have values, we should add the children
  // manually.
  if (this.getChildCount() == 0) {
    if (this.values) {
      var vals = this.values.split(',');
      var labels = this.labels.split(',');
      goog.array.forEach(vals, function(val, i) {
        var v = goog.string.trim(val);
        var rb = new pstj.material.RadioButton(v);
        rb.name = this.name;
        rb.value = v;
        rb.setContent(labels[i]);
        this.addChild(rb, true);
        if (this.value == v) {
          rb.setChecked(true);
          this.selectedChild_ = rb;
        }
      }, this);
    }
  } else {
    // we have our children, figure out which one is selected
    if (!this.value) {
      this.forEachChild(function(child) {
        if (child.isChecked()) {
          this.value = child.value;
          this.selectedChild_ = child;
        }
      }, this);
    } else {
      this.forEachChild(function(child) {
        if (child.value == this.value) {
          child.setChecked(true);
        }
      }, this);
    }
  }
};


/** @inheritDoc */
_.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this, [
    goog.ui.Component.EventType.CHECK,
    goog.ui.Component.EventType.UNCHECK], this.onCheckHandler);
};


/**
 * Handles the check event of the children and updates the value intrinsically.
 * @param {goog.events.Event} e
 * @protected
 */
_.onCheckHandler = function(e) {
  // Stop the check/uncheck events, instead we use CHANGE from here on.
  e.stopPropagation();

  // Update values if checking
  if (e.type == goog.ui.Component.EventType.CHECK) {
    var old = this.selectedChild_;
    this.selectedChild_ = goog.asserts.assertInstanceof(e.target,
        pstj.material.RadioButton);
    this.value = e.target.value;
    // If there was a previously selected element ni the group, unselect it.
    if (!goog.isNull(old)) {
      old.setChecked(false);
    }
    this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
  } else {
    // handle uncheck to make sure that we are not actually unchecking the
    // already checked element and thus leaving without a checked element.
    if (e.target ==  this.selectedChild_) {
      e.preventDefault();
    }
  }
};


/** @inheritDoc */
r.getTemplate = function() {
  return pstj.material.template.RadioGroup(null);
};


/** @inheritDoc */
r.getCssClass = function() {
  return pstj.material.RadioGroupRenderer.CSS_CLASS;
};


// Define the defaults for the ui system.
goog.ui.registry.setDefaultRenderer(pstj.material.RadioGroup,
    pstj.material.RadioGroupRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.RadioGroupRenderer.CSS_CLASS, function() {
      return new pstj.material.RadioGroup(null);
    });

});  // goog.scope
