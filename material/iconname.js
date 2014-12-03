//File auto generated, please do not edit!
goog.provide('pstj.material.icon');

goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons');

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

  //Branch for Menu
  if (iconName == pstj.material.icon.Name.MENU ||
      iconName == pstj.material.icon.Name.CLOSE ||
      iconName == pstj.material.icon.Name.PLUS ||
      iconName == pstj.material.icon.Name.CHECK ||
      iconName == pstj.material.icon.Name.BACK_ARROW ||
      iconName == pstj.material.icon.Name.FORWARD_ARROW) {
    return icon.Menu.getInstance();
  }

  //Branch for User
  if (iconName == pstj.material.icon.Name.USER) {
    return icon.User.getInstance();
  }

  //Branch for Warning
  if (iconName == pstj.material.icon.Name.WARNING) {
    return icon.Warning.getInstance();
  }

  //Branch for CastReady
  if (iconName == pstj.material.icon.Name.CAST_READY ||
      iconName == pstj.material.icon.Name.CAST_ACTIVE) {
    return icon.CastReady.getInstance();
  }

  return null;
};


/** Renderer for Menu */
icon.Menu = goog.defineClass(IR, {
  /**
   * @constructor
   * @extends {IR}
   */
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.icons.Menu(m);
  }
});
goog.addSingletonGetter(icon.Menu);


/** Renderer for User */
icon.User = goog.defineClass(IR, {
  /**
   * @constructor
   * @extends {IR}
   */
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.icons.User(m);
  }
});
goog.addSingletonGetter(icon.User);


/** Renderer for Warning */
icon.Warning = goog.defineClass(IR, {
  /**
   * @constructor
   * @extends {IR}
   */
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.icons.Warning(m);
  }
});
goog.addSingletonGetter(icon.Warning);


/** Renderer for CastReady */
icon.CastReady = goog.defineClass(IR, {
  /**
   * @constructor
   * @extends {IR}
   */
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.icons.CastReady(m);
  }
});
goog.addSingletonGetter(icon.CastReady);


/**
 * Enumerates the names of the icons we know of.
 * @enum {string}
 */
icon.Name = {
  NONE: 'none',
  MENU: 'menu',
  CLOSE: 'close',
  PLUS: 'plus',
  CHECK: 'check',
  BACK_ARROW: 'back-arrow',
  FORWARD_ARROW: 'forward-arrow',
  USER: 'user',
  WARNING: 'warning',
  CAST_READY: 'cast-ready',
  CAST_ACTIVE: 'cast-active',
  NONEXISTING: 'nonexisting'
};

});  // goog.scope
