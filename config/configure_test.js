goog.provide('pstj.configure_test');

goog.require('goog.testing.jsunit');
goog.require('pstj.configure');

function setUpPage() {
  window.CONFIG = {
    existingString: '',
    existingBoolean: true,
    existingNumber: 1.23,
    nonexisting: undefined,
    neseted: {
      bool: true,
      string: 'string'
    }
  };
}


function testThrowsOnEmptyKey() {
  assertThrows('Should throw on empty key w/o prefix', function() {
    pstj.configure.getRuntimeValue('', 'expectedDefault');
  });
  assertThrows('Should throw on empty key with invalid prefix', function() {
    pstj.configure.getRuntimeValue('', 'expectedDefault', 'INVALID.PREFIX');
  });
  assertThrows('Should throw on empty key with valid prefix', function() {
    // pstj.configure.getRuntimeValue('', 'expectedDefault', 'CONFIG.existingString');
  });
}