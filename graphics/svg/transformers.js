goog.module('pstj.graphics.svg.transformers');

const array = goog.require('goog.array');
const dom = goog.require('goog.dom');

/**
 * Provides inline (i.e. replaces items in the same object) transformation of
 * SVG elements by replacing polygons and polyline elements with path elements
 * that have the same shape.
 *
 * It is possible to fill the formed path or leave it as an outline or the
 * original form.
 *
 * This ransformation might be useful if you want to animate the path elements.
 */
const Transformer = class {
  /**
   * @param {string=} selector
   * @param {boolean=} fill
   */
  constructor(selector = 'polygon,polyline', fill = true) {
    /** @private {string} */
    this.selector_ = selector;
    /** @private {boolean} */
    this.fill_ = fill;
  }

  /**
   * Transfrom an SVG element to match polygons/polylines with path.
   *
   * @param {SVGElement} svg
   */
  transform(svg) {
    let polygons = svg.querySelectorAll(this.selector_);
    array.forEach(polygons, this.replaceWithPath, this);
  }

  /**
   * Process the polyline / polygon with a path.
   *
   * @param {!SVGPolygonElement|!SVGPolylineElement} el
   * @protected
   */
  replaceWithPath(el) {
    let svgNS = el.ownerSVGElement['namespaceURI'];
    let path = dom.getDocument().createElementNS(svgNS, 'path');
    let points = el.getAttribute('points').split(/\s+|,/);
    let x0 = points.shift();
    let y0 = points.shift();
    let rest = points.join(' ');
    let pathdata = `M${x0},${y0}L${rest}`;
    if (el.tagName == 'polygon') {
      pathdata += 'z';
    }
    path.setAttribute('d', pathdata);
    if (!this.fill_) {
      path.style = 'fill: none; fill-rule: evenodd;';
    }
    el.parentNode.replaceChild(path, el);
  }
};

/** @type {!Transformer} */
let instance = new Transformer(undefined, false);

/** @type {function(this: Transformer, SVGElement): void} */
exports.polyToPath = goog.bind(instance.transform, instance);

exports.Transformer = Transformer;