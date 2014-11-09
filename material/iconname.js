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

  if (iconName == icon.Name.MENU || iconName == icon.Name.PLUS ||
      iconName == icon.Name.CLOSE || iconName == icon.Name.CHECK ||
      iconName == icon.Name.BACK_ARROW) {
    return icon.Menu.getInstance();
  }

  if (iconName == icon.Name.USER) {
    return icon.User.getInstance();
  }

  if (iconName == icon.Name.WARNING) {
    return icon.Warning.getInstance();
  }

  return null;

};


/** Menu icon */
icon.Menu = goog.defineClass(IR, {
  /**
   * @constructor
   * @struct
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


/** User icon */
icon.User = goog.defineClass(IR, {
  /**
   * @constructor
   * @struct
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


/** Warning icon */
icon.Warning = goog.defineClass(IR, {
  /**
   * @constructor
   * @struct
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


/**
 * Enumerates the names of the icons we know of.
 * @enum {string}
 */
icon.Name = {
  NONE: 'none',
  // MenuIcon
  MENU: 'menu',
  PLUS: 'plus',
  CLOSE: 'close',
  CHECK: 'check',
  BACK_ARROW: 'arrow',
  // UserIcon
  USER: 'user',
  // Warning
  WARNING: 'warning'
};

});  // goog.scope
