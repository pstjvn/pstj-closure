goog.provide('pstj.ui.widget.ControlGroup');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('pstj.ui.Button');
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
 * The base control group class.
 * @constructor
 * @extends {pstj.ui.Templated}
 */
pstj.ui.widget.ControlGroup = function() {
  goog.base(this);
};
goog.inherits(pstj.ui.widget.ControlGroup, pstj.ui.Templated);

goog.scope(function() {

  var _ = pstj.ui.widget.ControlGroup.prototype;

  /** @inheritDoc */
  _.getTemplate = function() {
    return pstj.widget.controlgroup({});
  };

  /** @inheritDoc */
  _.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    goog.array.forEach(this.querySelectorAll('.' +
      goog.getCssName('pstj-control-group-buttons') +
      '[data-action]'), this.createActionButton, this);
  };

  /**
   * Adds a new control button to the group from an element. The method should
   *   be called only from the decorate internal method.
   * @param {Element} element The lement to set up as button in the group.
   * @protected
   */
  _.createActionButton = function(element) {
    goog.asserts.assertInstanceof(element, Element,
      'Satisfy compiler greedy type algorythm');
    var button = new pstj.ui.Button();
    this.addChild(button);
    button.decorate(element);
  };

});

