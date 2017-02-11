goog.provide('pstj.demos.app.google.Gapi');

goog.require('goog.log');
goog.require('pstj.app.google.Gapi');
goog.require('goog.debug.DivConsole');

var logger = goog.log.getLogger('pstj.demos.app.google.Gapi');
var div = document.querySelector('.console');
// goog.log.getLogger('longa.App').setLevel(goog.log.Level.OFF);
// goog.log.getLogger('longa.rpc').setLevel(goog.log.Level.OFF);
// goog.log.getLogger('longa.control.Auth').setLevel(goog.log.Level.OFF);
(new goog.debug.DivConsole(div)).setCapturing(true);

pstj.app.google.Gapi.getInstance().getPromise().then(function(gapi) {
  goog.log.info(logger, 'Received GAPI');
  goog.log.info(logger, 'Gapi is an object: ' + (goog.isObject(gapi)));
}, function(err) {
  goog.log.error(logger, 'Could not load GAPI');
  goog.log.error(logger, err);
});