goog.provide('pstj.ui.Upload');
goog.provide('pstj.ui.Upload.Event');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.net.EventType');
goog.require('goog.net.IframeIo');
goog.require('pstj.ui.Templated');

/**
 * @fileoverview Provides a custom file upload utility. ONly a single file
 * upload is supported and the widget has no visual representation, instead it
 * is expected to be triggered from the program (i.e. not from direct user
 * action on the firm itself) in the handle chain of a real click event.
 * Allows to mask a file upload as a single action button when the UI requires
 * it.
 *
 * @author  regardingscot@gmail.com (Peter StJ)
 */


/**
 * Provides meaningful one file upload mechanism. Used to mask a file upload
 * form as a regular UI component / widget. Note that the trigger method
 * should be called from a real user event handler in order to allow its
 * default action (otherwise the browser will ignore it).
 *
 * Example:
 * <pre>
 * mycomponent.form_ = new pstj.ui.Upload('/upload', 'my_variable');
 * mycomponent.getHandler().listen(this.getElement(),
 *   goog.events.EventType.CLICK, function(e) {
 *   e.stopPropagation();
 *   e.preventDefault();
 *   this.form_.trigger(); // Will open the file selection native widget
 *   // supported by the browser.
 * });
 * mycomponent.getHandler().listen(this.form_, [
 *   pstj.ui.Upload.EventType.SUCCESS,
 *   pstj.ui.Upload.EventType.FAIL], function(e) {
 *   if (e.type == pstj.ui.Upload.EventType.SUCCESS) {
 *     console.log('Server response was: ', e.formResponse);
 *   }
 * })
 * </pre>
 *
 * @constructor
 * @extends {pstj.ui.Templated}
 * @param {!string} url The url of the form to configure.
 * @param {string=} name Optional name for the input that holds the file.
 */
pstj.ui.Upload = function(url, name) {
  goog.base(this);
  this.url_ = url;
  this.io_ = new goog.net.IframeIo();
  this.getHandler().listen(this.io_, goog.net.EventType.COMPLETE,
    this.handleFormComplete);

  if (goog.isString(name)) this.name_ = name;
};
goog.inherits(pstj.ui.Upload, pstj.ui.Templated);

/**
 * Reference to the IframeIO used to make the actual upload.
 * @type {goog.net.IframeIo}
 * @private
 */
pstj.ui.Upload.prototype.io_;

/**
 * The name of the input that holds the file. If not provided a default one
 *   will be used.
 * @type {string}
 * @private
 */
pstj.ui.Upload.prototype.name_ = 'upload';

/**
 * The URL to upload the file to.
 * @type {string}
 * @private
 */
pstj.ui.Upload.prototype.url_;

/** @inheritDoc */
pstj.ui.Upload.prototype.getTemplate = function() {
  // Provide default template.
  return '<div class="' + goog.getCssName('hidden-form') +
    '"><form method="post" enctype="multipart/form-data" action="' +
    this.url_ +
    '" name="uploadform"><input name="' + this.name_ +
    '" type="file" style="display: none;" class="' +
    goog.getCssName('monitor') + '" id="attachment" /></form></div>';
};

/**
 * Handle the complete event from the form upload. This default implementation
 *   only emits the corresponding SUCCESS / FAIL event with the response JSON
 *   that came back from the server. It assumes a valid JSON as response.
 * @param  {goog.events.Event} e The complete event from the IframeIO class.
 * @protected
 */
pstj.ui.Upload.prototype.handleFormComplete = function(e) {
  var target = /** @type {!goog.net.IframeIo} */ (e.target);
  this.dispatchEvent(new pstj.ui.Upload.Event(
    (target.isSuccess() ? pstj.ui.Upload.EventType.SUCCESS :
      pstj.ui.Upload.EventType.FAIL), this, target.getResponseJson()));
};

/**
 * Handles the file change event, happens when the user has selected a file in
 *   the native file selector. This default implementation directly triggers
 *   the file upload via the IframeIO class.
 * @param  {goog.events.Event} e The CHNAGE event.
 * @protected
 */
pstj.ui.Upload.prototype.handleFileChange = function(e) {
  this.io_.sendFromForm(e.target.parentNode);
};

/**
 * The method looks for the 'monitor' class name on an element in the template
 *   to decide on which element to attach the change event monitoring in order
 *   to trigger the file upload.
 * @inheritDoc
 */
pstj.ui.Upload.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  goog.array.forEach(dom.getElementsByClass(goog.getCssName('monitor'),
    this.getElement()), function(el) {
      this.getHandler().listen(el, goog.events.EventType.CHANGE,
        this.handleFileChange);
    }, this);
};

/**
 * Activates the file selector in the browser.
 */
pstj.ui.Upload.prototype.trigger = function() {
  goog.dom.getElement('attachment').click();
};

/** @inheritDoc */
pstj.ui.Upload.prototype.disposeInternal = function() {
  goog.dispose(this.io_);
  this.io_ = null;
  delete this.url_;
  delete this.name_;
  goog.base(this, 'disposeInternal');
};

/**
 * Form event to dispatch, that will contain the server response that is
 *   generated for the upload.
 * @constructor
 * @extends {goog.events.Event}
 * @param {pstj.ui.Upload.EventType} type The type of the event, signifies
 *   successful upload or failure.
 * @param {pstj.ui.Upload} target The pstj.ui.Upload instance that fired the
 *   event.
 * @param {Object|string} response The response from the server. Could be any,
 *   but in default implementation it is expected to be a JSON object.
 */
pstj.ui.Upload.Event = function(type, target, response) {
  goog.base(this, type, target);
  this.formResponse = response;
};
goog.inherits(pstj.ui.Upload.Event, goog.events.Event);

/**
 * @type {Object|string}
 */
pstj.ui.Upload.Event.prototype.formResponse;

/**
 * Enums the event types.
 * @enum {string}
 */
pstj.ui.Upload.EventType = {
  SUCCESS: goog.events.getUniqueId('form-upload-success'),
  FAIL: goog.events.getUniqueId('form-upload-fail')
};
