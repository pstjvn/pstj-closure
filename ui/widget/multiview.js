/**
 * @fileoverview Simple widget that allows one and same container element to
 * host multiple componen instances and siwthc between them seamingly.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.widget.MultiView');

goog.require('goog.asserts');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');



/**
 * Provides a simple to use view switcher. The component can host several
 * controls, only one visible at a time.
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
pstj.widget.MultiView = function() {
  goog.base(this);
  /**
   * Reference to the child that is currently visible in the view.
   * @type {goog.ui.Control}
   * @private
   */
  this.currentChild_ = null;
};
goog.inherits(pstj.widget.MultiView, goog.ui.Component);


goog.scope(function() {

var _ = pstj.widget.MultiView.prototype;


/**
 * Getter for the currently visible child.
 * @return {goog.ui.Control}
 */
_.getVisibleChild = function() {
  return this.currentChild_;
};


/** @inheritDoc */
_.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.findVisibleChild_();
  // The show event should travel via the component tree, hosts can listen on
  // it and set up thier switchers/back buttons based on the current active
  // child.
  this.getHandler().listen(this, goog.ui.Component.EventType.SHOW,
      this.handleShow);
};


/**
 * On entering the document assuming all children has been already added find
 * the first control that is visible and use it as current one.
 * @private
 */
_.findVisibleChild_ = function() {
  if (goog.isNull(this.currentChild_) && this.getChildCount() > 0) {
    this.currentChild_ = goog.asserts.assertInstanceof(this.getChildAt(0),
        goog.ui.Control, 'The multi view children should be controls');
  }
};


/**
 * @inheritDoc
 */
_.addChild = function(child, opt_render) {
  goog.base(this, 'addChild', child, opt_render);
  if (this.currentChild_) {
    child.setVisible(false);
  } else {
    this.currentChild_ = /** @type {goog.ui.Control} */(child);
    child.setVisible(true);
  }
};


/**
 * Handles the SHOW event from any child. The child's parent to checked to
 * match one of the direct children of the component.
 * @param {goog.events.Event} e The SHOW component event.
 * @protected
 */
_.handleShow = function(e) {
  if (e.target == this) return;
  var target = goog.asserts.assertInstanceof(e.target, goog.ui.Control,
      'The target should always be a control');
  if (target.getParent() != this) return;
  if (!goog.isNull(this.currentChild_) && target != this.currentChild_) {
    this.currentChild_.setVisible(false);
  }
  this.currentChild_ = target;
};


/** @inheritDoc */
_.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.currentChild_ = null;
};

});  // goog.scope
