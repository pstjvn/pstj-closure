goog.provide('pstj.color_test');

goog.require('goog.testing.PropertyReplacer');
goog.require('goog.testing.PseudoRandom');
goog.require('goog.testing.jsunit');
goog.require('pstj.color');

var stubs;
var pseudoRandom = new goog.testing.PseudoRandom(100);
pseudoRandom.install();


/**
 * Make sure we are not actually testing the goog provided functions, stub them!
 */
var setUp = function() {
  stubs = new goog.testing.PropertyReplacer();
  stubs.replace(goog.color, 'hexToRgb', function() {
    return [0, 0, 0];
  });
};


/**
 * Dummy variables
 * @type {string}
 */
var color = '#000000';


/**
 * Our comparison value
 * @type {string}
 */
var part = 'rgba(0,0,0,';

function testGet() {
  var values = [];
  for (var i = 0; i < 10; i++) {
    values.push(parseFloat(Math.random().toFixed(2)));
  }
  for (var i = 0; i < 10; i++) {
    assertEquals('Alpha value should match ',
        pstj.color.hexToRgba(color, values[i]), part + values[i] + ')');
  }
}


function testNegative() {
  assertEquals('Negative values should be converted to 0',
      pstj.color.hexToRgba(color, -0.32), part + '0' + ')');
}


function testLargerThanOne() {
  assertEquals('Values larger than 1 should be set to 1',
      pstj.color.hexToRgba(color, 1.001), part + '1' + ')');
}


function testWithNonNumber() {
  assertThrows('Value is string', function() {
    pstj.color.hexToRgba(color, 0.23);
  });
  assertThrows('Value is Object', function() {
    pstj.color.hexToRgba(color, {});
  });
  assertThrows('Value is Array', function() {
    pstj.color.hexToRgba(color, []);
  });
  assertThrows('Value is boolean', function() {
    pstj.color.hexToRgba(color, true);
  });
}
