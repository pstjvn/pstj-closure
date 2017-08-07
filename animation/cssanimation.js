(function() {
  var button = document.querySelector('button');
  var div = document.querySelector('.movable');
  var ts = 0;

  div.addEventListener('click', function(e) {
    e.target.style.animationDuration = '20s';
    e.target.classList.add('active');
    ts = Date.now();
  });

  button.addEventListener('click', function(e) {
    var elapsed = Date.now() - ts;
    var delay = elapsed;
    var percent = elapsed / 20000;
    var substract = 3000 * percent;
    delay = delay - substract;
    div.style.animationDelay = `${delay}ms`;
    div.style.animationDuration = '1s';
  });
})();