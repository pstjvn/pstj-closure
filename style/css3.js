goog.provide('pstj.lab.style.css');

goog.require('goog.array');
goog.require('goog.dom');

/**
 * @fileoverview Provides transform / translate helpers based on real features
 * instead of browser sniffing. This should replace the {@link pstj.style.css}
 * collection of utilities as it is more accurate. For now the code is under
 * the lab name space but once tested will replace the original {@link
 * pstj.style.css} code.
 *
 * @author  regardingscot@gmail.com (Peter StJ)
 */


goog.scope(function() {
	var css = pstj.lab.style.css;

	/**
	 * The DIV element to use for the tests. It will never be cleaned up, but is a good trade off compared to
	 * creating a new DIV for each test.
	 *
	 * @type {Element}
	 *
	 * @private
	 */
	css.testDiv_ = document.createElement('div');

	/**
	 * Test for a supported named property among prefixed properties in the style object.
	 *
	 * @param {!Array.<string>} names The list of style property names to select one from.
	 *
	 * @return {?string} The property name that is supported or null.
	 *
	 * @private
	 */
	css.getSupportedName_ = function(names) {
		var result = null;
		for (var i = 0; i < names.length; i++) {
			if (typeof css.testDiv_.style[names[i]] != 'undefined') {
				result = names[i];
				break;
			}
		}
		return result;
	};

	/**
	 * List of transform properties know in the browsers.
	 *
	 * @type {!Array.<string>}
	 *
	 * @private
	 */
	css.transforms_ = [
		'transform',
    'msTransform',
    'MozTransform',
    'WebkitTransform',
    'OTransform'
  ];

  /**
   * List of prefixes style properties used in style text. This is used
   * directly because the camel case is not always accurate when transforming
   * the prefixes properties.
   *
   * @type {!Array.<string>}
   *
   * @private
   */
  css.transformsWithPrefixes_ = [
		'transform',
    '-ms-transform',
    '-moz-transform',
    '-webkit-transform',
    '-o-trasnform'
  ];

  /**
   * List of transition names used in browsers.
   *
   * @type {!Array.<string>}
   *
   * @private
   */
  css.transitions_ = [
 		'transition',
    'msTransition',
    'MozTransition',
    'WebkitTransition',
    'OTransition'
  ];

  /**
   * Whether 3d transforms are supported on the platform.
   *
   * @type {!boolean}
   *
   * @public
   */
  css.supports3d = (function() {
  	var res = css.getSupportedName_([
  	                                'perspective', 
  	                                'perspectiveProperty', 
  	                                'WebkitPerspective']);
    if (res != null) return true;
    return false;
  })();

  /**
   * The prefix that can be used on the target platform to apply CSS transformation.
   *
   * @type {?string}
   *
   * @public
   */
  css.transformPrefix = css.getSupportedName_(css.transforms_);

  /**
   * The prefix to use on the target platform to apply CSS transition.
   *
   * @type {?string}
   *
   * @public
   */
  css.transitionPrefix = css.getSupportedName_(css.transitions_);

  /**
   * Flag if the target platform supports CSS transformation.
   *
   * @type {!boolean}
   *
   * @public
   */
  css.canUseTransform = (goog.isNull(css.transformPrefix)) ? false : true;

	/**
	 * Flag indicating if the target platform supports CSS transitions.
	 *
	 * @type {!boolean}
	 *
	 * @public
	 */
	css.canUseTransition = (goog.isNull(css.transitionPrefix)) ? false : true;

	/**
	 * The transform prefix to use in a style text (in style sheet or setting the style property as text).
	 *
	 * @type {!string}
	 *
	 * @private
	 */
	css.transformStyleSheetName_ = css.transformsWithPrefixes_[goog.array.indexOf(
			  css.transforms_, css.transformPrefix)];

	/**
	 * Calculates translation to coordinates and returns it as a value that can
	 * be directly set to the transform style property of the element.
	 *
	 * Example:
	 * // Will shift the element 100% of its width and height.
	 * mydivReference.style.transform = css.getTranslationAsValue(100, 100, '%');
	 *
	 * @public
	 *
	 * @param {!number} x The X offset to apply with the translation.
	 * @param {!number} y The Y offset to apply with the translation.
	 * @param {string=} unit The unit to use, if not provided pixels will be
	 * used.
	 *
	 * @return {!string} The value to apply to the transform style property. If
	 * transforms are not supported on the target system empty string will be
	 * returned, so make sure to check for that first.
	 */
	css.getTranslationAsValue = function(x, y, unit) {
		var translate = '';
		if (!goog.isString(unit)) unit = 'px';
    // Use 3d transforms where available.
    if (css.canUseTransform) {
      if (css.supports3d) {
        translate = 'translate3d(';
      } else {
        translate = 'translate(';
      }
    } else {
      return translate;
    }

    translate = translate + x + unit + ',' + y + unit;

    // Complement the 3d with closing Z axis 0;
    if (css.supports3d) {
      translate = translate + ',0';
    }

    translate = translate + ')';

    return translate;
	};

	/**
	 * Calculates translation of an element to X/Y coordinates. If the target
	 * platform does not support CSS transform, top / left properties will be
	 * used. The method will return CSS text string to be applied via a style
	 * sheet or applied to the style property of an element.
	 *
	 * Example: // move the element to 10 / 10 pixels.
	 * mydiv.setAttribute('style', css.getTranslationAsText(10,10));
	 *
	 * @param {!number} x The X offset to use.
	 * @param {!number} y The Y offset to use.
	 * @param {string=} unit Optional unit to use for the translation. If not
	 * provided pixels will be sued.
	 *
	 * @return {!string} The style to apply on the style property of an element
	 * or in a style sheet to translate the element to the desired coordinates.
	 *
	 * @public
	 */
	css.getTranslationAsText = function(x, y, unit) {
		if (typeof unit != 'string') unit = 'px';
    var translate = css.getTranslationAsValue(x, y, unit);
    if (css.canUseTransform) {
      translate = css.transformStyleSheetName_ + ':' + translate;
    } else {
      translate = (x !== 0) ? 'top:'+ y + unit + ';' : '';
      translate = translate + (y !== 0) ? 'left:' + x + unit + ';' : '';
    }
    return translate;
	};

	/**
	 * Apply transformation to an element to a set of new coordinates. If the
	 * target platform does not support CSS transformation, top / left style
	 * properties will be used.
	 *
	 * @param {Element} el The element to translate.
	 * @param {!number} x The X translation value.
	 * @param {!number} y The Y translation value.
	 * @param {string=} unit The units to use to calculate the translation. If
	 * not provided pixels will be used.
	 *
	 * @public
	 */
	css.setTranslation = function(el, x, y, unit) {
		// If the provided element is not really a DOM element, do nothing.
		if (!goog.dom.isElement(el)) return;

		if (!goog.isString(unit)) unit = 'px';

		if (css.canUseTransform) {
			el.style[css.transformPrefix] = css.getTranslationAsValue(x, y, unit);
		} else {
			el.style.top = y + unit;
			el.style.left = x + unit;
		}
	};
});
