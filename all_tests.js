var _allTests = [
  'color/color_test.html',
  'config/configure_test.html'
];

// If we're running in a nodejs context, export tests. Used when running tests
// externally on Travis.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = _allTests;
}
