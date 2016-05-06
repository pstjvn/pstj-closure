/**
 * @fileoverview Convenience namespace that enforces convention for using web
 * workers in closure projects based on the app namespace in pstj library. The
 * main idea is that if you need to use the worker you have to support two
 * modes: source and compiled (advanced compilation).
 *
 * For this reason a convention mode is used that predefines the files and paths
 * needed to support the worker solution as defined in pstj library.
 *
 * To be sure to have the needed files and keep the convention working it is
 * best to use the seed projects which includes the bootstrap and main worker
 * files.
 *
 * Note also that this provides the base minimum worker utilitis and you should
 * consider higher order astraction such as message bus communication or message
 * brokerage.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.app.worker');

goog.require('pstj.worker.WorkerClient');

/** @define {string} The ulr where we should locate the worker app */
goog.define('pstj.app.worker.URL', 'build/worker.build.js');

/**
 * @private
 * @type {pstj.worker.WorkerClient}
 */
pstj.app.worker.instance_ = null;

/**
 * Singleton getter for the worker as defined in an app. Note that this will
 * always use the same worker entry point and if your app needs more than one
 * worker you should NOT use this convention and should instead instantiate your
 * workers in a different manner.
 *
 * @return {pstj.worker.WorkerClient}
 */
pstj.app.worker.getInstance = function() {
  if (goog.isNull(pstj.app.worker.instance_)) {
    pstj.app.worker.instance_ = new pstj.worker.WorkerClient(
        COMPILED ? pstj.app.worker.URL : 'js/worker/bootstrap.js');
  }
  return pstj.app.worker.instance_;
};
