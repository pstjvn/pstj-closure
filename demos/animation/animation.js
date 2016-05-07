goog.provide('pstj.demos.animation');

goog.require('pstj.animation.RafSI');
goog.require('pstj.animation.Scheduler');
goog.require('pstj.animation.create');


var anim = null;
var count = 0;

pstj.animation.Scheduler.setSchedulerImplementation(new pstj.animation.RafSI());

anim = pstj.animation.create(function(state) {
  console.log('Measuring');
}, function(state) {
  count++;
  if (count < 5) anim();
  console.log('Mutating ' + count);
});

anim();
