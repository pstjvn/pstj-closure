goog.provide('pstj.demos.widget.swipetile');

goog.require('pstj.widget.Swipetile');

var a = new pstj.widget.Swipetile();
a.imageUrl = 'http://longa.com/images/bull.jpg';
a.text = 'The ultimate stock signal marketplace';
a.render(document.querySelector('.container'));