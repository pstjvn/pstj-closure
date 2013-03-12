/**
 * @fileoverview Provides the theme object. This code is considered
 * deprecated and should not be used in new projects.
 *
 * @author  regardingscot@gmail.com (Peter StJ)
 */
goog.provide('pstj.themes.theme');


goog.require('goog.object');
goog.require('goog.pubsub.PubSub');


goog.scope(function() {

var theme = pstj.themes.theme;
var object = goog.object;
var PubSub = goog.pubsub.PubSub;
/**
 * @type {Object.<function(Object):string>}
 * @private
 */
theme.registry_ = {};
/**
 * @type {Object.<function(Object):string>}
 * @private
 */
theme.theme_ = null;
/**
 * @type {goog.pubsub.PubSub}
 */
theme.pubsub = new PubSub();
/**
 * @enum {string}
 */
theme.topic = {
  THEME_APPLIED: 'theme_applied'
};
/**
 * @param {string} id The id to register.
 * @param {function(Object):string} template The template function for this id.
 */
theme.registerId = function(id, template) {
  object.add(theme.registry_, id, template);
};
/**
 * Update the theme
 * @param {Object.<function(Object):string>} new_theme The new theme object.
 */
theme.setTheme = function(new_theme) {
  theme.theme_ = goog.object.clone(theme.registry_);
  object.extend(theme.theme_, new_theme);
  theme.pubsub.publish(theme.topic.THEME_APPLIED);
};
/**
 * Default template implementation.
 * @private
 * @param {Object} obj The template filling object (see soy templates).
 * @return {string} The default template notifying developer that template
 * should first be registered.
 */
theme.defaultTemplate_ = function(obj) {
  return '<div>No template was defined for this ID</div>';
};
/**
 * Use this method to obtain the template for a particular class ID.
 * @param {string} id The ID defined as themableId.
 * @return {function(Object):string} The template function.
 */
theme.getTemplate = function(id) {
  return /** @type {function(Object):string} */ (object.get(
    theme.theme_ || theme.registry_, id));
};
});
