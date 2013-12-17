/**
 * @fileoverview Provides a very simple component consisting of only
 * an image that loads in the background and then shows up with an effect.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */
goog.provide('pstj.ui.Image');

goog.require('goog.asserts');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Component');



/**
 * Provides a class that abstracts the logic of loading an image in the
 * background without having to involve any externalized logic. Setting the
 * model of the component to a new source for the image will load it
 * internally, while switching on a loading class name on the DOM element and
 * once the image is fully loaded will remove the loading class.
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {goog.ui.Component}
 */
pstj.ui.Image = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
  /**
   * The current image source.
   * @type {string}
   * @private
   */
  this.src_ = '';
  /**
   * The helper image loader.
   * @type {Image}
   * @private
   */
  this.imageTag_ = new Image();

  this.imageTag_.onload = goog.bind(this.onImageLoaded, this);
};
goog.inherits(pstj.ui.Image, goog.ui.Component);


goog.scope(function() {

var _ = pstj.ui.Image.prototype;


/** @inheritDoc */
_.setModel = function(src) {
  goog.asserts.assertString(src, 'The model could only be a string');
  if (src != this.src_) {
    this.setSource(src);
  }
};


/**
 * Handles the loading of the image in the helper image instance.
 * @param {Event} e The native load event.
 * @protected
 */
_.onImageLoaded = function(e) {
  this.getElement().src = this.src_;
  goog.dom.classlist.remove(this.getElement(), goog.getCssName('loading'));
};


/**
 * Sets to load a new image source.
 * @param {string} src The source of the image.
 * @protected
 */
_.setSource = function(src) {
  goog.dom.classlist.add(this.getElement(), goog.getCssName('loading'));
  this.src_ = src;
  this.imageTag_.src = src;
};

});  // goog.scope
