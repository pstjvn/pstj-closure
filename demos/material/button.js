goog.provide('pstj.demos.button');

goog.require('goog.array');
goog.require('goog.debug.Console');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.log');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.decorate');
goog.require('pstj.material.Button');

if (goog.DEBUG) {
  goog.debug.Console.autoInstall();
  goog.log.Logger.getLogger('pstj').setLevel(goog.log.Level.OFF);
  goog.log.Logger.getLogger('pstj.material').setLevel(goog.log.Level.ALL);
}


var decorated = [];

/**
 * Handle the action from buttons.
 * @param {!goog.events.Event} e
 */
function onAction(e) {
  e.target.setIcon(
      e.target.icon == 'cast-ready' ? 'cast-active' : 'cast-ready');
}

/**
 * Handle the noIcon type action.
 * @param {!goog.events.Event} e
 */
function noIcon(e) {
  e.target.setIcon(e.target.icon != 'none' ? 'none' : 'cast-ready');
}

/** Set the buttons to use ink. */
function useInk() {
  goog.array.forEach(arguments, function(i) { i.setUseInk(true); });
}

/** Make the instances raised */
function setRaised() {
  goog.array.forEach(arguments, function(i) { i.setRaised(true); });
}

/** Set the button to be animated */
function setAnimated() {
  goog.array.forEach(arguments, function(i) { i.setTransitioning(true); });
}

/** Set the icon on the button instances */
function setIcon() {
  goog.array.forEach(arguments, function(i) { i.setIcon('cast-ready'); });
}

/** Render the button type */
function render() {
  goog.array.forEach(arguments, function(i) {
    var dom = goog.dom.createDom('div');
    document.body.appendChild(dom);
    i.render(dom);
  });
}

// Decorate.
goog.array.forEach(
    document.querySelectorAll('.material-button'),
    function(node) { decorated.push(goog.ui.decorate(node)); });


// Render
var b1 = new pstj.material.Button('Rendered');
var b2 = new pstj.material.Button('Rendered ink');
var b3 = new pstj.material.Button('Rendered raised');
var b4 = new pstj.material.Button('Rendered ink raised');
var b5 = new pstj.material.Button('Rendered raised animated');
var b6 = new pstj.material.Button('Rendered ink raised animated');
var b7 = new pstj.material.Button('Rendered icon');
var b8 = new pstj.material.Button('Rendered icon ink');
var b9 = new pstj.material.Button('Rendered icon raised');
var b10 = new pstj.material.Button('Rendered icon ink raised');
var b11 = new pstj.material.Button('Rendered icon raised animated');
var b12 = new pstj.material.Button('Rendered icon ink raised animated');
var b13 = new pstj.material.Button('Rendered icon - none');
var b14 = new pstj.material.Button('Rendered icon morph');
var b15 =
    new pstj.material.Button('Rendered icon morph delay ink raised animated');
var b16 = new pstj.material.Button(
    'Rendered icon morph no-delay (defunc because tactile delays action) ink raised animated');

useInk(b2, b4, b6, b8, b10, b12, b15, b16);
setRaised(b3, b4, b5, b6, b9, b10, b11, b12, b15, b16);
setAnimated(b5, b6, b11, b12, b15, b16);
setIcon(b7, b8, b9, b10, b11, b12, b13, b14, b15, b16);


/** Use the delay */
b15.useIconAnimationDelay = true;
b15.setTactile(true);

// b16.useIconAnimationDelay = true;
b16.setTactile(true);

render(b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16);


// Act on action to demo the icons.
goog.events.listen(decorated[12], goog.ui.Component.EventType.ACTION, noIcon);
goog.events.listen(decorated[13], goog.ui.Component.EventType.ACTION, onAction);
goog.events.listen(decorated[14], goog.ui.Component.EventType.ACTION, onAction);
goog.events.listen(decorated[15], goog.ui.Component.EventType.ACTION, onAction);
goog.events.listen(decorated[16], goog.ui.Component.EventType.ACTION, onAction);
goog.events.listen(decorated[17], goog.ui.Component.EventType.ACTION, onAction);
goog.events.listen(decorated[18], goog.ui.Component.EventType.ACTION, onAction);
goog.events.listen(b13, goog.ui.Component.EventType.ACTION, noIcon);
goog.events.listen(b14, goog.ui.Component.EventType.ACTION, onAction);
goog.events.listen(b15, goog.ui.Component.EventType.ACTION, onAction);
goog.events.listen(b16, goog.ui.Component.EventType.ACTION, onAction);
