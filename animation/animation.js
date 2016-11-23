goog.provide('pstj.animation.create');

goog.require('goog.asserts');
goog.require('pstj.animation.Scheduler');
goog.require('pstj.animation.State');
goog.require('pstj.animation.Task');
goog.require('pstj.animation.TaskSet');
goog.require('pstj.ds.DoubleBufferedList');

/**
 * Create a new animation function.
 *
 * @param {?function(!pstj.animation.State):void} measure
 * @param {?function(!pstj.animation.State):void} mutate
 * @param {?pstj.animation.State} state
 *
 * @return {function():void}
 */
pstj.animation.create = function(measure, mutate, state) {
  var s = goog.asserts.assertInstanceof((state instanceof pstj.animation.State)
                                            ? state
                                            : new pstj.animation.State(),
                                        pstj.animation.State);
  var ts = new pstj.animation.TaskSet(s);
  ts.measure =
      goog.isDefAndNotNull(measure) ? (new pstj.animation.Task(measure)) : null;
  ts.mutate =
      goog.isDefAndNotNull(mutate) ? (new pstj.animation.Task(mutate)) : null;
  return pstj.animation.generateFunction(ts);
};

/**
 * Generates an 'animate' function that can be called to schedule animation
 * tasks per request. We have the guarantee that the task will be executed only
 * once per run.
 *
 * @param {pstj.animation.TaskSet} taskset [description]
 *
 * @return {function(): void}
 */
pstj.animation.generateFunction = function(taskset) {
  return function() {
    if (!taskset.scheduled) {
      taskset.scheduled = true;
      pstj.animation.tasks_.add(taskset);
      pstj.animation.schedule_();
    }
  };
};

pstj.animation.tasks_ = new pstj.ds.DoubleBufferedList();
pstj.animation.running_ = false;
pstj.animation.hasSchedulerActive_ = false;

/**
 * Schedule a queue run if not already scheduled.
 *
 * @private
 */
pstj.animation.schedule_ = function() {
  if (!pstj.animation.hasSchedulerActive_) {
    pstj.animation.hasSchedulerActive_ = true;
    pstj.animation.scheduler_.start();
  }
};

/**
 * Runs the task list of tasksets for all scheduled animations.
 *
 * @private
 * @param {number} ts The timestamp of the triggered queue emptying.
 */
pstj.animation.runTasks_ = function(ts) {
  pstj.animation.running_ = true;
  pstj.animation.hasSchedulerActive_ = false;

  pstj.animation.tasks_.forEach(function(taskset) {
    taskset.scheduled = false;
    taskset.state.timestamp = ts;
  });

  pstj.animation.tasks_.forEach(function(taskset) {
    if (!goog.isNull(taskset.measure))
      taskset.measure.call(taskset.state);
  });

  pstj.animation.tasks_.forEach(function(taskset) {
    if (!goog.isNull(taskset.mutate))
      taskset.mutate.call(taskset.state);
  });

  pstj.animation.tasks_.forEach(function(taskset) { taskset.state.clear(); });

  pstj.animation.tasks_.clear();
  pstj.animation.running_ = false;
};

/**
 * @private {pstj.animation.Scheduler}
 */
pstj.animation.scheduler_ =
    new pstj.animation.Scheduler(pstj.animation.runTasks_);
