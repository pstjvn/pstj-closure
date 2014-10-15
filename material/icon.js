goog.provide('pstj.material.Icon');

goog.require('goog.dom');
goog.require('goog.object');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.icons');

goog.scope(function() {



/**
 * @constructor
 * @extends {pstj.material.Element}
 * @struct
 * @param {?pstj.material.Icon.Name} icon
 */
pstj.material.Icon = function(icon) {
  console.log('Icon created');
  goog.base(this);
  /**
   * @type {?pstj.material.Icon.Name}
   * @private
   */
  this.iconFn_ = icon || null;
};
goog.inherits(pstj.material.Icon, pstj.material.Element);



/**
 * @constructor
 * @extends {pstj.material.ElementRenderer}
 * @struct
 */
pstj.material.IconRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.IconRenderer, pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.IconRenderer);


/**
 * @type {string}
 * @final
 */
pstj.material.IconRenderer.CSS_CLASS = goog.getCssName('material-icon');


var Icon = pstj.material.Icon;
var _ = pstj.material.Icon.prototype;
var r = pstj.material.IconRenderer.prototype;


/**
 * Getter for the icon, used for decoration/rendering.
 * @return {string}
 */
_.getIcon = function() {
  if (!goog.isNull(this.iconFn_)) {
    return this.iconFn_();
  } else {
    return '';
  }
};


/** @override */
_.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  var vb = '';
  if (goog.isNull(this.iconFn_)) {
    this.iconFn_ = Icon.NameMap[el.getAttribute('icon')];
  }
  vb = ' viewBox="0 0 24 24"';
  el.innerHTML = '<svg' + vb +
      'class="' + goog.getCssName('fit') +
      '" width="100%" hight="100%" preserveAspectRatio="xMidYMid meet">' +
      this.getIcon() + '</svg>';
};


/** @override */
r.getCssClass = function() {
  return pstj.material.IconRenderer.CSS_CLASS;
};


/**
 * The decoration template to use based on the name of the icon.
 * @enum {!function(Object): string}
 */
Icon.Name = {
  WARNING: pstj.material.icons.warning,
  ACCESSIBILITY: pstj.material.icons.accessibility
};


/**
 * @type {Object.<string, Icon.Name>}
 */
Icon.NameMap = goog.object.create(
    'warning', Icon.Name.WARNING,
    'accessibility', Icon.Name.ACCESSIBILITY);


goog.ui.registry.setDefaultRenderer(pstj.material.Icon,
    pstj.material.IconRenderer);


goog.ui.registry.setDecoratorByClassName(
    pstj.material.IconRenderer.CSS_CLASS, function() {
      return new pstj.material.Icon(null);
    });

});  // goog.scope
