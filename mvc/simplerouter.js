/**
 * @fileoverview Shamlessly stolen from PlastronJS
 * Unfortinately their implementation is not what we need,
 * it cannot be used with decoration (because in IE mode it uses
 * document.write and because it calls history.setEnable(true)
 * in the constructor, which means we did not have the chance to
 * add listeners for the initial state change that is fired
 * in the enable state. Also we want to be able to use urls
 * everywhere and thus we want always recognizable URLs, however
 * we do not want to convert those URL (a la G+ management) thus
 * we want to enforce basic history api (fragment instead of
 * html5 version), thus we need the class tweaked.
 *
 * Unfortunately the original implmentation as seen in PlastronJS was
 * not designed for extendibility, thus we simply copy the behavior and will not
 * use the original code.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.mvc.SimpleRouter');

goog.require('goog.History');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.string');



/**
 * Provides a simple routing infrastructure for managing URL like hierarchies of
 * 'pages' inside the app.
 * @constructor
 */
pstj.mvc.SimpleRouter = function() {
  this.history_ = new goog.History();
  goog.events.listen(this.history_, goog.history.EventType.NAVIGATE,
      this.onChange_, false, this);
  this.routes_ = [];
};


/**
 * Pass through the fragment for the URL
 *
 * @param {string} fragment to set for the history token.
 */
pstj.mvc.SimpleRouter.prototype.navigate = function(fragment) {
  this.history_.setToken(fragment);
};


/**
 * For our needs the history should be anabled AFTER we have setup the routes,
 * as we need to have access to the initial state.
 * @param {boolean} enable True if the history API should be enabled.
 */
pstj.mvc.SimpleRouter.prototype.setEnabled = function(enable) {
  this.history_.setEnabled(enable);
};


/**
 * define route as string or regex. /:abc/ will pass "abc" through as an
 * argument. *abc/def will pass through all after the * as an argument
 *
 * @param {string|RegExp} route to watch for.
 * @param {function(string, ...string)} fn should take in the token and any
 * captured strings.
 */
pstj.mvc.SimpleRouter.prototype.route = function(route, fn) {
  if (goog.isString(route))
    route = new RegExp('^' + goog.string.regExpEscape(route)
            .replace(/\\:\w+/g, '(\\w+)')
            .replace(/\\\*/g, '(.*)')
            .replace(/\\\[/g, '(')
            .replace(/\\\]/g, ')?')
            .replace(/\\\{/g, '(?:')
            .replace(/\\\}/g, ')?') + '$');
  this.routes_.push({route: route, callback: fn});
};


/**
 * Handle the hash changes emitted by the history API (wrapped by goog).
 * @private
 */
pstj.mvc.SimpleRouter.prototype.onChange_ = function() {
  var fragment = this.history_.getToken();
  goog.array.forEach(this.routes_ || [], function(route) {
    var args = route.route.exec(fragment);
    if (!args)
      return;
    route.callback.apply(this, args);
  }, this);
};
