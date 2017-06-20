goog.module('pstj.demos.graphics.svgdrawing');

const SvgDrawing = goog.require('pstj.graphics.svg.SvgDrawing');
const asserts = goog.require('goog.asserts');
/** @suppress {extraRequire} */
const notused = goog.require('pstj.animation.browser');

/** @type {!SVGElement} */
let svg = /** @type {!SVGElement} */(asserts.assert(document.querySelector('svg')));
let instance = new SvgDrawing(svg);
instance.play();