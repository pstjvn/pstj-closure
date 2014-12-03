/**
 * @fileoverview Provides the theme object. This code is considered
 * deprecated and should not be used in new projects.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.themes.theme');

goog.require('goog.object');
goog.require('goog.pubsub.PubSub');


/**
 * @type {Object.<function(Object):string>}
 * @private
 */
pstj.themes.theme.registry_ = {};


/**
 * @type {Object.<function(Object):string>}
 * @private
 */
pstj.themes.theme.theme_ = null;


/**
 * @type {goog.pubsub.PubSub}
 */
pstj.themes.theme.pubsub = new goog.pubsub.PubSub();


/**
 * @enum {string}
 */
pstj.themes.theme.topic = {
  THEME_APPLIED: 'theme_applied'
};


/**
 * @param {string} id The id to register.
 * @param {function(Object):string} template The template function for this id.
 */
pstj.themes.theme.registerId = function(id, template) {
  goog.object.add(pstj.themes.theme.registry_, id, template);
};


/**
 * Update the theme
 * @param {Object.<function(Object):string>} new_theme The new theme object.
 */
pstj.themes.theme.setTheme = function(new_theme) {
  pstj.themes.theme.theme_ = goog.object.clone(pstj.themes.theme.registry_);
  goog.object.extend(pstj.themes.theme.theme_, new_theme);
  pstj.themes.theme.pubsub.publish(pstj.themes.theme.topic.THEME_APPLIED);
};


/**
 * Default template implementation.
 * @private
 * @param {Object} obj The template filling object (see soy templates).
 * @return {string} The default template notifying developer that template
 * should first be registered.
 */
pstj.themes.theme.defaultTemplate_ = function(obj) {
  return '<div>No template was defined for this ID</div>';
};


/**
 * Use this method to obtain the template for a particular class ID.
 * @param {string} id The ID defined as themableId.
 * @return {function(Object):string} The template function.
 */
pstj.themes.theme.getTemplate = function(id) {
  return /** @type {function(Object):string} */ (goog.object.get(
      pstj.themes.theme.theme_ || pstj.themes.theme.registry_, id));
};
