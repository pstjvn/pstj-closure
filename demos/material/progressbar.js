goog.provide('pstj.demos.progressbar');

goog.require('pstj.material.Progressbar');

(function() {

  var pb = new pstj.material.Progressbar();
  pb.render(document.querySelector('.container'));
  document.body.addEventListener('click', function(e) {
    if (pb.isEmpty() && !pb.isTransitioning()) {
      pb.start();
    } else if (pb.isTransitioning()) {
      pb.complete();
    } else {
      pb.setEmpty(true);
    }
  });

})();
