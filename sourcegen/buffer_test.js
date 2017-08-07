goog.provide('pstj.sourcegen.buffer_test');
goog.setTestOnly('pstj.sourcegen.buffer_test');

goog.require('goog.testing.PropertyReplacer');
goog.require('goog.testing.PseudoRandom');
goog.require('goog.testing.jsunit');
goog.require('pstj.sourcegen.Buffer');

var stubs;
var pseudoRandom = new goog.testing.PseudoRandom(100);
pseudoRandom.install();


/** @return {!pstj.sourcegen.Buffer} */
function getNewInstance() {
  return new pstj.sourcegen.Buffer();
}

function createClassInstance() {
  var a = class {
    constructor() {
      this.a = 'a';
    }
  };
  return new a();
}

function testCanCreateInstance() {
  assertNotThrows('Can create instance of the buffer', getNewInstance);
}

function testCanCallAllMethodsWithoutArguments() {
  assertThrows('Can call write without arguments', () => getNewInstance().write());
  assertNotThrows('Can call writeln without arguments', () => getNewInstance().writeln());
  assertNotThrows('Can call toString without arguments', () => getNewInstance().toString());
}

function testCanCallWriteMethodWithAllTypes() {
  assertNotThrows('Can call write with string', () => getNewInstance().write('string'));
  assertNotThrows('Can call write with number', () => getNewInstance().write(123));
  assertNotThrows('Can call write with boolean', () => getNewInstance().write(true));
  assertNotThrows('Can call write with array', () => getNewInstance().write([]));
  assertNotThrows('Can call write with object', () => getNewInstance().write({}));
  assertNotThrows('Can call write with class instance', () => {
    getNewInstance().write(createClassInstance());
  });
  assertThrows('Can not call write with undefined', () => getNewInstance().write(undefined));
  assertThrows('Can not call write with null', () => getNewInstance().write(null));
}

function testCanAddAllTypes() {
  assertEquals('Can add all types', 'a1truefalse[object Object],2[object Object]', (function() {
    let a = getNewInstance();
    a.write('a');
    a.write(1);
    a.write(true);
    a.write(false);
    a.write({});
    a.write([undefined,2]);
    a.write(createClassInstance());
    return a.toString();
  })())
}