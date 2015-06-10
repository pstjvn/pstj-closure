/**
 * @fileoverview Implementation for the header panel as found in the material
 * design reference implementation.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.HeaderPanel');
goog.provide('pstj.material.HeaderPanelRenderer');

goog.require('goog.ui.Component.State');
goog.require('pstj.agent.Scroll');
goog.require('pstj.agent.ScrollEvent');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.EventMap');
goog.require('pstj.material.HeaderPanelHeader');
goog.require('pstj.material.HeaderPanelMain');
goog.require('pstj.material.State');
goog.require('pstj.material.template');



/**
 * The header panel implementation for material element.
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
pstj.material.HeaderPanel = function(opt_content, opt_renderer, opt_domHelper) {
  goog.base(this, opt_content, opt_renderer, opt_domHelper);
  // Enable tall and shadow mode so we can set them is needed
  this.setSupportedState(goog.ui.Component.State.STANDARD, true);
  this.setSupportedState(goog.ui.Component.State.TALL, true);
  this.setSupportedState(goog.ui.Component.State.WATERFALL_TALL, true);
  this.setSupportedState(goog.ui.Component.State.WATERFALL, true);
  this.setSupportedState(goog.ui.Component.State.SHADOW, true);
  this.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);

  this.setAutoEventsInternal(pstj.material.EventMap.EventFlag.SCROLL);
};
goog.inherits(pstj.material.HeaderPanel, pstj.material.Element);


/**
 * Getter for the main element of the header panel.
 * @return {pstj.material.Element}
 */
pstj.material.HeaderPanel.prototype.getMain = function() {
  return goog.asserts.assertInstanceof(this.getChildAt(1),
      pstj.material.Element);
};


/**
 * Easier header element retrieval.
 * @return {pstj.material.Element}
 */
pstj.material.HeaderPanel.prototype.getHeader = function() {
  return goog.asserts.assertInstanceof(this.getChildAt(0),
      pstj.material.Element);
};


/** @override */
pstj.material.HeaderPanel.prototype.getScrollElement = function() {
  return goog.asserts.assert(this.getContentElement());
};


/** @override */
pstj.material.HeaderPanel.prototype.onScroll = function(e) {
  var atTop = e.scrollTop == 0;
  this.setState(goog.ui.Component.State.SHADOW,
      (this.hasState(goog.ui.Component.State.STANDARD) ||
      (this.isShadow() && !atTop)));
  this.setState(goog.ui.Component.State.TALL, (this.isTall() && atTop));
};


/** @override */
pstj.material.HeaderPanel.prototype.setState = function(
    state, enable, opt_calledFrom) {
  if (state == goog.ui.Component.State.TALL) {
    var oldTall = this.hasState(goog.ui.Component.State.TALL);
  }
  goog.base(this, 'setState', state, enable, opt_calledFrom);
  if (state == goog.ui.Component.State.TALL) {
    if (oldTall && !this.isTall()) {
      this.getHandler().listenOnce(this.getHeader().getElement(),
          goog.events.EventType.TRANSITIONEND, function() {
            this.setState(goog.ui.Component.State.TRANSITIONING, false);
            this.getMain().dispatchEvent(goog.events.EventType.RESIZE);
          });
    } else {
      this.setState(goog.ui.Component.State.TRANSITIONING, true);
    }
  }
};


/** @override */
pstj.material.HeaderPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.dispatchEvent(new pstj.agent.ScrollEvent(this));
};


/**
 * Checks if we have the shadow state set.
 * @return {boolean}
 */
pstj.material.HeaderPanel.prototype.isShadow = function() {
  return !!(this.getState() & pstj.material.HeaderPanel.SHADOW_MODE);
};


/**
 * Checks if we have the tell state set on.
 * @return {boolean}
 */
pstj.material.HeaderPanel.prototype.isTall = function() {
  return !!(this.getState() & pstj.material.HeaderPanel.TALL_MODE);
};


/**
 * Sets the type of the header panel. The types should be exported.
 * @param {string} type The type of header panel to use.
 */
pstj.material.HeaderPanel.prototype.setType = function(type) {
  this.setState(goog.ui.Component.State.STANDARD, false);
  this.setState(goog.ui.Component.State.WATERFALL, false);
  this.setState(goog.ui.Component.State.WATERFALL_TALL, false);
  switch (type) {
    case 'standard':
      this.setState(goog.ui.Component.State.STANDARD, true);
      break;
    case 'waterfall':
      this.setState(goog.ui.Component.State.WATERFALL, true);
      break;
    case 'tall':
      this.setState(goog.ui.Component.State.WATERFALL_TALL, true);
      break;
  }
};


/** @override */
pstj.material.HeaderPanel.prototype.addMaterialChildren = function() {
  goog.base(this, 'addMaterialChildren');
  if (this.getElement().hasAttribute('waterfall')) {
    this.setType('waterfall');
  } else if (this.getElement().hasAttribute('standard')) {
    this.setType('standard');
  } else if (this.getElement().hasAttribute('tall')) {
    this.setType('tall');
  }
};


/**
 * Combination of modes in each of them we need the shadow.
 * @type {number}
 * @final
 */
pstj.material.HeaderPanel.SHADOW_MODE = (
    goog.ui.Component.State.WATERFALL |
    goog.ui.Component.State.WATERFALL_TALL |
    goog.ui.Component.State.STANDARD);


/**
 * Combination of modes in wach of those we need to have tall mode.
 * @type {number}
 * @final
 */
pstj.material.HeaderPanel.TALL_MODE = (goog.ui.Component.State.WATERFALL_TALL);



/**
 * Do not use the constructor, instead use the getInstance satic method.
 * @constructor
 * @extends {pstj.material.ElementRenderer}
 * @struct
 */
pstj.material.HeaderPanelRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.HeaderPanelRenderer, pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.HeaderPanelRenderer);


/**
 * The CSS name to recognize the control.
 * @type {string}
 * @final
 */
pstj.material.HeaderPanelRenderer.CSS_CLASS = goog.getCssName(
    'material-header-panel');


/** @override */
pstj.material.HeaderPanelRenderer.prototype.getTemplate = function(model) {
  return pstj.material.template.HeaderPanel(model);
};


/** @inheritDoc */
pstj.material.HeaderPanelRenderer.prototype.getContentElement = function(el) {
  return goog.dom.getElementByClass(goog.getCssName(this.getCssClass(),
      'outer-container'), el);
};


/** @override */
pstj.material.HeaderPanelRenderer.prototype.getCssClass = function() {
  return pstj.material.HeaderPanelRenderer.CSS_CLASS;
};


goog.ui.registry.setDefaultRenderer(pstj.material.HeaderPanel,
    pstj.material.HeaderPanelRenderer);


goog.ui.registry.setDecoratorByClassName(
    pstj.material.HeaderPanelRenderer.CSS_CLASS, function() {
      return new pstj.material.HeaderPanel(null);
    });
