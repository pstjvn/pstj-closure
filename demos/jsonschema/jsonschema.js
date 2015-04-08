goog.provide('pstj.demos.jsonschema.generator');

goog.require('goog.array');
goog.require('goog.debug.DivConsole');
goog.require('pstj.ds.jsonschema.parser');


(new goog.debug.DivConsole(document.body))
    .setCapturing(true);

pstj.ds.jsonschema.parser.setGlobalNamespacePrefix('pstj.ds.dto');
pstj.ds.jsonschema.parser.setGlobalPrefix('testschemas/');

pstj.ds.jsonschema.parser.load([
  'base',
  'baserequired',
  'basext',
  'forextend'
]).then(function(result) {
  goog.array.forEach(result, function(klass) {
    klass.createProperties();
    klass.print();
  });
}, function(err) {
  console.log('Error:', err);
});
