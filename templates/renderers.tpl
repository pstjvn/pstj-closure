goog.provide('pstj.material.icon');

goog.require('pstj.material.IconRenderer');
//INSERTION

goog.scope(function() {
var icon = pstj.material.icon;
var IR = pstj.material.IconRenderer;


/**
 * Attempts to resolve the icon to a renderer that can handle it.
 * @param {icon.Name} iconName
 * @return {pstj.material.IconRenderer}
 */
icon.resolveRenderer = function(iconName) {
  if (iconName == icon.Name.NONE) {
    // all renderers should support the NONE type
    return null;
  }

//INSERTION
  return null;
};


//INSERTION
/**
 * Enumerates the names of the icons we know of.
 * @enum {string}
 */
icon.Name = {
  NONE: 'none',
//INSERTION
  NONEXISTING: 'nonexisting'
};

});  // goog.scope
