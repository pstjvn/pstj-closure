goog.module('pstj.demos.console.console');

const {createOpenedNotifier} = goog.require('pstj.console');

/** Reflect state on UI */
function updateUi() {
  document.getElementById('result').textContent = 'been opened';
}

/** Entry point */
function main() {
  const creator =
      createOpenedNotifier(goog.global['console'], 'log', 'toString');
  creator(updateUi);
}

main();