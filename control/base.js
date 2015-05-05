/**
 * @fileoverview The incentive behind this class is to provide controlling
 *   interface that is usable without having to delegate to a single 'top'
 *   component. This will allows for composite insterfaces to be constructed
 *   by combining multiple components and widgets and listen to all of them in
 *   a cohesive controlling instance. It also allows for nested control
 *   instances and action handling delegation, allowing a child control to not
 *   be nesessarily aware of all possible actions in the handled UI components
 *   and simply delegate the control flow to a parent controller.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.control.Base');

goog.require('goog.Disposable');
goog.require('goog.asserts');
goog.require('goog.events.EventHandler');



/**
 * Provides the basic control flow.
 * @constructor
 * @extends {goog.Disposable}
 * @deprecated Bad design, controls should not be in hierarchical structure.
 * Instead use {pstj.control.Control} - by design it communicates to everyone
 * who listens for a certain topic.
 */
pstj.control.Base = function() {
  goog.base(this);
  /**
   * @private
   * @type {goog.events.EventHandler}
   */
  this.handler_ = null;
  /**
   * @private
   * @type {pstj.control.Base}
   */
  this.parent_ = null;
  /**
   * Utility flag to prevent double initialization of controls.
   * @private
   * @type {boolean}
   */
  this.inited_ = false;
};
goog.inherits(pstj.control.Base, goog.Disposable);


/**
 * Initialization routine should go here.
 */
pstj.control.Base.prototype.initialize = function() {
  goog.asserts.assert((!this.inited_),
      'Reinitialization of controls is not allowed');
  this.inited_ = true;
};


/**
 * Checks if the control has been initialized.
 * @return {boolean} True if the controler has been initialized.
 */
pstj.control.Base.prototype.isInitialized = function() {
  return this.inited_;
};


/**
 * Utility function, returns bound handler for easier work with instance
 *   methods.
 * @return {goog.events.EventHandler} The instance bound event handler.
 */
pstj.control.Base.prototype.getHandler = function() {
  if (goog.isNull(this.handler_)) {
    this.handler_ = new goog.events.EventHandler(this);
  }
  return this.handler_;
};


/**
 * Sets the parent control instance and thus effectively delegaes actions.
 * @param {pstj.control.Base} parent The parent instance to use.
 */
pstj.control.Base.prototype.setParentControlInstance = function(parent) {
  goog.asserts.assertInstanceof(parent, pstj.control.Base,
      'Parent control should be control instance as well');
  this.parent_ = parent;
};


/**
 * Notify system for controls. Works similar to events except there is no
 *   subscribing and only one parent can listen to a child controler.
 *   Implementors are encouraged to override this method and emit to parents
 *   only if the action is not handled in the control instance.
 * @param {pstj.control.Base} child The control that is emiting the
 *   notification.
 * @param {string} action The name of the action.
 */
pstj.control.Base.prototype.notify = function(child, action) {
  if (!goog.isNull(this.parent_)) {
    this.parent_.notify(this, action);
  }
};


/** @inheritDoc */
pstj.control.Base.prototype.disposeInternal = function() {
  goog.dispose(this.handler_);
  this.handler_ = null;
  this.parent_ = null;
  goog.base(this, 'disposeInternal');
};
