goog.provide('pstj.demos.widget.swiper');

goog.require('pstj.ds.dto.SwipetileList');
goog.require('pstj.widget.Swiper');

var a = new pstj.widget.Swiper();
var json = [
  {
    'src': 'http://longa.com/images/bull.jpg',
    'text': 'The ultimate stock signal marketplace'
  }, {
    'src': 'http://longa.com/images/b.jpg',
    'text': 'Where investors meet successful signal traders'
  }, {
    'src': 'http://longa.com/images/c.jpg',
    'text': 'Make money from stock investments'
  }, {
    'src': 'http://longa.com/images/hands.jpg',
    'text': 'Follow the best investment strategy'
  }, {
    'src': 'http://longa.com/images/d.jpg',
    'text': 'Sell your trading ideas and make money'
  }
];

var sl = new pstj.ds.dto.SwipetileList();
sl.fromJSON(json);
a.setModel(sl);
a.render(document.querySelector('.container'));
