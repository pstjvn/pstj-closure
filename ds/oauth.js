/**
 * @fileoverview Exposes app bus topic and structure for the user information
 * when using social media logins.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('pstj.ds.oauth');

goog.require('goog.events');
goog.require('goog.pubsub.TopicId');


/**
 * Topic to publish to when user has been authenticated with an oauth provider.
 * @type {!goog.pubsub.TopicId<?pstj.ds.oauth.User>}
 */
pstj.ds.oauth.Topic = new goog.pubsub.TopicId(goog.events.getUniqueId('oauth'));


/**
 * Describe user authenticated via Facebook or Google.
 * @typedef {{id: string, name: string, provider: string}}
 */
pstj.ds.oauth.User;
