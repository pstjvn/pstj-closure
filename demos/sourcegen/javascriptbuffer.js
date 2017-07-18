goog.provide('pstj.demos.sourcegen.JavascriptBuffer');

goog.require('pstj.sourcegen.JavascriptBuffer');

let b = new pstj.sourcegen.JavascriptBuffer();
b.writeln('// generated auto');
b.lines(2);
b.startComment();
b.writeln();
b.writeln('this is a multiline comment');
b.endComment();
b.lines(2);
b.writeSingleLineComment('This is s single line comment');
b.writeln('function name() {');
let b2 = b.clone();
b2.writeln('var a = 1;');
b2.writeln('return a + 2;');
b.write(b2);
b.writeln('}');

b.writeln('var a = class {');
b.indent();
let fn = b.startMethod('constructor', 'name', 'age');
fn.writeln(`this.name = name;`);
fn.writeln(`this.age = age;`);
b.endMethod(fn);
b.unindent();
b.writeln('};');
document.getElementById('result').textContent = b.toString();
