goog.module('pstj.demos.graphics.svgdrawing');

const SvgDrawing = goog.require('pstj.graphics.svg.SvgDrawing');
const notused = goog.require('pstj.animation.browser');
const asserts = goog.require('goog.asserts');

/** @type {!SVGElement} */
let svg = /** @type {!SVGElement} */(asserts.assert(document.querySelector('svg')));
let instance = new SvgDrawing(svg);
instance.play();