/**
 * @fileoverview Pubsub channel used for cache and instance counting
 * instrumentation of code. If compiled with debug (or in source mode) it
 * exports global method to gather counts and information about caches
 * agents and other statistics about the resource consumption of your app.
 *
 * Example usage would be like this:
 *
 * myclass = goog.defineClass(null, {
 *   constructor: function() {
 *      if (goog.DEBUG) { pstj.debug.bus.subscribe(pstj.debug.Topic.DUMP,
 *          function() {
 *              // do some value dumping
 *          });
 *      }
 *   }
 * });
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */


goog.provide('pstj.debug');

goog.require('goog.events');
goog.require('goog.pubsub.TopicId');
goog.require('goog.pubsub.TypedPubSub');



goog.scope(function() {
var _ = pstj.debug;


/**
 * The bus to use for debuging calls. Class instances and caches could
 * subscribe to the desired topics from this class and then they will
 * be able to react to messages used for dumping values and other debugging
 * and optimization techniques.
 *
 * @final
 * @type {goog.pubsub.TypedPubSub}
 */
_.bus = new goog.pubsub.TypedPubSub();


/**
 * Provides the channel topic for dumping the cache values.
 * @final
 * @type {!goog.pubsub.TopicId<undefined>}
 */
_.Topic = new goog.pubsub.TopicId(goog.events.getUniqueId('dump'));


// Export the global method for cache dumping.
if (goog.DEBUG) {
  goog.exportSymbol('_dumpCaches', function() {
    _.bus.publish(_.Topic, undefined);
  });
}

});  // goog.scope
