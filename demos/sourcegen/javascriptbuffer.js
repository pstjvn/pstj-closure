goog.provide('pstj.demos.sourcegen.JavascriptBuffer');

goog.require('pstj.sourcegen.JavascriptBuffer');

let b = new pstj.sourcegen.JavascriptBuffer();
b.writeln('// generated auto');
b.writeln((new Array(80)).join('I'));
b.lines(2);
b.startComment();
b.writeln();
b.writeln('this is a multiline comment');
b.endComment();
b.lines(2);
b.writeSingleLineComment('This is s single line comment');
b.writeln('function name() {');
b.indent();
b.writeln('var a = 1;');
b.writeln('return a + 2;');
b.unindent();
b.writeln('}');

b.writeln('var a = class {');
b.indent();
b.startMethodDefinition('constructor', 'name', 'age');
b.writeln(`this.name = name;`);
b.writeln(`this.age = age;`);
b.endMethodDefinition();
b.unindent();
b.writeln('};');

b.lines(2);

b.startComment();
b.writeComment('This is supposed to be a short comment');
b.lines(1);
b.writeComment(
    'And this is supposed to be a very very very very long comment that is supposed to prove if our code actually works.');
b.endComment();
b.lines(3);

b.startComment();
b.writeComment('Class comment example');
b.lines(1);
b.writeComment(
    b.createComment('param', 'The age of the person', 'number', 'age'));
b.writeComment(
    b.createComment(
        'param',
        'Some really long very very long comment about the parameter that is to be used in the method.',
        'string', 'name'));
b.endComment();

document.getElementById('result').textContent = b.toString();
