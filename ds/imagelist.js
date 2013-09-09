/**
 * @fileoverview Provides ready-to-use class for handling image loading. Main
 * intent for this class is to be used for image pre-loading, usually on
 * application start time. Note that no reference is kept to the downloaded
 * images, it only assures that the sizes are calculated (i.e. access to the
 * natural size of the images) and those are ordered in the order they are
 * loaded (as oposite in the order they were requested). One possible usage is
 * also to access them by src and use the calculated natiral size.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('pstj.ds.Image');
goog.provide('pstj.ds.ImageList');
goog.provide('pstj.ds.ImageList.EventType');

goog.require('goog.async.Delay');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.math.Size');
goog.require('goog.net.ImageLoader');
goog.require('goog.string');
goog.require('pstj.ds.List');
goog.require('pstj.ds.ListItem');



/**
 * Abstracted access to image with an ID.
 * @param {Object} data The data record for the image.
 * @constructor
 * @extends {pstj.ds.ListItem}
 */
pstj.ds.Image = function(data) {
  goog.base(this, data);
};
goog.inherits(pstj.ds.Image, pstj.ds.ListItem);


/**
 * Returns the image data sizes as Size record type.
 * @return {goog.math.Size} The image size as reported by the browser.
 */
pstj.ds.Image.prototype.getSize = function() {
  return new goog.math.Size(+this.getProp(pstj.ds.Image.Property.WIDTH),
      +this.getProp(pstj.ds.Image.Property.HEIGHT));
};


/**
 * Getter for the source of the image.
 * @return {string} The src of the image that was loaded.
 */
pstj.ds.Image.prototype.getSource = function() {
  return this.getProp(pstj.ds.Image.Property.SOURCE).toString();
};


/**
 * The names of the properties for this record type.
 * @enum {string}
 */
pstj.ds.Image.Property = {
  WIDTH: 'width',
  HEIGHT: 'height',
  SOURCE: 'source'
};



/**
 * Provides abstracted image list that accepts new images to load and adds
 *   them dynamically to its depo in such a way as to allow transparent
 *   acceess mechanizm without waiting for the complete event.
 * @constructor
 * @extends {pstj.ds.List}
 */
pstj.ds.ImageList = function() {
  goog.base(this);
  this.counter_ = 0;
  this.ready_ = false;
  this.loader_ = new goog.net.ImageLoader();
  this.loader_.setParentEventTarget(this);
  this.delayed_ = new goog.async.Delay(this.load_, 800, this);
  goog.events.listen(this.loader_, goog.events.EventType.LOAD, this.addImage,
      undefined, this);
};
goog.inherits(pstj.ds.ImageList, pstj.ds.List);


/**
 * The event fired by this class.
 * @enum {string}
 */
pstj.ds.ImageList.EventType = {
  READY: goog.events.getUniqueId('ready')
};


/** @inheritDoc */
pstj.ds.ImageList.prototype.add = function(node, reverse) {
  goog.asserts.assertInstanceof(node, pstj.ds.Image,
      'The new node is not instance of the Image record');
  goog.base(this, 'add', node, reverse);
};


/**
 * Handles the LOAD event from the image loader and processed the image to
 *   store it in the internal data structure.
 * @param {goog.events.Event} e The load event from the image loader.
 * @protected
 */
pstj.ds.ImageList.prototype.addImage = function(e) {
  var img = /** @type {Image} */ (e.target);
  var data = {};
  data['id'] = img.id;
  data[pstj.ds.Image.Property.WIDTH] = img.naturalWidth;
  data[pstj.ds.Image.Property.HEIGHT] = img.naturalHeight;
  data[pstj.ds.Image.Property.SOURCE] = img.src;
  this.add(new pstj.ds.Image(data));
  if (!this.ready_) {
    this.ready_ = true;
    this.dispatchEvent(pstj.ds.ImageList.EventType.READY);
  }
};


/**
 * Adds a new image to the pool, it will be added to be loaded and once loaded
 *   will be added to the internal list.
 * @param {string} src The source of the image.
 */
pstj.ds.ImageList.prototype.loadImage = function(src) {
  if (goog.string.trim(src) == '') return;
  this.loader_.addImage(this.counter_.toString(), src);
  this.counter_++;
  this.delayed_.start();
};


/**
 * Loads the images queued to be loaded in the image loader.
 * @private
 */
pstj.ds.ImageList.prototype.load_ = function() {
  this.loader_.start();
};


/** @inheritDoc */
pstj.ds.ImageList.prototype.disposeInternal = function() {
  goog.events.unlisten(this.loader_, goog.events.EventType.LOAD, this.addImage,
      undefined, this);
  goog.dispose(this.loader_);
  this.counter_ = 0;
  goog.base(this, 'disposeInternal');
};
