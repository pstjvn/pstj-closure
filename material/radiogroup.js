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
  /**
   * Reference to the currently selected choice in the radio group.
   * @type {goog.ui.Component}
   * @private
   */
  this.value = '';
  this.values = '';
  this.name = '';
  /**
   * @type {pstj.material.RadioButton}
   * @private
   */
  this.selectedChild_ = null;
};
goog.inherits(pstj.material.RadioGroup, pstj.material.Element);



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
  if (!this.name) this.name = el.getAttribute('name') || '';
  goog.base(this, 'decorateInternal', el);
  // If there are no children BUT we have values, we should add the children
  // manually.
  if (this.getChildCount() == 0) {
    if (this.values) {
      var vals = this.values.split(',');
      goog.array.forEach(vals, function(val) {
        var v = goog.string.trim(val);
        var rb = new pstj.material.RadioButton(v);
        rb.name = this.name;
        rb.value = v;
        this.addChild(rb, true);
        if (this.value == v) {
          rb.setChecked(true);
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
  this.getHandler().listen(this, goog.ui.Component.EventType.CHECK,
      this.onCheckHandler);
};


/**
 * Handles the check event of the children and updates the value intrinsically.
 * @param {goog.events.Event} e
 * @protected
 */
_.onCheckHandler = function(e) {
  if (e.target.value) {
    this.value = e.target.value;
    if (!goog.isNull(this.selectedChild_)) {
      this.selectedChild_.setChecked(false);
    }
    this.selectedChild_ = e.target;
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
