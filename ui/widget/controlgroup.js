goog.provide('pstj.widget.ControlGroup');
goog.provide('pstj.widget.ControlGroupTemplate');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('pstj.templates');
goog.require('pstj.ui.Button');
goog.require('pstj.ui.Template');
goog.require('pstj.ui.Templated');

/**
 * @fileoverview Provides a control group for buttons. The widget is designed
 * to be used as a container for several control action buttons, each button
 * having an action attribute in the html. The button when activated will
 * propagate the action event to the widget and controls can listen on
 * Component's ACTION event and find the action by looking at the target of
 * the event. The abstraction allows to have named actions from the template
 * mapped to actions in the compiled code.
 *
 * Example:
 * Template:
 * <pre>
 * <div class="container">
 *   <div class="pstj-button" data-action="ok">OK</div>
 *   <div class="pstj-button" data-action="cancel">Cancel</div>
 * </div>
 * </pre>
 * JavaScript:
 * <pre>
 * var controls = new pstj.widget.ControlGroup();
 * controls.decorate(document.querySelector('.container');
 * goog.events.listen(controls, goog.ui.Component.EventType.ACTION, function(e){
 *   // our action name
 *   var action = e.target.getActionName();
 * });
 * </pre>
 *
 * If you are looking for more simple group of buttons (i.e. control state is
 * not needed, consider ButtonPanel).
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * The template for the control group. Notice that this default template does
 * not provide the actions, you should provide your own template for this
 * widget class.
 *
 * @constructor
 * @extends {pstj.ui.Template}
 */
pstj.widget.ControlGroupTemplate = function() {
  goog.base(this);
};
goog.inherits(pstj.widget.ControlGroupTemplate, pstj.ui.Template);
goog.addSingletonGetter(pstj.widget.ControlGroupTemplate);

/** @inheritDoc */
pstj.widget.ControlGroupTemplate.prototype.getTemplate = function(model) {
  return pstj.templates.controlgroup({});
};

/**
 * The base control group class.
 *
 * @constructor
 * @extends {pstj.ui.Templated}
 * @param {pstj.ui.Template=} opt_template Optional template to use for DOM
 * construction.
 * @param {goog.ui.ButtonRenderer=} opt_button_renderer Optional renderer to
 * use for the control buttons.
 */
pstj.widget.ControlGroup = function(opt_template, opt_button_renderer) {
  goog.base(this, opt_template ||
    pstj.widget.ControlGroupTemplate.getInstance());
  /**
   * @private
   * @type {goog.ui.ButtonRenderer}
   */
  this.buttonRenderer_ = opt_button_renderer ||
    pstj.ui.CustomButtonRenderer.getInstance();
};
goog.inherits(pstj.widget.ControlGroup, pstj.ui.Templated);

/** @inheritDoc */
pstj.widget.ControlGroup.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  goog.array.forEach(this.querySelectorAll('[data-action]'),
    this.createActionButton, this);
};

/** @inheritDoc */
pstj.widget.ControlGroup.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.buttonRenderer_ = null;
};

/**
 * Adds a new control button to the group from an element. The method should
 * be called only from the decorate internal method.
 *
 * @param {Element} element The lement to set up as button in the group.
 * @protected
 */
pstj.widget.ControlGroup.prototype.createActionButton = function(element) {
  goog.asserts.assertInstanceof(element, Element,
    'Satisfy compiler greed for types');
  var button = new pstj.ui.Button(this.buttonRenderer_);
  this.addChild(button);
  button.decorate(element);
};
