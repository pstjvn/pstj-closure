goog.provide('pstj.material.Progressbar');
goog.provide('pstj.material.ProgressbarRenderer');

goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.EventType');
/** @suppress {extraRequire} */
goog.require('pstj.material.State');
goog.require('pstj.material.template');

goog.scope(function() {



/**
 * Provides thre 'Progressbar' element - used only for styling of a simple core
 *    element.
 * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
 *     to display as the content of the control (if any).
 * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
 *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 * @constructor
 * @extends {pstj.material.Element}
 * @struct
 */
pstj.material.Progressbar = function(opt_content, opt_renderer, opt_domHelper) {
  goog.base(this, opt_content, opt_renderer, opt_domHelper);
  this.setSupportedState(goog.ui.Component.State.EMPTY, true);
  this.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);
  this.setEmpty(true);
};
goog.inherits(pstj.material.Progressbar, pstj.material.Element);


/**
 * Constructs a new instance from a JSON config.
 * @param {MaterialConfig} json
 * @return {pstj.material.Progressbar}
 */
pstj.material.Progressbar.fromJSON = function(json) {
  var i = new pstj.material.Progressbar(json.content);
  pstj.material.Element.setupAdditionalClasses(i, json);
  return i;
};



/**
 * @constructor
 * @extends {pstj.material.ElementRenderer}
 * @struct
 */
pstj.material.ProgressbarRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.ProgressbarRenderer, pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.ProgressbarRenderer);


/**
 * @type {string}
 * @final
 */
pstj.material.ProgressbarRenderer.CSS_CLASS = goog.getCssName(
    'material-progress-bar');


var r = pstj.material.ProgressbarRenderer.prototype;
var _ = pstj.material.Progressbar.prototype;


/**
 * Start the progress bar. Indicates processing.
 */
_.start = function() {
  this.setTransitioning(true);
  this.dispatchEvent(pstj.material.EventType.LOAD_START);
};


/**
 * Complete the started action.
 */
_.complete = function() {
  this.setEmpty(false);
  this.setTransitioning(false);
  this.dispatchEvent(pstj.material.EventType.LOAD_END);
};


/**
 * Resets the progressbar state as if it was not yet started.
 */
_.reset = function() {
  this.setEmpty(true);
};


/** @inheritDoc */
r.getCssClass = function() {
  return pstj.material.ProgressbarRenderer.CSS_CLASS;
};


/** @inheritDoc */
r.getTemplate = function(model) {
  return pstj.material.template.Progressbar(model);
};


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.Progressbar,
    pstj.material.ProgressbarRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.ProgressbarRenderer.CSS_CLASS, function() {
      return new pstj.material.Progressbar(null);
    });

});  // goog.scope
