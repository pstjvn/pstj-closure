goog.provide('pstj.material.decorator');

goog.require('pstj.material.Button');
goog.require('pstj.material.Checkbox');
goog.require('pstj.material.Element');
goog.require('pstj.material.Fab');
goog.require('pstj.material.HeaderPanel');
goog.require('pstj.material.HeaderPanelHeader');
goog.require('pstj.material.HeaderPanelMain');
goog.require('pstj.material.Input');
goog.require('pstj.material.Item');
goog.require('pstj.material.Progressbar');
goog.require('pstj.material.RadioGroup');
goog.require('pstj.material.ToggleButton');


goog.scope(function() {


var _ = pstj.material.decorator;


/**
 * Providing an UI structure builds the corresponding material UI.
 * @param {MaterialUIList} json
 * @param {pstj.material.Element} root
 */
_.create = function(json, root) {

  // Handle intrinsic root element.
  if (goog.isNull(root)) {
    root = pstj.material.Element.fromJSON(/** @type {MaterialConfig} */ ({
      classNames: 'fit'
    }), null);
    root.render();
  }
  // Iterate over all elements and in the list and add them to the designated
  // root instance.
  goog.array.forEach(json, function(item) {
    var me = _.create_(item);
    root.addChild(me, true);
    if (goog.isDef(item.elements)) {
      _.create(item.elements, me);
    }
  });
};


/**
 * Create a particular element
 * @param {MaterialUIItem} item
 * @private
 */
_.create_ = function(item) {
  console.log('Creating: ' + item.type);
  switch (item.type) {
    case 'checkbox':
      return pstj.material.Checkbox.fromJSON(item.config);
    case 'header-panel-main':
      return pstj.material.HeaderPanelMain.fromJSON(item.config);
    case 'header-panel':
      return pstj.material.HeaderPanel.fromJSON(item.config);
    case 'header-panel-header':
      return new pstj.material.HeaderPanelHeader();
    case 'button':
      return pstj.material.Button.fromJSON(item.config);
    case 'fab':
      return pstj.material.Fab.fromJSON(item.model);
    case 'form':
      return new pstj.material.Element();
    case 'input':
      return pstj.material.Input.fromJSON(
          /** @type {MaterialInputConfig} */ (item.config));
    case 'radiogroup':
      return pstj.material.RadioGroup.fromJSON(
          /** @type {RadioGroupConfig} */ (item.config));
    case 'item':
      return pstj.material.Item.fromJSON(
          /** @type {MaterialConfig} */ (item.config));
    case 'label':
      return pstj.material.Element.fromJSON(
          /** @type {MaterialConfig} */ (item.config), null);
    case 'togglebutton':
      return pstj.material.ToggleButton.fromJSON(
          /** @type {ToggleButtonConfig} */ (item.config));
    case 'progressbar':
      var i = new pstj.material.Progressbar();
      if (item.config && goog.isDef(item.config.state)) {
        switch (item.config.state) {
          case 1:
            i.setTransitioning(true);
            break;
          case 2:
            i.setEmpty(false);
            break;
        }
      }
      return i;
    default:
      throw Error('Unrecognized component');

  }
};

});  // goog.scope
