goog.provide('pstj.ui.ListItemRenderer');

goog.require('goog.asserts');
goog.require('pstj.configure');
goog.require('pstj.ds.ListItem');
goog.require('pstj.templates');
goog.require('pstj.ui.ControlRenderer');



/**
 * My new class description
 * @constructor
 * @extends {pstj.ui.ControlRenderer}
 */
pstj.ui.ListItemRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.ui.ListItemRenderer, pstj.ui.ControlRenderer);
goog.addSingletonGetter(pstj.ui.ListItemRenderer);


/**
 * @const
 * @type {string}
 */
pstj.ui.ListItemRenderer.CSS_CLASS = goog.getCssName('pstj-list-item');


/**
 * The default thumbnail for the list item renderer.
 * @type {string}
 * @protected
 */
pstj.ui.ListItemRenderer.prototype.defaultThumbnail = goog.asserts.assertString(
    pstj.configure.getRuntimeValue('THUMBNAIL',
    'assets/default-select-image.png',
    'PSTJ.WIDGET.LISTITEM').toString());


/** @inheritDoc */
pstj.ui.ListItemRenderer.prototype.getTemplate = function(control) {
  return pstj.templates.listitem(this.generateTemplateData(control));
};


/** @inheritDoc */
pstj.ui.ListItemRenderer.prototype.getCssClass = function() {
  return pstj.ui.ListItemRenderer.CSS_CLASS;
};


/** @inheritDoc */
pstj.ui.ListItemRenderer.prototype.generateTemplateData = function(comp) {
  goog.asserts.assertInstanceof(comp.getModel(), pstj.ds.ListItem);
  var model = goog.base(this, 'generateTemplateData', comp);
  return {
    thumbnail: model['thumbnail'] || this.defaultThumbnail,
    name: model['publishName'] || '&nbsp;'
  };
};


