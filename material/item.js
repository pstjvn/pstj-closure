goog.provide('pstj.material.Item');
goog.provide('pstj.material.ItemRenderer');

goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.template');

goog.scope(function() {



/**
 * Provides thre 'item' element - used only for styling of a simple core
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
pstj.material.Item = function(opt_content, opt_renderer, opt_domHelper) {
  goog.base(this, opt_content, opt_renderer, opt_domHelper);
};
goog.inherits(pstj.material.Item, pstj.material.Element);


/**
 * Constructs a new instance from a JSON config.
 * @param {MaterialConfig} json
 * @return {pstj.material.Item}
 */
pstj.material.Item.fromJSON = function(json) {
  var i = new pstj.material.Item(json.content);
  pstj.material.Element.setupAdditionalClasses(i, json);
  return i;
};



/**
 * @constructor
 * @extends {pstj.material.ElementRenderer}
 * @struct
 */
pstj.material.ItemRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.ItemRenderer, pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.ItemRenderer);


/**
 * @type {string}
 * @final
 */
pstj.material.ItemRenderer.CSS_CLASS = goog.getCssName('core-item');


var r = pstj.material.ItemRenderer.prototype;


/** @inheritDoc */
r.getCssClass = function() {
  return pstj.material.ItemRenderer.CSS_CLASS;
};


/** @inheritDoc */
r.getTemplate = function(model) {
  return pstj.material.template.Item(model);
};


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.Item,
    pstj.material.ItemRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.ItemRenderer.CSS_CLASS, function() {
      return new pstj.material.Item(null);
    });

});  // goog.scope
