// File auto generated, please do not edit!
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

  //Branch for Reload
  if (iconName == pstj.material.icon.Name.RELOAD) {
    return icon.Reload.getInstance();
  }

  //Branch for ArrowDropUp
  if (iconName == pstj.material.icon.Name.ARROW_DROP_UP) {
    return icon.ArrowDropUp.getInstance();
  }

  //Branch for ArrowDropDown
  if (iconName == pstj.material.icon.Name.ARROW_DROP_DOWN) {
    return icon.ArrowDropDown.getInstance();
  }

  //Branch for ExitToApp
  if (iconName == pstj.material.icon.Name.EXIT_TO_APP) {
    return icon.ExitToApp.getInstance();
  }

  //Branch for TrendingDown
  if (iconName == pstj.material.icon.Name.TRENDING_DOWN) {
    return icon.TrendingDown.getInstance();
  }

  //Branch for TrendingNeutral
  if (iconName == pstj.material.icon.Name.TRENDING_NEUTRAL) {
    return icon.TrendingNeutral.getInstance();
  }

  //Branch for TrendingUp
  if (iconName == pstj.material.icon.Name.TRENDING_UP) {
    return icon.TrendingUp.getInstance();
  }

  //Branch for CheckStatic
  if (iconName == pstj.material.icon.Name.CHECK_STATIC) {
    return icon.CheckStatic.getInstance();
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


/** Renderer for Reload */
icon.Reload = goog.defineClass(IR, {
  /**
   * @constructor
   * @extends {IR}
   */
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.icons.Reload(m);
  }
});
goog.addSingletonGetter(icon.Reload);


/** Renderer for ArrowDropUp */
icon.ArrowDropUp = goog.defineClass(IR, {
  /**
   * @constructor
   * @extends {IR}
   */
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.icons.ArrowDropUp(m);
  }
});
goog.addSingletonGetter(icon.ArrowDropUp);


/** Renderer for ArrowDropDown */
icon.ArrowDropDown = goog.defineClass(IR, {
  /**
   * @constructor
   * @extends {IR}
   */
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.icons.ArrowDropDown(m);
  }
});
goog.addSingletonGetter(icon.ArrowDropDown);


/** Renderer for ExitToApp */
icon.ExitToApp = goog.defineClass(IR, {
  /**
   * @constructor
   * @extends {IR}
   */
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.icons.ExitToApp(m);
  }
});
goog.addSingletonGetter(icon.ExitToApp);


/** Renderer for TrendingDown */
icon.TrendingDown = goog.defineClass(IR, {
  /**
   * @constructor
   * @extends {IR}
   */
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.icons.TrendingDown(m);
  }
});
goog.addSingletonGetter(icon.TrendingDown);


/** Renderer for TrendingNeutral */
icon.TrendingNeutral = goog.defineClass(IR, {
  /**
   * @constructor
   * @extends {IR}
   */
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.icons.TrendingNeutral(m);
  }
});
goog.addSingletonGetter(icon.TrendingNeutral);


/** Renderer for TrendingUp */
icon.TrendingUp = goog.defineClass(IR, {
  /**
   * @constructor
   * @extends {IR}
   */
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.icons.TrendingUp(m);
  }
});
goog.addSingletonGetter(icon.TrendingUp);


/** Renderer for CheckStatic */
icon.CheckStatic = goog.defineClass(IR, {
  /**
   * @constructor
   * @extends {IR}
   */
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.icons.CheckStatic(m);
  }
});
goog.addSingletonGetter(icon.CheckStatic);


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
  RELOAD: 'reload',
  ARROW_DROP_UP: 'arrow-drop-up',
  ARROW_DROP_DOWN: 'arrow-drop-down',
  EXIT_TO_APP: 'exit-to-app',
  TRENDING_DOWN: 'trending-down',
  TRENDING_NEUTRAL: 'trending-neutral',
  TRENDING_UP: 'trending-up',
  CHECK_STATIC: 'check-static',
  NONEXISTING: 'nonexisting'
};

});  // goog.scope
