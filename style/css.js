goog.provide('pstj.style.css');

goog.require('goog.dom');
goog.require('goog.userAgent');
goog.require('goog.userAgent.product');

/**
 * @fileoverview Provides utilities for CSS declarative interface handling. Main
 * usage could be as follow.<code>css.getTranslation(Xoffset, Yoffset)</code> should return:
 *  <pre>
 *    [-*-]transform[3d]: translate*:(Xpx,Ypx[,Zpx]);
 * </pre>
 * NOTE: capabilities are declaratively determined using the caniuse.com
 * lists. No actual checks are performed to be use if a property actually
 * works.
 * @author  regardingscot@gmail.com (Peter StJ)
 */

/**
 * Will be true if the host supports transform. Information deducted from
 *   canIuse.com.
 * @type {boolean}
 */
pstj.style.css.canUseTransform = (function() {
  if (goog.userAgent.product.IPHONE || goog.userAgent.product.IPAD) {
    if (goog.userAgent.VERSION > 3.2) return true;
  }
  if ((goog.userAgent.product.FIREFOX && goog.userAgent.VERSION >= 3.6) ||
    (goog.userAgent.product.CHROME && goog.userAgent.VERSION >= 19) ||
    (goog.userAgent.product.IE && goog.userAgent.VERSION >= 9) ||
    (goog.userAgent.product.SAFARI && goog.userAgent.VERSION >= 5.1)) {
    return true;
  }
  return false;
})();


/**
 * True is the host supports 3d transforms.
 * Information deducted from canIuse.com
 * @type {boolean}
 */
pstj.style.css.canUseTransform3d = (function() {
  if (goog.userAgent.product.IPHONE || goog.userAgent.product.IPAD) {
    if (goog.userAgent.VERSION > 3.2) return true;
  }
  if ((goog.userAgent.product.FIREFOX && goog.userAgent.VERSION >= 12) ||
    (goog.userAgent.product.CHROME && goog.userAgent.VERSION >= 19) ||
    (goog.userAgent.product.IE && goog.userAgent.VERSION >= 10) ||
    (goog.userAgent.product.SAFARI && goog.userAgent.VERSION >= 5.1)) {
    return true;
  }
  return false;
})();


/**
 * Contains the appropriate transform prefix for the host.
 * @type {string}
 */
pstj.style.css.cssTransformPrefix = (function() {
  if (goog.userAgent.WEBKIT) {
    return '-webkit-transform';
  } else if (goog.userAgent.GECKO) {
    return '-moz-transform';
  } else if (goog.userAgent.IE) {
    return '-ms-transform';
  } else {
    return 'transform';
  }
})();


/**
 * Contains the possible transformation orientation enumeration.
 * Useful to determine the way to perform the calculations for the
 * transformation.
 * @enum {number}
 */
pstj.style.css.TransformOrientation = {
  VERTICAL: 0,
  HORIZONTAL: 1,
  BOTH: 2
};

/**
 * Generates translation string. Suitable for direct style accessors/setters.
 *
 * @param  {!number} x    The X translation.
 * @param  {!number} y    The Y translation.
 * @param  {string=} unit The units to use.
 * @return {!string}      The generated translation string.
 */
pstj.style.css.getTranslationAsValue = function(x, y, unit) {
  if (!goog.isString(unit)) unit = 'px';
  var translate;
  if (pstj.style.css.canUseTransform3d) {
    translate = 'translate3d(';
  } else if (pstj.style.css.canUseTransform) {
    translate = 'translate(';
  } else {
    return '';
  }

  translate += x + unit + ',' + y + unit;
  if (pstj.style.css.canUseTransform3d) {
    translate += ',0';
  }
  translate += ')';

  return translate;
};

/**
 * Function that accepts the parameters for the desired transformation and
 * returns the appropriate style to be applied to achieve it via
 * pstj.style.css.
 * @param {!number} valuex The X transformation value.
 * @param {!number} valuey The Y transformation value to use.
 * @param {string=} unit The unit to use.
 * @return {string} The calculated style to apply in order to achieve the
 * desired transformation.
 */
pstj.style.css.getTranslation = function(valuex, valuey, unit) {
  unit = unit || 'px';
  var translate;
  if (pstj.style.css.canUseTransform3d) {
    translate = ':translate3d(';
  } else if (pstj.style.css.canUseTransform) {
    translate = ':translate(';
  } else {
    translate = '';
  }

  if (translate != '') {
    translate += valuex + unit + ',' + valuey + unit;
    if (pstj.style.css.canUseTransform3d) {
      translate += ',0';
    }
    translate += ');';
  } else {
    // translation is not supported in css, use top/left
    translate = (valuex != 0) ? 'top:valuex' + unit + ';' : '';
    translate += (valuey != 0) ? 'left:valuey' + unit + ';' : '';
  }

  return ((pstj.style.css.canUseTransform) ?
    pstj.style.css.cssTransformPrefix : '') +
    translate;
};

/**
 * Sets the translation of an element. Uses CSS tranform where possible with
 * 3D where possible.
 * @param {Element} el The element to translate.
 * @param {!number} valuex  The X translation.
 * @param {!number} valuey The Y translation.
 * @param {string=} unit Translation usnits to use.
 */
pstj.style.css.setTranslation = function(el, valuex, valuey, unit) {
  if (!goog.dom.isElement(el)) throw new Error('Cannot set transformation on' +
    ' non Element');
  if (pstj.style.css.canUseTransform) {
    if (valuex == 0) {
      el.style[goog.string.toCamelCase(pstj.style.css.cssTransformPrefix)] = '';
    } else {
    el.style[goog.string.toCamelCase(pstj.style.css.cssTransformPrefix)] =
      pstj.style.css.getTranslationAsValue(valuex, valuey, unit);
    }
  } else {
    el.style.left = valuex + 'px';
    el.style.top = valuey + 'px';
  }
};
