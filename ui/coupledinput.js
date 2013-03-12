/**
 * @fileoverview Provides working coupled input elements with support for
 * labels (via goog.ui.LabelInput).
 *
 * @author  regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.CoupledInput');

goog.require('goog.Disposable');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.LabelInput');

/**
 * Class that provides coupled elements binding. It will check both elements
 * on their own with an optional function and will also check is the values
 * match. Used for 'pass + confirm pass' or 'mail + confirm mail' type of
 * interfaces.
 *
 * @constructor
 *
 * @extends {goog.Disposable}
 *
 * @param {!Element} el1 The first of the input elements.
 * @param {!Element} el2 The second input element.
 * @param {function(!string): boolean=} fn Optional function that will perform
 * the validity check of the fields individually.
 */
pstj.ui.CoupledInput = function(el1, el2, fn) {
  goog.base(this);
  this.i1 = el1;
  this.i2 = el2;
  this.li1 = new goog.ui.LabelInput();
  this.li2 = new goog.ui.LabelInput();
  this.li1.decorate(this.i1);
  this.li2.decorate(this.i2);

  if (goog.isFunction(fn)) {
    this.validateFunction_ = fn;
  }

  this.setupListeners_();
};
goog.inherits(pstj.ui.CoupledInput, goog.Disposable);

/**
 * The method used to check the validity of each of the fields individually.
 *
 * @param {!string} value The string value to test.
 *
 * @private
 *
 * @return {boolean} True if the string is considered value, false otherwise.
 * The default implementation just checks for empty strings.
 */
pstj.ui.CoupledInput.prototype.validateFunction_ = function(value) {
  if (value == '') return false;
  return true;
};

/**
 * The CSS class that will be attached to the elements marked as invalid.
 *
 * @type {string}
 *
 * @private
 */
pstj.ui.CoupledInput.prototype.cssClassInvalid_ = goog.getCssName(
  'invalid-value');

/**
 * Sets the function used to validate the individual inputs.
 *
 * @param {function(!string): boolean} fn The function should execute check of
 * the submitted value and return true if the value matches the desired
 * criteria and false if it does not.
 */
pstj.ui.CoupledInput.prototype.setValidateMethod = function(fn) {
  this.validateFunction_ = fn;
};

/**
 * Check function. It server as wrapper function to call the actual check
 * function as to avoid re-initializing the events after changes to the ckeck
 * function implementation.
 *
 * @private
 *
 * @param  {!string} value The input value to check.
 *
 * @return {boolean} The result from the check, true if the value matches the
 * desired format, false otherwise.
 */
pstj.ui.CoupledInput.prototype.checkInputValue_ = function(value) {
  return this.validateFunction_(value);
};

/**
 * Check the secondary value, it uses the common check, but on top of it
 * check if the value matches the primary one.
 * @private
 * @param  {!string} value The value of the input to check.
 * @return {boolean} True if the value is considered valid, fals eotherwise.
 */
pstj.ui.CoupledInput.prototype.checkSecondaryInput_ = function(value) {
  var valid = this.checkInputValue_(value);
  if (value != this.getValue(this.i1)) {
    valid = false;
  }
  return valid;
};

/**
 * Getter for the value if the input elements, this is a wrapped for
 * gom.forms.getValue, but mihgt be subject of change in special casses, so we
 * leave it protected.
 *
 * @protected
 *
 * @param  {!Element} el The DOM element to get the value of.
 *
 * @return {string} The found value of the element.
 */
pstj.ui.CoupledInput.prototype.getValue = function(el) {
  return (/** @type {!string} */ goog.dom.forms.getValue(el));
};

/**
 * This is the check logic that will accept the blur event.
 * @protected
 * @param {!goog.events.Event} ev The BLUR event.
 */
pstj.ui.CoupledInput.prototype.check = function(ev) {
  var target = (/** @type {!Element} */ ev.target);
  var value = this.getValue(target);
  var valid;
  if (target == this.i1) {
    valid = this.checkInputValue_(value);
  } else if (target == this.i2) {
    valid = this.checkSecondaryInput_(value);
  } else {
    throw Error('This event is attached to element that we do not control');
  }

  if (valid) {
    goog.dom.classes.remove(target, this.cssClassInvalid_);
  } else {
    goog.dom.classes.add(target, this.cssClassInvalid_);
  }
};

/**
 * Sets up the even listeners for the elemens.
 * @private
 */
pstj.ui.CoupledInput.prototype.setupListeners_ = function() {
  goog.events.listen(this.i1, goog.events.EventType.BLUR, this.check, false,
    this);
  goog.events.listen(this.i2, goog.events.EventType.BLUR, this.check, false,
    this);
};

/**
 * @inheritDoc
 */
pstj.ui.CoupledInput.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  goog.events.unlisten(this.i1, goog.events.EventType.BLUR, this.check, false,
    this);
  goog.events.unlisten(this.i2, goog.events.EventType.BLUR, this.check, false,
    this);
  this.li1.dispose();
  this.li2.dispose();
  delete this.li1;
  delete this.li2;
  delete this.i1;
  delete this.i2;
  delete this.validateFunction_;
};
