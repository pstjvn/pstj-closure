goog.module('pstj.console');

const FirefoxTestObjectSymbol = 'InstallTrigger';

/**
 * Because we are using a hack to determine when the console is being
 * opened (i.e. activation of DevTools) and the hack is browser dependent
 * we need to weed out Firefox from webkit/blink. This function uses the
 * fact that Firefox since 1.0 has a global InstallTrigger object.
 *
 * @param {string=} symbolToEval The string to evaluate, if not provided we will
 * use 'InstallTrigger'.
 * @return {boolean} If true then this is running in firefox.
 */
function determineFirefoxByGlobalEval(symbolToEval) {
  var isFirefoxString = FirefoxTestObjectSymbol;
  if (goog.isString(symbolToEval)) isFirefoxString = symbolToEval;
  try {
    eval(isFirefoxString);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Actual simplified version of the firefox tester for the purpose of console
 * hacks.
 *
 * @return {boolean} If true then this is firefox.
 */
function determineFirefox() {
  return typeof goog.global[FirefoxTestObjectSymbol] === 'object';
}


/**
 * Creates a function that can be used to register a single handler to be called
 * when the console is being opened in the browser.
 *
 * @param {!Object} console Reference to the actual global 'console' object
 * (i.e.
 *    window.console or global.console)
 * @param {string} log String representation of the console method to use.
 * @param {string} toStringString toString as a string (we are using dynamic
 * dispatch).
 * @param {boolean=} isFirefox If the code is running in firefox.
 * @return {function(function():void):void}
 */
function createOpenedNotifier(console, log, toStringString, isFirefox) {
  var callback;
  if (!goog.isBoolean(isFirefox)) isFirefox = determineFirefox();

  if (isFirefox) {
    var localRegExp = /x/;
    localRegExp[toStringString] = function() {
      callback();
      return '';
    };
    return function(desiredCallback) {
      callback = desiredCallback;
      console[log](localRegExp);
    };
  } else {
    // Assuming chromium
    var img = new Image();
    img['__defineGetter__']('id', function() {
      callback();
      return '';
    });
    return function(desiredCallback) {
      callback = desiredCallback;
      console[log](img);
    };
  }
}

exports = {createOpenedNotifier};