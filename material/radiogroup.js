goog.provide('pstj.material.RadioGroup');
goog.provide('pstj.material.RadioGroupRenderer');

goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
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
  this.setSupportedState(goog.ui.Component.State.DISABLED, true);
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

  this.values = el.getAttribute('values') || '';
  this.labels = el.getAttribute('labels') || this.values;
  this.name = el.getAttribute('name') || '';
  this.value = el.getAttribute('value') || '';

  goog.base(this, 'decorateInternal', el);
};


/** @inheritDoc */
_.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this, [
    goog.ui.Component.EventType.CHECK,
    goog.ui.Component.EventType.UNCHECK], this.onCheckHandler);
};


/**
 * Overrides the default behavior: if we are being disabled we need to disable
 * the children first and only then disabled us. If we are being enabled first
 * we need to be enabled and only then enable the children.
 * @override
 */
_.setEnabled = function(enable) {
  if (enable) {
    goog.base(this, 'setEnabled', enable);
    this.forEachChild(function(c) {
      c.setEnabled(enable);
    });
  } else {
    this.forEachChild(function(c) {
      c.setEnabled(enable);
    });
    goog.base(this, 'setEnabled', enable);
  }
};


/**
 * Handles the check event of the children and updates the value intrinsically.
 * @param {goog.events.Event} e
 * @protected
 */
_.onCheckHandler = function(e) {
  // Stop the check/uncheck events, instead we use CHANGE from here on.
  e.stopPropagation();
  if (!this.isEnabled()) {
    e.preventDefault();
    return;
  }

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
    if (e.target == this.selectedChild_) {
      e.preventDefault();
    }
  }
};


/** @inheritDoc */
_.addMaterialChildren = function() {
  goog.base(this, 'addMaterialChildren');

  // There are two ways to configure this component. One is via properties
  // that are evaluated and the children will be created based on those props
  // (mostly useful when the server is suited with form generation) or the
  // children are provided as separate elements in which case those are used
  // and the props are ignored

  // If there were no children from the server html we should create them.
  if (this.getChildCount() == 0) {
    if (this.values) {
      var vals = this.values.split(',');
      var labels = this.labels.split(',');

      goog.array.forEach(vals, function(val, i) {
        var v = goog.string.trim(val);
        var rb = new pstj.material.RadioButton(goog.string.trim(labels[i]));
        rb.name = this.name;
        rb.value = v;
        if (this.value == v) {
          rb.setChecked(true);
          this.selectedChild_ = rb;
        }
        // Here it is okay to use direct call as the radui button still does
        // not have a parent.
        rb.setEnabled(this.isEnabled());
        this.addChild(rb, true);
      }, this);
    }
  } else {
    // we have our children preconfigured, use them instead.
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
        } else {
          child.setChecked(false);
        }
      }, this);
    }

    // We need to work around the limitation of children that cannot be disabled
    // if their parent is disabled. This solves it for us.
    this.forEachChild(function(child) {
      child.setState(goog.ui.Component.State.DISABLED, !this.isEnabled(), true);
      if (child.isVisible()) {
        child.getRenderer().setFocusable(child, this.isEnabled());
      }
    }, this);
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
