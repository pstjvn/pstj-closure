goog.provide('pstj.ui.TouchSheet');

goog.require('goog.async.Delay');
goog.require('goog.dom.classlist');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.MouseWheelEvent');
goog.require('goog.events.MouseWheelHandler');
goog.require('goog.events.MouseWheelHandler.EventType');
goog.require('goog.style');
goog.require('pstj.lab.style.css');
goog.require('pstj.math.utils');
goog.require('pstj.ui.ISheet');
goog.require('pstj.ui.Touchable');
goog.require('pstj.ui.Touchable.EventType');
goog.require('pstj.ui.Touchable.PubSub');

/**
 * @fileoverview Provides touch enabled sheet implementation. It is also mouse
 *   enabled by default but uses special type of fitting in the container and
 *   thus is a little bit more resource intensive.
 *
 * NOTE: special care is taken to reduce memory footprint and GC interrupts
 *   when handling those events, still the widget is heavier than the regular
 *   scrollsheet component, thus if you do not have special reason to use this
 *   one consider the scrollsheet instead.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Provides the touchable sheet implementation. The widget is constructed on
 *   top of the touchable abstraction and should work equally well in touch
 *   and mouse environment, however for simplicity those are separated (i.e.
 *   if you are in the middle of a touch event mouse is ignored and vice
 *   versa).
 * @constructor
 * @extends {pstj.ui.Touchable}
 * @implements {pstj.ui.ISheet}
 * @param {pstj.ui.Template=} opt_template Optional template to if constructing
 *   DOM.
 */
pstj.ui.TouchSheet = function(opt_template) {
  goog.base(this, opt_template);

  /**
   * Reference to the last known parent size. Used to calculate in-frame sheet
   *   fitting.
   * @type {goog.math.Size}
   * @private
   */
  this.viewportsize_ = null;

  /**
   * Reference to our own size. Size is not applied directly, but instead is
   *   retained as data structure and applied only when redraw is needed.
   * @type {goog.math.Size}
   */
  this.size = null;

  /**
   * Internally used offset to position the sheet in the frame.
   * @type {number}
   * @private
   */
  this.offsetx_ = 0;

  /**
   * Internally used Y offset for the sheet in the frame.
   * @type {number}
   * @private
   */
  this.offsety_ = 0;
  /**
   * Represents our cached values, this is used to aleviate memory allocation
   *   in intensive event computations. Variables are all floating numbers and
   *   are accessed using the names in pstj.ui.TouchSheet.CACHE
   * @type {Array.<number>}
   * @private
   */
  this.cache_ = [0, -1, -1, -1, -1, 0, -1, -1, 0];
  /**
   * The maximum X offset that can be applied based on the current size of the
   *   sheet so that the sheet is not too much off the frame.
   * @private
   * @type {number}
   */
  this.maxoffsetx_ = 0;
  /**
   * The maximum Y offset that can be applied based on the current size of the
   *   sheet so that the sheet is not too much off the frame.
   * @private
   * @type {number}
   */
  this.maxoffsety_ = 0;
  /**
   * We need this handler to be able to bind to the wheel events.
   * @private
   * @type {goog.events.MouseWheelHandler}
   */
  this.mouseWheelHandler_ = null;
  /**
   * @private
   * @type {boolean}
   */
  this.doubleMovement_ = false;
  /**
   * @private
   * @type {boolean}
   */
  this.inWheelSequence_ = false;
  /**
   * @private
   * @type {boolean}
   */
  this.keyZoom_ = false;
  /**
   * Internal flag, if it is up we need to apply the size out of the call
   *   stack of the transition adding class.
   * @type {boolean}
   * @private
   */
  this.needsPostFitInFrameQuirk_ = false;
  /**
   * This is the delayed function for applying the new size when wheel is
   *   considered inactive. Instead ot throttling the wheel we just delay
   *   setting the size long enough as to consider the user 'done' with the
   *   re-sizing.
   * @type {goog.async.Delay}
   * @private
   */
  this.endZoomingBound_ = new goog.async.Delay(
    this.endZooming, 250, this);
  this.registerDisposable(this.endZoomingBound_);

  /**
   * Cached delayed refit, better memory management and no garbage at each run.
   * @type {goog.async.Delay}
   * @private
   */
  this.fintInFrameDelayed_ = new goog.async.Delay(this.fitInFrame, 20, this);
  this.registerDisposable(this.fintInFrameDelayed_);
  /**
   * @private
   * @type {goog.events.KeyHandler}
   */
  this.keyHandler_ = new goog.events.KeyHandler(document);
  this.registerDisposable(this.keyHandler_);
  /**
   * We need reference to those bound functions used to subscribe to pubsub in
   *   order to be able to unsibscibe
   * @type {Array.<function(this: pstj.ui.TouchSheet, goog.events.Event):
   *   undefined>}
   */
  this.bounds_ = [];

  this.subscribeToTouchablePubSub();
};
goog.inherits(pstj.ui.TouchSheet, pstj.ui.Touchable);

/** @inheritDoc */
pstj.ui.TouchSheet.prototype.disposeInternal = function() {
  this.unsibscibeToTouchPubSub();
  goog.base(this, 'disposeInternal');
  this.bounds_ = null;
  this.keyHandler_ = null;
  this.size = null;
  this.fintInFrameDelayed_ = null;
  this.endZoomingBound_ = null;
  this.cache_ = null;
  this.viewportsize_ = null;
};

/**
 * This is a imaginary impact percentile for the wheel handler. 10 seems to
 *   work fine but make sure to made this available as runtime configuration.
 * @type {number}
 */
pstj.ui.TouchSheet.prototype.wheelEventChangeImpact = 8;

/**
 * Implements the ISheet interface method.
 * @param {goog.math.Size} size The size of the parent.
 */
pstj.ui.TouchSheet.prototype.updateParentSize = function(size) {
  this.viewportsize_ = size;
  this.updateMaxOffsets();
  this.fitInFrame();
};

/**
 * This method subscribes the widget instance to the double movement pub sub
 *   channel of the touchable interface. It is used to intercept double
 *   movement events that originates from different points (possible also
 *   different branches) of the dom tree and have a cohesive reaction to them.
 *   For this to work correctly you need to have touchable listeners covering
 *   all possible areas where the user might press and also you need to have
 *   not more than one reactor subscribed to the double movement event. If you
 *   have more than one all will react to the same movement events!
 *
 * TODO: Fix leaky code here. The leak is caused by creating arrays to publish
 *   the points of movement.
 * @protected
 */
pstj.ui.TouchSheet.prototype.subscribeToTouchablePubSub = function() {
  // subscribe for the double moves as we use it extensively
  this.bounds_[0] = goog.bind(function(e) {
    if (this.isInDocument()) {
      this.endZooming();
    }
  }, this);
  this.bounds_[1] = goog.bind(function(e) {
      if (!this.isInDocument()) return;
      this.handleDoubleMove(
        [e.getBrowserEvent()['touches'][0]['clientX'],
        e.getBrowserEvent()['touches'][0]['clientY']],
        [e.getBrowserEvent()['touches'][1]['clientX'],
        e.getBrowserEvent()['touches'][1]['clientY']]);

  }, this);
  this.bounds_[2] = goog.bind(function(e) {
      if (!this.isInDocument()) return;
      this.startDoubleMove(
        [e.getBrowserEvent()['touches'][0]['clientX'],
        e.getBrowserEvent()['touches'][0]['clientY']],
        [e.getBrowserEvent()['touches'][1]['clientX'],
        e.getBrowserEvent()['touches'][1]['clientY']]);
    }, this);
  pstj.ui.Touchable.PubSub.subscribe(pstj.ui.Touchable.PubSub.DCLEAR,
    this.bounds_[0]);
  pstj.ui.Touchable.PubSub.subscribe(pstj.ui.Touchable.PubSub.DOUBLE,
    this.bounds_[1]);
  pstj.ui.Touchable.PubSub.subscribe(pstj.ui.Touchable.PubSub.DINIT,
    this.bounds_[2]);
};

/**
 * Unsubscribe from PUBSUB in case we want to dispose the component this is
 *   important in order to free the memory.
 */
pstj.ui.TouchSheet.prototype.unsibscibeToTouchPubSub = function() {
  pstj.ui.Touchable.PubSub.unsubscribe(pstj.ui.Touchable.PubSub.DCLEAR,
    this.bounds_[0]);
  pstj.ui.Touchable.PubSub.unsubscribe(pstj.ui.Touchable.PubSub.DOUBLE,
    this.bounds_[1]);
  pstj.ui.Touchable.PubSub.unsubscribe(pstj.ui.Touchable.PubSub.DINIT,
    this.bounds_[2]);
};

/**
 * Returns the bounding viewport size.
 * @return {goog.math.Size} The viewport size.
 */
pstj.ui.TouchSheet.prototype.getViewportSize = function() {
  return this.viewportsize_;
};

/**
 * Sets the size of the sheet in pixels.
 * @param {goog.math.Size} size The new size to apply.
 */
pstj.ui.TouchSheet.prototype.setSize = function(size) {
  if (!goog.math.Size.equals(size, this.size)) {
    this.size = size;
    this.updateMaxOffsets();
    this.needsSizeApplication_ = true;
    if (this.isInDocument()) {
      this.update();
    }
  }
};

/**
 * Calculates the max offsets that we can support in such a was as to be not
 *   too much off the frame.
 * @protected
 */
pstj.ui.TouchSheet.prototype.updateMaxOffsets = function() {
  if (this.isInDocument() && !goog.isNull(this.getViewportSize())) {
    this.maxoffsetx_ = this.size.width - this.getViewportSize().width;
    this.maxoffsety_ = this.size.height - this.getViewportSize().height;
    this.clientOffset_ = goog.style.getPageOffset(this.getElement());
  }
};

/** @inheritDoc */
pstj.ui.TouchSheet.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  this.getElement().style.top = 0;
  this.getElement().style.left = 0;
  this.getElement().style.position = 'absolute';
  this.applySize();
  this.mouseWheelHandler_ = new goog.events.MouseWheelHandler(
    this.getElement());
};

/** @inheritDoc */
pstj.ui.TouchSheet.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this, [
    pstj.ui.Touchable.EventType.MOVE,
    pstj.ui.Touchable.EventType.PRESS,
    pstj.ui.Touchable.EventType.RELEASE
  ], this.handleTouchableEvents);

  this.getHandler().listen(this.getElement(),
    goog.events.EventType.TRANSITIONEND, this.removeTransitions);

  this.getHandler().listen(this.mouseWheelHandler_,
    goog.events.MouseWheelHandler.EventType.MOUSEWHEEL, this.handleWheel);

  this.getHandler().listen(this.keyHandler_,
    goog.events.KeyHandler.EventType.KEY, this.handleZoomByKeys);

  this.updateMaxOffsets();
};

/**
 * Handles the keyboard controls for zoom levels.
 * @param {goog.events.KeyEvent} e The normlized keyboard event.
 * @protected
 */
pstj.ui.TouchSheet.prototype.handleZoomByKeys = function(e) {
  if (e.platformModifierKey == true) {
    switch (e.keyCode) {
      case goog.events.KeyCodes.DASH:
      case goog.events.KeyCodes.EQUALS:
      case 173:
        e.stopPropagation();
        e.preventDefault();
        this.handleKey(e.keyCode);
        break;
    }
  }
};

/**
 * Umbrealla handler for the touchable generated events that we are interested
 *   in.
 * @param {goog.events.Event} e The event generated in the Touchable layer.
 * @protected
 */
pstj.ui.TouchSheet.prototype.handleTouchableEvents = function(e) {
  switch (e.type) {
    case pstj.ui.Touchable.EventType.MOVE:
      this.onMove(/** @type {!pstj.ui.Touchable.Event} */ (e));
      break;
    case pstj.ui.Touchable.EventType.PRESS:
      this.onPress(/** @type {!pstj.ui.Touchable.Event} */ (e));
      break;
    case pstj.ui.Touchable.EventType.RELEASE:
      this.onRelease();
      break;
  }
};

/**
 * Applies the size directly via altering the style properties on the element.
 *   This is very slow for most machines and should be called only when
 *   absolutely needed. One exception is IE<10, where scaling is not supported
 *   via css.
 * @protected
 */
pstj.ui.Touchable.prototype.applySize = function() {
  if (!goog.isNull(this.size)) {
    this.getElement().style.width = this.size.width + 'px';
    this.getElement().style.height = this.size.height + 'px';
  }
};

/**
 * Helper function to remove the transition flag (class name) from the element.
 * @protected
 */
pstj.ui.TouchSheet.prototype.removeTransitions = function() {
  goog.dom.classlist.remove(this.getElement(), goog.getCssName(
    'transitioning'));
};

/**
 * Forces the sheet to be displayed in the frame. This should be called only
 *   after all size dependable calculations have been completed as it relies
 *   on the internal recorded size and the viewport size.
 *
 * TODO: Fix those calculations!!!
 * @protected
 */
pstj.ui.TouchSheet.prototype.fitInFrame = function() {
  var result = false;

  if (this.size.width < this.getViewportSize().width / 3 ||
    this.size.height < this.getViewportSize().height / 3) {
    this.needsPostFitInFrameQuirk_ = true;
    result = true;
    this.size.scaleToFit(/** @type {!goog.math.Size} */ (
      this.getViewportSize()));
  }

  if (this.size.width > this.getViewportSize().width &&
    this.size.height > this.getViewportSize().height) {

    if (this.offsetx_ < 0) {
      this.offsetx_ = 0;
      result = true;
    }
    if (this.offsety_ < 0) {
      this.offsety_ = 0;
      result = true;
    }
    if (this.size.width - this.offsetx_ < this.getViewportSize().width) {
      this.offsetx_ = this.size.width - this.getViewportSize().width;
      result = true;
    }
    if (this.size.height - this.offsety_ < this.getViewportSize().height) {
      this.offsety_ = this.size.height - this.getViewportSize().height;
      result = true;
    }
  }

  if (this.size.width >= this.getViewportSize().width) {
    if (this.offsetx_ * -1 > this.getViewportSize().width / 2) {
      this.offsetx_ = 0;
      result = true;
    }
    if (this.offsetx_ > 0 &&
      this.size.width - this.offsetx_ < this.getViewportSize().width / 2) {

      this.offsetx_ = this.size.width - this.getViewportSize().width;
      result = true;
    }
  }

  if (this.size.height >= this.getViewportSize().height) {
    if (this.offsety_ * -1 > this.getViewportSize().height / 2) {
      this.offsety_ = 0;
      result = true;
    }
    if (this.offsety_ > 0 &&
      this.size.height - this.offsety_ < this.getViewportSize().height / 2) {

      this.offsety_ = this.size.height - this.getViewportSize().height;
      result = true;
    }
  }


  if (this.size.width < this.getViewportSize().width) {
    if (this.offsetx_ > 0) {
      this.offsetx_ = (this.getViewportSize().width - this.size.width) / -2;
      result = true;
    }
    if (this.offsetx_ * -1 > this.getViewportSize().width - this.size.width) {
      this.offsetx_ = (this.getViewportSize().width - this.size.width) / -2;
      result = true;
    }
  }

  if (this.size.height < this.getViewportSize().height) {
    if (this.offsety_ > 0) {
      this.offsety_ = (this.getViewportSize().height - this.size.height) / -2;
      result = true;
    }
    if (this.offsety_ * -1 > this.getViewportSize().height - this.size.height) {
      this.offsety_ = (this.getViewportSize().height - this.size.height) / -2;
      result = true;
    }
  }

  if (result) {
    goog.dom.classlist.add(this.getElement(), goog.getCssName('transitioning'));
    this.update();
  }
};

/**
 * Handles the press action on the widget.
 * @param {pstj.ui.Touchable.Event} e The touchable event abstaction.
 */
pstj.ui.TouchSheet.prototype.onPress = function(e) {
  this.cache_[pstj.ui.TouchSheet.CACHE.FOCALX] = e.x;
  this.cache_[pstj.ui.TouchSheet.CACHE.FOCALY] = e.y;
};

/**
 * The move event from the touchable interface. In this implementation we just
 *   move the sheet to whenever the user desires regardless of the sheet frame
 *   bound box. More sophisticated imlpementation could account for the sheet
 *   frame and apply friction to the movement (à la Cocoa).
 * @param {pstj.ui.Touchable.Event} e The abstracted move touch event.
 * @protected
 */
pstj.ui.TouchSheet.prototype.onMove = function(e) {
  if (this.isMoveEnabled()) {
    this.offsetx_ += (this.cache_[pstj.ui.TouchSheet.CACHE.FOCALX] - e.x);
    this.offsety_ += (this.cache_[pstj.ui.TouchSheet.CACHE.FOCALY] - e.y);
    this.cache_[pstj.ui.TouchSheet.CACHE.FOCALX] = e.x;
    this.cache_[pstj.ui.TouchSheet.CACHE.FOCALY] = e.y;
    this.update();
  }
};

/**
 * Handles the release touchable event. This implementation simply checks to
 *   make sure that the sheet is not off the frame and if it is adds a
 *   transitioning class and alters the offsets that are already set to ones
 *   that put the sheet in the frame and hten asynchprniously calls the update
 *   method.
 * @protected
 */
pstj.ui.TouchSheet.prototype.onRelease = function() {
  this.fitInFrame();
};


/**
 * Provides the two points starting a new double move.
 * @param {Array.<number>} p1 The first touch point.
 * @param {Array.<number>} p2 The second touch point.
 */
pstj.ui.TouchSheet.prototype.startDoubleMove = function(p1, p2) {
  this.cache_[
    pstj.ui.TouchSheet.CACHE.DISTANCE] = pstj.math.utils.distanceOfSegment(
      p1, p2);

  this.cache_[pstj.ui.TouchSheet.CACHE.FOCALX] = (p1[0] + p2[0]) / 2;
  this.cache_[pstj.ui.TouchSheet.CACHE.FOCALY] = (p1[1] + p2[1]) / 2;

  this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALX] = this.cache_[
    pstj.ui.TouchSheet.CACHE.FOCALX] + this.offsetx_;

  this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALY] = this.cache_[
    pstj.ui.TouchSheet.CACHE.FOCALY] + this.offsety_;
};

/**
 * Handles the double move event as intercepted in the pubsub routine.
 * @param {Array.<number>} p1 The first touch point.
 * @param {Array.<number>} p2 The second touch point.
 */
pstj.ui.TouchSheet.prototype.handleDoubleMove = function(p1, p2) {
  this.update();
  this.doubleMovement_ = true;

  this.cache_[
    pstj.ui.TouchSheet.CACHE.CDISTANCE] = pstj.math.utils.distanceOfSegment(
      p1, p2);

  this.cache_[pstj.ui.TouchSheet.CACHE.CFOCALX] = (p1[0] + p2[0]) / 2;
  this.cache_[pstj.ui.TouchSheet.CACHE.CFOCALY] = (p1[1] + p2[1]) / 2;
};

/**
 * Handles the end of double movement.
 */
pstj.ui.TouchSheet.prototype.handleEndDoubleMove = function() {
  this.update();
  this.doubleMovement_ = false;

  this.offsetx_ = (this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALX] +
    pstj.math.utils.getValueFromPercent(
      this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALX],
      this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE])) - this.cache_[
        pstj.ui.TouchSheet.CACHE.CFOCALX];

  this.offsety_ = (this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALY] +
    pstj.math.utils.getValueFromPercent(
      this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALY],
      this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE])) - this.cache_[
        pstj.ui.TouchSheet.CACHE.CFOCALY];

  this.size.width = this.size.width + pstj.math.utils.getValueFromPercent(
    this.size.width, this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE]);

  this.size.height = this.size.height + pstj.math.utils.getValueFromPercent(
    this.size.height, this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE]);

  this.needsSizeApplication_ = true;

  this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE] = 0;
};

/**
 * Completes the zooming for both touch double move and wheel.
 */
pstj.ui.TouchSheet.prototype.endZooming = function() {
  this.update();
  this.doubleMovement_ = false;
  this.inWheelSequence_ = false;
  this.keyZoom_ = false;
  this.needsSizeApplication_ = true;

  this.offsetx_ = (this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALX] +
    pstj.math.utils.getValueFromPercent(
      this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALX],
      this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE])) - this.cache_[
        pstj.ui.TouchSheet.CACHE.CFOCALX];

  this.offsety_ = (this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALY] +
    pstj.math.utils.getValueFromPercent(
      this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALY],
      this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE])) - this.cache_[
        pstj.ui.TouchSheet.CACHE.CFOCALY];

  this.size.width = this.size.width + pstj.math.utils.getValueFromPercent(
    this.size.width, this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE]);

  this.size.height = this.size.height + pstj.math.utils.getValueFromPercent(
    this.size.height, this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE]);

  this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE] = 0;
};

/**
 * This method is called after a series of fake size updates (i.e. scale
 *   factor applyed) to clear the image and apply the new size on the element.
 *   It clears all intermediary buffers that handled the event of the wheel as
 *   well.
 * @protected
 */
pstj.ui.TouchSheet.prototype.applySizeAfterWheel = function() {
  this.update();

  this.size.width = this.size.width + pstj.math.utils.getValueFromPercent(
    this.size.width, this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE]);

  this.size.height = this.size.height + pstj.math.utils.getValueFromPercent(
    this.size.height, this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE]);

  this.offsetx_ = (this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALX] +
    pstj.math.utils.getValueFromPercent(
      this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALX],
      this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE])) - this.cache_[
        pstj.ui.TouchSheet.CACHE.CFOCALX];

  this.offsety_ = (this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALY] +
    pstj.math.utils.getValueFromPercent(
      this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALY],
      this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE])) - this.cache_[
        pstj.ui.TouchSheet.CACHE.CFOCALY];

  this.needsSizeApplication_ = true;
  this.inWheelSequence_ = false;

  this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE] = 0;
};

/** @inheritDoc */
pstj.ui.TouchSheet.prototype.draw = function() {
  var scale = 'scale(1)';

  if (this.doubleMovement_ || this.inWheelSequence_ || this.keyZoom_) {
    if (this.doubleMovement_) {
      this.doubleMovement_ = false;
      this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE] = pstj.math.utils
        .getPercentFromValue((this.cache_[
        pstj.ui.TouchSheet.CACHE.DISTANCE] - this.cache_[
          pstj.ui.TouchSheet.CACHE.CDISTANCE]), this.cache_[
            pstj.ui.TouchSheet.CACHE.DISTANCE]) * -1;
    }
    this.offsetx_ = (this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALX] +
        pstj.math.utils.getValueFromPercent(
          this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALX],
          this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE])) - (

        (pstj.math.utils.getValueFromPercent(this.size.width,
          this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE]) / 2)

      ) - this.cache_[pstj.ui.TouchSheet.CACHE.CFOCALX];

    this.offsety_ = (this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALY] +
        pstj.math.utils.getValueFromPercent(
          this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALY],
          this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE])) - (

        (pstj.math.utils.getValueFromPercent(this.size.height,
          this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE]) / 2)

      ) - this.cache_[pstj.ui.TouchSheet.CACHE.CFOCALY];

    scale = 'scale(' + (1 + (
      this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE] / 100)) + ')';
  }

  if (this.needsSizeApplication_) {
    this.needsSizeApplication_ = false;
    this.applySize();
    this.fintInFrameDelayed_.start();
  }

  if (this.needsPostFitInFrameQuirk_) {
    this.applySize();
    this.needsPostFitInFrameQuirk_ = false;
  }

  pstj.lab.style.css.setTranslation(this.getElement(), -this.offsetx_,
    -this.offsety_, undefined, scale);
  return false;
};

/**
 * Handles the mouse wheel event coming when the wheel is exerciced over the
 *   sheet.
 * @param {goog.events.MouseWheelEvent} e The wheel event abstracted by the
 *   CL.
 * @protected
 */
pstj.ui.TouchSheet.prototype.handleWheel = function(e) {
  this.update();
  e.preventDefault();
  this.endZoomingBound_.start();
  this.cache_[pstj.ui.TouchSheet.CACHE.CFOCALX] = e.getBrowserEvent(
    )['clientX'] - this.clientOffset_.x;
  this.cache_[pstj.ui.TouchSheet.CACHE.CFOCALY] = e.getBrowserEvent(
    )['clientY'] - this.clientOffset_.y;
  if (!this.inWheelSequence_) {
    this.inWheelSequence_ = true;
    this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALX] = this.cache_[
      pstj.ui.TouchSheet.CACHE.CFOCALX] + this.offsetx_;

    this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALY] = this.cache_[
      pstj.ui.TouchSheet.CACHE.CFOCALY] + this.offsety_;
  }
  if (e.deltaY < 0) {
    this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE] = this.cache_[
      pstj.ui.TouchSheet.CACHE.PERCENTCHANGE] + this.wheelEventChangeImpact;
  } else if (e.deltaY > 0) {
    this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE] = this.cache_[
      pstj.ui.TouchSheet.CACHE.PERCENTCHANGE] - this.wheelEventChangeImpact;
  }
};

/**
 * Handles the key codes directly and zooms always centered.
 * @param {number} keycode The keycode from the event.
 * @protected
 */
pstj.ui.TouchSheet.prototype.handleKey = function(keycode) {
  this.update();
  this.keyZoom_ = true;
  this.cache_[pstj.ui.TouchSheet.CACHE.CFOCALX] = Math.abs(
    this.getViewportSize().width / 2);

  this.cache_[pstj.ui.TouchSheet.CACHE.CFOCALY] = Math.abs(
    this.getViewportSize().height / 2);

  this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALX] = this.cache_[
    pstj.ui.TouchSheet.CACHE.CFOCALX] + this.offsetx_;

  this.cache_[pstj.ui.TouchSheet.CACHE.SHEETFOCALY] = this.cache_[
    pstj.ui.TouchSheet.CACHE.CFOCALY] + this.offsety_;

  if (keycode == goog.events.KeyCodes.EQUALS) {
    this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE] = this.cache_[
      pstj.ui.TouchSheet.CACHE.PERCENTCHANGE] + this.wheelEventChangeImpact;
} else if (keycode == goog.events.KeyCodes.DASH || keycode == 173) {
    this.cache_[pstj.ui.TouchSheet.CACHE.PERCENTCHANGE] = this.cache_[
      pstj.ui.TouchSheet.CACHE.PERCENTCHANGE] - this.wheelEventChangeImpact;
  }
  this.endZoomingBound_.start();
};

/**
 * Provides names for the cached values, easier for the developer, those will
 *   be replaced at compile time for faster arythmentics.
 * @enum {number}
 */
pstj.ui.TouchSheet.CACHE = {
  DISTANCE: 0, // the initial distance between two presses
  FOCALX: 1, // the x of the initial focal point
  FOCALY: 2, // the y of the initial focal point
  SHEETFOCALX: 3, // the X of the focal point in the sheet
  SHEETFOCALY: 4, //the Y of the focal point in the sheet
  CDISTANCE: 5, // the current distance value calculated from the new touches.
  CFOCALX: 6, // the x of the current focal point from the new touches.
  CFOCALY: 7, //the y of the current focal point calculated from new touches.
  PERCENTCHANGE: 8 // the change in percents.
};
