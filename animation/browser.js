goog.provide('pstj.animation.browser');

goog.require('pstj.animation.RafSI');
goog.require('pstj.animation.Scheduler');

/** Sets up the scheduler implementation to one that is ued in the browser */
pstj.animation.Scheduler.setSchedulerImplementation(new pstj.animation.RafSI());
