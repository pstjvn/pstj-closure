/**
 * @fileoverview Provides transform / translate helpers based on real features
 * instead of browser sniffing. This should replace the {@link pstj.style.css}
 * collection of utilities as it is more accurate. For now the code is under
 * the lab name space but once tested will replace the original {@link
 * pstj.style.css} code.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.lab.style.css');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.userAgent');
goog.require('pstj.configure');

/**
 * Globally forced 2d for translations.
 * @type {boolean}
 */
pstj.lab.style.css.FORCE_2D = goog.asserts.assertBoolean(
    pstj.configure.getRuntimeValue('FORCE_2D', false, 'PSTJ.CSS'));


/**
 * The DIV element to use for the tests. It will never be cleaned up, but is a
 *   good trade off compared to creating a new DIV for each test.
 * @type {Element}
 * @private
 */
pstj.lab.style.css.testDiv_ = document.createElement('div');


/**
 * Test for a supported named property among prefixed properties in the style
 *   object.
 * @param {!Array.<string>} names The list of style property names to select
 *   one from.
 * @return {?string} The property name that is supported or null.
 * @private
 */
pstj.lab.style.css.getSupportedName_ = function(names) {
  var result = null;
  for (var i = 0; i < names.length; i++) {
    if (typeof pstj.lab.style.css.testDiv_.style[names[i]] != 'undefined') {
      result = names[i];
      break;
    }
  }
  return result;
};


/**
 * List of transform properties know in the browsers.
 * @type {!Array.<string>}
 * @private
 */
pstj.lab.style.css.transforms_ = [
  'transform',
  'msTransform',
  'MozTransform',
  'WebkitTransform',
  'OTransform'
];


/**
 * List of prefixes style properties used in style text. This is used directly
 *   because the camel case is not always accurate when transforming the
 *   prefixes properties.
 * @type {!Array.<string>}
 * @private
 */
pstj.lab.style.css.transformsWithPrefixes_ = [
  'transform',
  '-ms-transform',
  '-moz-transform',
  '-webkit-transform',
  '-o-trasnform'
];


/**
 * List of transition names used in browsers.
 * @type {!Array.<string>}
 * @private
 */
pstj.lab.style.css.transitions_ = [
  'transition',
  'msTransition',
  'MozTransition',
  'WebkitTransition',
  'OTransition'
];


/**
 * Whether 3d transforms are supported on the platform.
 * @type {!boolean}
 */
pstj.lab.style.css.supports3d = (function() {
  // if we are using firefox it has some issues on linux drivers,
  if (goog.userAgent.GECKO && (goog.userAgent.LINUX || goog.userAgent.X11)) {
    // alert(goog.userAgent.LINUX + ' ' + goog.userAgent.X11);
    return false;
  }
  if (pstj.lab.style.css.FORCE_2D) return false;
  var res = pstj.lab.style.css.getSupportedName_([
    'perspective',
    'perspectiveProperty',
    'WebkitPerspective']);
  if (res != null) return true;
  return false;
})();


/**
 * The prefix that can be used on the target platform to apply CSS
 *   transformation.
 * @type {?string}
 */
pstj.lab.style.css.transformPrefix = pstj.lab.style.css.getSupportedName_(
    pstj.lab.style.css.transforms_);


/**
 * The prefix to use on the target platform to apply CSS transition.
 * @type {?string}
 */
pstj.lab.style.css.transitionPrefix = pstj.lab.style.css.getSupportedName_(
    pstj.lab.style.css.transitions_);


/**
 * Flag if the target platform supports CSS transformation.
 * @type {!boolean}
 */
pstj.lab.style.css.canUseTransform = (goog.isNull(
    pstj.lab.style.css.transformPrefix)) ? false : true;


/**
 * Flag indicating if the target platform supports CSS transitions.
 * @type {!boolean}
 */
pstj.lab.style.css.canUseTransition = (goog.isNull(
    pstj.lab.style.css.transitionPrefix)) ? false : true;


/**
 * The transform prefix to use in a style text (in style sheet or setting the
 *   style property as text).
 * @type {!string}
 * @private
 */
pstj.lab.style.css.transformStyleSheetName_ = pstj.lab.style.css
    .transformsWithPrefixes_[goog.array.indexOf(
    pstj.lab.style.css.transforms_, pstj.lab.style.css.transformPrefix)];


/**
 * Cached version of the translation string. We need it as the actual string
 * cannot be determined at compile time so we need to cache it manually.
 *
 * @type {string}
 * @private
 */
pstj.lab.style.css.transformationPrefix_ = (function() {
  var res = '';
  if (pstj.lab.style.css.canUseTransform) {
    if (pstj.lab.style.css.supports3d) {
      res = 'translate3d(';
    } else {
      res = 'translate(';
    }
  }
  return res;
})();


/**
 * The suffix to use to close the style string.
 *
 * @type {string}
 * @private
 */
pstj.lab.style.css.transformationSuffix_ = (function() {
  var res = '';
  if (pstj.lab.style.css.canUseTransform) {
    if (pstj.lab.style.css.supports3d) {
      res = ', 0)';
    } else {
      res = ')';
    }
  }
  return res;
})();


/**
 * Calculates translation to coordinates and returns it as a value that can be
 *   directly set to the transform style property of the element.
 *
 * Example: // Will shift the element 100% of its width and height.
 *   mydivReference.style.transform =
 *   pstj.lab.style.css.getTranslationAsValue(100, 100, '%');
 *
 * @param {!number} x The X offset to apply with the translation.
 * @param {!number} y The Y offset to apply with the translation.
 * @param {string} unit The unit to use, if not provided pixels will be
 * used.
 * @return {!string} The value to apply to the transform style property. If
 *   transforms are not supported on the target system empty string will be
 *   returned, so make sure to check for that first.
 */
pstj.lab.style.css.getTranslationAsValue = function(x, y, unit) {
  return pstj.lab.style.css.transformationPrefix_ + x + unit + ',' + y +
      unit + pstj.lab.style.css.transformationSuffix_;
};


/**
 * Calculates translation of an element to X/Y coordinates. If the target
 *   platform does not support CSS transform, top / left properties will be
 *   used. The method will return CSS text string to be applied via a style
 *   sheet or applied to the style property of an element.
 *
 * Example: // move the element to 10 / 10 pixels. mydiv.setAttribute('style',
 *   pstj.lab.style.css.getTranslationAsText(10,10));
 *
 * @param {!number} x The X offset to use.
 * @param {!number} y The Y offset to use.
 * @param {string=} opt_unit Optional unit to use for the translation. If not
 *   provided pixels will be sued.
 * @return {!string} The style to apply on the style property of an element or
 *   in a style sheet to translate the element to the desired coordinates.
 */
pstj.lab.style.css.getTranslationAsText = function(x, y, opt_unit) {
  if (typeof opt_unit != 'string') opt_unit = 'px';
  var translate = pstj.lab.style.css.getTranslationAsValue(x, y, opt_unit);
  if (pstj.lab.style.css.canUseTransform) {
    translate = pstj.lab.style.css.transformStyleSheetName_ + ':' + translate;
  } else {
    translate = (x !== 0) ? 'top:' + y + opt_unit + ';' : '';
    translate = translate + (y !== 0) ? 'left:' + x + opt_unit + ';' : '';
  }
  return translate;
};


/**
 * Apply transformation to an element to a set of new coordinates. If the
 *   target platform does not support CSS transformation, top / left style
 *   properties will be used.
 * @param {Element} el The element to translate.
 * @param {!number} x The X translation value.
 * @param {!number} y The Y translation value.
 * @param {string=} opt_unit The units to use to calculate the translation. If
 * not provided pixels will be used.
 * @param {string=} opt_appendage Additional string to append to the
 *   transformation value (for example if you want to combine several
 *   transformations, you can provide them here as string). Note that those
 *   will NOT be aplpied if transformation is not supported.
 */
pstj.lab.style.css.setTranslation = function(el, x, y, opt_unit,
    opt_appendage) {
  // If the provided element is not really a DOM element, do nothing.
  if (goog.DEBUG) {
    if (!goog.dom.isElement(el)) return;
  }

  if (!goog.isString(opt_unit)) opt_unit = 'px';

  if (pstj.lab.style.css.canUseTransform) {
    el.style[pstj.lab.style.css.transformPrefix] = pstj.lab.style.css
        .getTranslationAsValue(x, y, opt_unit) + (goog.isString(opt_appendage) ?
            opt_appendage : '');
  } else {
    el.style.top = y + opt_unit;
    el.style.left = x + opt_unit;
  }
};


/**
 * Sets the translation directly on the element without checks if it is valid
 * @param {Element} el
 * @param {string} translation
 */
pstj.lab.style.css.setTranslationText = function(el, translation) {
  if (pstj.lab.style.css.canUseTransform) {
    el.style[pstj.lab.style.css.transformPrefix] = translation;
  }
};


/**
 * Clears the translation applied so that parent/css translation can overtake.
 * @param {Element} el The element to operate on.
 */
pstj.lab.style.css.clearTranslation = function(el) {
  if (pstj.lab.style.css.canUseTransform) {
    el.style[pstj.lab.style.css.transformPrefix] = '';
  } else {
    el.style.top = '0';
    el.style.left = '0';
  }
};


/**
 * Clean up as we do not need the div anymore and it is retained...
 * @private
 */
pstj.lab.style.css.testDiv_ = null;
