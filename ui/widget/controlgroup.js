goog.provide('pstj.ui.widget.ControlGroup');
goog.provide('pstj.ui.widget.ControlGroupTemplate');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('pstj.templates');
goog.require('pstj.ui.Button');
goog.require('pstj.ui.Template');
goog.require('pstj.ui.Templated');

/**
 * @fileoverview Provides a control gruop for buttons. The widget is designed
 *   to be used as a container for several control action buttons, each button
 *   having an action attribute in the html. The button when activated will
 *   propagate the action event to the widget and controls can listen on
 *   Component's ACTION event and find the action by looking at the target of
 *   the event. The abstraction allows to have named actions from the template
 *   mapped to actions in the compiled code.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

 /**
  * Special template for control group of buttons.
  * @constructor
  * @extends {pstj.ui.Template}
  */
 pstj.ui.widget.ControlGroupTemplate = function() {
   goog.base(this);
 };
 goog.inherits(pstj.ui.widget.ControlGroupTemplate, pstj.ui.Template);
 goog.addSingletonGetter(pstj.ui.widget.ControlGroupTemplate);

 /** @inheritDoc */
 pstj.ui.widget.ControlGroupTemplate.prototype.getTemplate = function(model) {
   return pstj.templates.controlgroup({});
 };

/**
 * The base control group class.
 * @constructor
 * @extends {pstj.ui.Templated}
 * @param {pstj.ui.Template} opt_template Optional template to use for DOM
 *   construction.
 */
pstj.ui.widget.ControlGroup = function(opt_template) {
  goog.base(this, opt_template ||
    pstj.ui.widget.ControlGroupTemplate.getInstance());
};
goog.inherits(pstj.ui.widget.ControlGroup, pstj.ui.Templated);

/** @inheritDoc */
pstj.ui.widget.ControlGroup.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  goog.array.forEach(this.querySelectorAll('[data-action]'),
    this.createActionButton, this);
};

/**
 * Adds a new control button to the group from an element. The method should
 *   be called only from the decorate internal method.
 * @param {Element} element The lement to set up as button in the group.
 * @protected
 */
pstj.ui.widget.ControlGroup.prototype.createActionButton = function(element) {
  goog.asserts.assertInstanceof(element, Element,
    'Satisfy compiler greed for types');
  var button = new pstj.ui.Button();
  this.addChild(button);
  button.decorate(element);
};
