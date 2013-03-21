goog.provide('pstj.ui.Touchable');
goog.provide('pstj.ui.Touchable.EventType');
goog.provide('pstj.ui.Touchable.Event');
goog.provide('pstj.ui.Touchable.PubSub');

goog.require('goog.events');
goog.require('goog.ui.Component.EventType');
goog.require('pstj.ui.Async');
goog.require('goog.pubsub.PubSub')

pstj.ui.Touchable = function() {
  goog.base(this);
  this.pressed_ = false;
  this.moved_ = false;
};
goog.inherits(pstj.ui.Touchable,pstj.ui.Async);

pstj.ui.Touchable.longTouchTimeout = -1;
pstj.ui.Touchable.doubled = false;

pstj.ui.Touchable.prototype.startLongTouch = function() {
  if (pstj.ui.Touchable.longTouchTimeout == -1) {
    pstj.ui.Touchable.longTouchTimeout = setTimeout(goog.bind(function() {
      this.dispatchEvent(pstj.ui.Touchable.EventType.LONG_PRESS);
    }, this), 800);
  }
};

pstj.ui.Touchable.prototype.cancelLongTouch = function() {
  clearTimeout(pstj.ui.Touchable.longTouchTimeout);
  pstj.ui.Touchable.longTouchTimeout = -1;
};

pstj.ui.Touchable.PubSub = new goog.pubsub.PubSub();
pstj.ui.Touchable.PubSub.DOUBLE = 'double';

pstj.ui.Touchable.prototype.handleTouchEvent = function(e) {
  var be = e.getBrowserEvent();
  var touchlen = be['touches'].length;
  e.preventDefault();
  e.stopPropagation();
  console.log('type', be.type, touchlen, be.changedTouches.length);
  switch (e.type) {
    case goog.events.EventType.TOUCHSTART:
      this.moved_ = false;
      this.lpressed_ = false;
      this.dispatchEvent(pstj.ui.Touchable.EventType.PRESS);
      this.startLongTouch();
      break;
    case goog.events.EventType.TOUCHMOVE:
      if (touchlen > 1) {
        this.cancelLongTouch();
        pstj.ui.Touchable.doubled = true;
        pstj.ui.Touchable.PubSub.publish(pstj.ui.Touchable.PubSub.DOUBLE, e);
      } else {
        if (touchlen == 1 && !pstj.ui.Touchable.doubled) {
          if (!this.pressed_) return;
          this.cancelLongTouch();
          this.dispatchEvent(pstj.ui.Touchable.EventType.MOVE);
        }
      }
      break;
    case goog.events.EventType.TOUCHEND:
      this.cancelLongTouch();
      if (touchlen == 0) {
        if (pstj.ui.Touchable.doubled) {
          setTimeout(function() { pstj.ui.Touchable.doubled = false;}, 1400);
        } else {
          if (!this.pressed_) return;
          if (!this.moved_) {
            this.dispatchEvent(goog.ui.Component.EventType.ACTIVATE);
          }
          this.dispatchEvent(pstj.ui.Touchable.EventType.RELEASE);
        }
      }
      break;
    case goog.events.EventType.TOUCHCANCEL:
      this.cancelLongTouch();
      this.pressed_ = false;
      this.moved_ = false;
      this.lpressed_ = false;
      break;
  }
};

pstj.ui.Touchable.prototype.attachTouchEvents = function() {

  this.getHandler().listen(this, pstj.ui.Touchable.EventType.PRESS,
    function() {
      this.pressed_ = true;
    });

  this.getHandler().listen(this, pstj.ui.Touchable.EventType.MOVE,
    function() {
      this.moved_ = true;
    });

  this.getHandler().listen(this, pstj.ui.Touchable.EventType.RELEASE,
    function() {
      this.pressed_ = false;
      this.cancelLongTouch();
    });

  this.getHandler().listen(this, pstj.ui.Touchable.EventType.LONG_PRESS,
    function() {
      this.lpressed_ = true;
    });

  this.getHandler().listen(this.getElement(), pstj.ui.Touchable.EVENTS,
    this.handleTouchEvent);
};

/** @inheritDoc */
pstj.ui.Touchable.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.attachTouchEvents();
};

pstj.ui.Touchable.EventType = {
  PRESS: goog.events.getUniqueId(goog.DEBUG ? 'press' : 'a'),
  LONG_PRESS: goog.events.getUniqueId(goog.DEBUG ? 'long-press' : 'b'),
  MOVE: goog.events.getUniqueId(goog.DEBUG ? 'move' : 'c'),
  RELEASE: goog.events.getUniqueId(goog.DEBUG ? 'release' : 'd'),
  ZOOMIN: goog.events.getUniqueId(goog.DEBUG ? 'zoomin': 'e'),
  ZOOMOUT: goog.events.getUniqueId(goog.DEBUG ? 'zoomout' : 'f' )
};

pstj.ui.Touchable.EVENTS = [
  goog.events.EventType.TOUCHSTART,
  goog.events.EventType.TOUCHMOVE,
  goog.events.EventType.TOUCHEND,
  goog.events.EventType.TOUCHCANCEL
  // goog.events.EventType.MOUSEDOWN,
  // goog.events.EventType.MOUSEMOVE,
  // goog.events.EventType.MOUSEUP
];
