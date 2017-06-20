goog.provide('pstj.demos.app.google.Auth2');

goog.require('goog.debug.DivConsole');
goog.require('goog.log');
goog.require('pstj.app.google.Auth2');

var logger = goog.log.getLogger('pstj.demos.app.google.Auth2');
var div = document.querySelector('.console');
// goog.log.getLogger('longa.App').setLevel(goog.log.Level.OFF);
// goog.log.getLogger('longa.rpc').setLevel(goog.log.Level.OFF);
// goog.log.getLogger('longa.control.Auth').setLevel(goog.log.Level.OFF);
(new goog.debug.DivConsole(div)).setCapturing(true);

pstj.app.google.Auth2.getInstance().getPromise().then(function(auth2) {
  goog.log.info(logger, 'Received auth2');
  goog.log.info(logger, 'Auth2 is an object: ' + (goog.isObject(auth2)));
}, function(err) {
  goog.log.error(logger, 'Could not load auth2');
  goog.log.error(logger, err);
});