goog.provide('pstj.ui.ListItemTemplate');

goog.require('pstj.ui.Template');
goog.require('pstj.templates');
goog.require('pstj.ds.ListItem');
/**
 * My new class description
 * @constructor
 * @extends {pstj.ui.Template}
 */
pstj.ui.ListItemTemplate = function() {
  goog.base(this);
};
goog.inherits(pstj.ui.ListItemTemplate, pstj.ui.Template);
goog.addSingletonGetter(pstj.ui.ListItemTemplate);

goog.scope(function() {

  var _ = pstj.ui.ListItemTemplate.prototype;

  /** @inheritDoc */
  _.getTemplate = function(model) {
    return pstj.templates.listitem(model);
  };

  /** @inheritDoc */
  _.generateTemplateData = function(component) {
    var model = goog.asserts.assertInstanceof(component.getModel(),
      pstj.ds.ListItem, 'List item control view can only be generated from ' +
      'list item data structure');
    return {
      thumbnail: model.getProp('thumbnail'),
      name: model.getProp('name')
    };
  };
});

