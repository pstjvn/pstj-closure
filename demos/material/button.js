goog.provide('pstj.demos.button');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.decorate');
goog.require('pstj.material.Button');


var decorated = [];

function onAction(e) {
  e.target.setIcon(e.target.icon == 'cast-ready' ?
      'cast-active' : 'cast-ready');
}
function noIcon(e) {
  e.target.setIcon(e.target.icon != 'none' ? 'none' : 'cast-ready');
}
function useInk() {
  goog.array.forEach(arguments, function(i) {
    i.setUseInk(true);
  });
}
function setRaised() {
  goog.array.forEach(arguments, function(i) {
    i.setRaised(true);
  });
}
function setAnimated() {
  goog.array.forEach(arguments, function(i) {
    i.setTransitioning(true);
  });
}
function setIcon() {
  goog.array.forEach(arguments, function(i) {
    i.setIcon('cast-ready');
  });
}
function render() {
  goog.array.forEach(arguments, function(i) {
    var dom = goog.dom.createDom('div');
    document.body.appendChild(dom);
    i.render(dom);
  });
}

// Decorate.
goog.array.forEach(document.querySelectorAll('.material-button'),
    function(node) {
      decorated.push(goog.ui.decorate(node));
    });


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
var b15 = new pstj.material.Button(
    'Rendered icon morph delay ink raised animated');

useInk(b2, b4, b6, b8, b10, b12, b15);
setRaised(b3, b4, b5, b6, b9, b10, b11, b12, b15);
setAnimated(b5, b6, b11, b12, b15);
setIcon(b7, b8, b9, b10, b11, b12, b13, b14, b15);


/** Use the delay */
b15.useIconAnimationDelay = true;

render(b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15);


// Act on action to demo the icons.
goog.events.listen(decorated[12], goog.ui.Component.EventType.ACTION, noIcon);
goog.events.listen(decorated[13], goog.ui.Component.EventType.ACTION, onAction);
goog.events.listen(decorated[14], goog.ui.Component.EventType.ACTION, onAction);
goog.events.listen(decorated[15], goog.ui.Component.EventType.ACTION, onAction);
goog.events.listen(decorated[16], goog.ui.Component.EventType.ACTION, onAction);
goog.events.listen(decorated[17], goog.ui.Component.EventType.ACTION, onAction);
goog.events.listen(b13, goog.ui.Component.EventType.ACTION, noIcon);
goog.events.listen(b14, goog.ui.Component.EventType.ACTION, onAction);
goog.events.listen(b15, goog.ui.Component.EventType.ACTION, onAction);
