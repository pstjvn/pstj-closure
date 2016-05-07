goog.provide('pstj.demos.sourcegen');

goog.require('goog.array');
goog.require('pstj.ds.dto.format');
goog.require('pstj.sourcegen.CodeBuffer');

var cb = new pstj.sourcegen.CodeBuffer();
var name = 'Peps';

var b1 = cb.clone();
b1.writeln('start');
b1.indent.add();

var b2 = cb.clone();
b2.writeln(`test ${name}`);
b2.indent.add();
b2.writeln('t2');
b2.writeln();
b2.writeln('t3');
b2.indent.remove();
b2.writeln('end test');

b1.write(b2);
b1.indent.remove();
b1.writeln('end');

document.querySelector('pre').innerHTML = b1.toString();

console.log(goog.array.contains(pstj.ds.dto.format.allowedInInt, 'int64'));