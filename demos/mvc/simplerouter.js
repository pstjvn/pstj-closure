goog.provide('pstj.demos.mvc.SimpleRouter');

goog.require('pstj.mvc.SimpleRouter');

var router = new pstj.mvc.SimpleRouter();
router.route('*', function() {
  router.navigate('/signals');
});
router.route('/signals', function() {
  console.log('/signals', arguments);
});
router.route('/login', function() {
  console.log('/login', arguments);
});
router.route('/test/:id', function(){
  console.log('/test/:id', arguments);
});
router.route('/test/*', function() {
  console.log('/test/*', arguments);
});
router.setEnabled(true);
