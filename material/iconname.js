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

  //Branch for Close
  if (iconName == pstj.material.icon.CLOSE ||
      iconName == pstj.material.icon.MENU ||
      iconName == pstj.material.icon.PLUS ||
      iconName == pstj.material.icon.CLOSE ||
      iconName == pstj.material.icon.BACK_ARROW ||
      iconName == pstj.material.icon.CHECK) {
    return icon.Close.getInstance();
  }

  //Branch for User
  if (iconName == pstj.material.icon.USER) {
    return icon.User.getInstance();
  }

  //Branch for ForwardArrow
  if (iconName == pstj.material.icon.FORWARD_ARROW ||
      iconName == pstj.material.icon.WARNING) {
    return icon.ForwardArrow.getInstance();
  }

  return null;
};


/** Renderer for Close */
icon.Close = goog.defineClass(IR, {
  /**
   * @constructor
   * @extends {IR}
   */
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.icons.Close(m);
  }
});
goog.addSingletonGetter(icon.Close);


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


/** Renderer for ForwardArrow */
icon.ForwardArrow = goog.defineClass(IR, {
  /**
   * @constructor
   * @extends {IR}
   */
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.icons.ForwardArrow(m);
  }
});
goog.addSingletonGetter(icon.ForwardArrow);


/**
 * Enumerates the names of the icons we know of.
 * @enum {string}
 */
icon.Name = {
  NONE: 'none',
  CLOSE: 'close',
  MENU: 'menu',
  PLUS: 'plus',
  CLOSE: 'close',
  BACK_ARROW: 'back-arrow',
  CHECK: 'check',
  USER: 'user',
  FORWARD_ARROW: 'forward-arrow',
  WARNING: 'warning',
  NONEXISTING: 'nonexisting'
};

});  // goog.scope
