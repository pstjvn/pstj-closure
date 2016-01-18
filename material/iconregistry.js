goog.provide('pstj.material.icons.registry');

goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.string');

goog.scope(function() {
var registry = pstj.material.icons.registry;


/**
 * @define {boolean} If set to true the system will prefer the static names of
 * icons instead of the ones that can mutate.
 */
goog.define('pstj.material.icons.registry.PREFER_STATICS', false);


/**
 * @final {goog.log.Logger}
 * @protected
 */
registry.logger = goog.log.getLogger('pstj.material.icons.registry');


/**
 * Given an icon name as a string, attempts to resolve it to an icon renderer
 * that knows how to render the given icon to DOM using SVG.
 *
 * @param {string} iconName
 * @return {?pstj.material.IconRenderer}
 */
registry.getRenderer = function(iconName) {
  var renderer = null;
  if (pstj.material.icons.registry.PREFER_STATICS) {
    var name = iconName;
    if (!goog.string.endsWith(name, 'static')) name = name + '-static';
    if (goog.object.containsKey(registry.renderers_, name)) {
      renderer = goog.object.get(registry.renderers_, name);
    } else {
      renderer = goog.object.get(registry.renderers_, iconName);
    }
  } else {
    renderer = goog.object.get(registry.renderers_, iconName);
  }
  if (goog.isDefAndNotNull(renderer)) return renderer;
  goog.log.error(registry.logger, 'Did not find renderer for icon: ' +
      iconName);
  return null;
};


/**
 * Register a renderer instance as one being able to render an icon with
 * a given name.
 *
 * @param {string} iconName The name of the icon the renderer can render.
 * @param {!pstj.material.IconRenderer} rendererInstance
 */
registry.setRenderer = function(iconName, rendererInstance) {
  goog.object.set(registry.renderers_, iconName, rendererInstance);
};


/**
 * Holds references to registered renderers for specific icon names.
 *
 * Note that one and same renderer can be used for multiple icon names, but
 * the reverse is not true, one name can match only one renderer.
 *
 * Alternatives for static (non-mutable) renderers is provide via the
 * #setAlternativeRenderer method. On runtime or on compile time the correct
 * object will be provided to query the renderers from.
 *
 * @private
 * @type {!Object<string, pstj.material.IconRenderer>}
 */
registry.renderers_ = {};

});  // goog.scope
