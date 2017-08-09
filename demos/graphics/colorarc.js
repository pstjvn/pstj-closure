goog.provide('pstj.demos.graphics.colorarc');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.math.Rect');
goog.require('goog.object');
goog.require('pstj.color.ColorRange');
goog.require('pstj.graphics.ColorArc');

/** @const {number} */
var runs = 500;
/** @type {pstj.graphics.ColorArc} */
var ca = null;
/** @type {pstj.color.ColorRange} */
var cr = null;
/** @type {number} */
var times = 0;
/** @type {!Array<number>} */
var values = Array(runs);

/**
 * Sets up the perfing.
 */
window.onload = function() {
  cr = new pstj.color.ColorRange();
  cr.setColors('#84a0e8', '#f29093');
  ca = new pstj.graphics.ColorArc();
  setTimeout(function() {
    document.body.appendChild(ca.canvas);
    window.requestAnimationFrame(draw);
  }, 500);
};

/**
 * Calls the actual drawing functions.
 */
function draw() {
  if (times >= runs) {
    figureItOut();
    return;
  }
  window.requestAnimationFrame(draw);
  var a = Date.now();
  ca.createArc(new goog.math.Rect(0, 0, 300, 300), cr);
  values[times] = (Date.now() - a);
  times++;
}

/**
 * Debugging/perf info displayer
 */
function figureItOut() {
  values.sort((a, b) => a - b);
  var res = {};
  values.forEach(v => {
    if (!res[v]) res[v] = 0;
    res[v]++;
  });
  var itemCount = goog.object.getCount(res);
  var table = goog.dom.createTable(itemCount, 2);
  document.body.appendChild(table);
  var keys = goog.object.getKeys(res);
  goog.array.forEach(table.querySelectorAll('tr'), function(item, index) {
    var tds = item.querySelectorAll('td');
    tds.item(0).textContent = keys[index];
    tds.item(1).textContent = res[keys[index]];
  });
  // goog.object.forEach(res, (value, key) => {
  //   if (value > maxValue) {
  //     maxKey = key;
  //     maxValue = value;
  //   }
  // });
  // var max = values[values.length - 1];
  // var timesrun = values.length;
  // var average = (values.reduce((v, i) => v + i, 0) /
  // values.length).toFixed(2);

  // console.log(JSON.stringify(res));
  // console.log(
  //     `min: ${values[0]}, max: ${max}, average: ${average}, mode: ${maxKey},
  //     %: ${(maxValue/times*100).toFixed(2)}`);
}