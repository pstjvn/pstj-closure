goog.provide('pstj.material.Button');
goog.provide('pstj.material.ButtonRenderer');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.Ripple');
goog.require('pstj.material.Shadow');
goog.require('pstj.material.State');
goog.require('pstj.material.template');

goog.scope(function() {



/**
 * Implementation for the Material Button UI component.
 *
 * @constructor
 * @struct
 * @extends {pstj.material.Element}
 * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
 *     to display as the content of the control (if any).
 * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
 *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 */
pstj.material.Button = function(opt_content, opt_renderer, opt_domHelper) {
  goog.base(this, opt_content, opt_renderer, opt_domHelper);

  this.setSupportedState(goog.ui.Component.State.DISABLED, true);
  this.setSupportedState(goog.ui.Component.State.RAISED, true);
  this.setSupportedState(goog.ui.Component.State.ACTIVE, true);
  this.setSupportedState(goog.ui.Component.State.FOCUSED, true);
  this.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);

  this.setAutoStates(goog.ui.Component.State.ACTIVE, true);

  this.setAutoEventsInternal(pstj.material.EventMap.EventFlag.PRESS |
      pstj.material.EventMap.EventFlag.RELEASE);

  this.setStateInternal(goog.ui.Component.State.TRANSITIONING |
      goog.ui.Component.State.RAISED);
};
goog.inherits(pstj.material.Button, pstj.material.Element);


/**
 * Constructs the instance from UI config.
 * @param {MaterialConfig} conf
 * @return {pstj.material.Button}
 */
pstj.material.Button.fromJSON = function(conf) {
  var i = new pstj.material.Button(conf.label || 'Button');
  i.setRaised(conf.raised);
  i.setEnabled(!conf.disabled);
  return i;
};



/**
 * @constructor
 * @struct
 * @extends {pstj.material.ElementRenderer}
 */
pstj.material.ButtonRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.ButtonRenderer, pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.ButtonRenderer);


/**
 * @type {string}
 * @final
 */
pstj.material.ButtonRenderer.CSS_CLASS = goog.getCssName('material-button');


var _ = pstj.material.Button.prototype;
var r = pstj.material.ButtonRenderer.prototype;


/** @inheritDoc */
_.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  this.getShadow().setTransitioning(this.isTransitioning());
};


/** @inheritDoc */
_.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.adjustDepth();
};


/** @inheritDoc */
_.onPress = function(e) {
  if (this.isEnabled()) {
    if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
      this.setActive(true);
      this.getRipple().onTap(e);
    }
    this.adjustDepth();
  }
};


/**
 * Adjusts the depth of the element if it supports raised state.
 * @protected
 */
_.adjustDepth = function() {
  if (!this.isEnabled()) {
    this.getShadow().setDepth(0);
  } else {
    if (this.isRaised()) {
      if (this.isActive()) {
        this.getShadow().setDepth(2);
      } else {
        this.getShadow().setDepth(1);
      }
    }
  }
};


/**
 * Getter for the shadow sub-element.
 * @return {pstj.material.Shadow}
 */
_.getShadow = function() {
  return goog.asserts.assertInstanceof(this.getChildAt(0),
      pstj.material.Shadow);
};


/**
 * Getter for the ripple.
 * @return {pstj.material.Ripple}
 */
_.getRipple = function() {
  return goog.asserts.assertInstanceof(this.getChildAt(2),
      pstj.material.Ripple);
};


/** @inheritDoc */
_.onRelease = function(e) {
  this.handleMouseUp(null);
  this.adjustDepth();
};


/** @inheritDoc */
_.setContent = function(cont) {
  if (this.getChildCount() > 0) {
    this.getChildAt(1).setContent(cont);
  }
  this.setContentInternal(cont);
};


/**
 * Override this so we know what is the type of renderer and call it.
 * @override
 * @return {pstj.material.ButtonRenderer}
 */
_.getRenderer = function() {
  return goog.base(this, 'getRenderer');
};


/** @inheritDoc */
r.getCssClass = function() {
  return pstj.material.ButtonRenderer.CSS_CLASS;
};


/** @inheritDoc */
r.generateTemplateData = function(control) {
  // needs to be an Element instance to support extended state checks with
  // short names. Otherwise 'hasState' should be used.
  goog.asserts.assertInstanceof(control, pstj.material.Element);
  return {
    label: control.getContent()
  };
};


/** @inheritDoc */
r.getTemplate = function(model) {
  return pstj.material.template.Button(model);
};


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.Button,
    pstj.material.ButtonRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.ButtonRenderer.CSS_CLASS, function() {
      return new pstj.material.Button(null);
    });

});  // goog.scope
