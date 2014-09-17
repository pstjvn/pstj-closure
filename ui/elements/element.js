goog.provide('pstj.ui.element.Element');

goog.require('goog.array');
goog.require('pstj.ui.Templated');
goog.require('pstj.ui.element.EventType');
goog.require('pstj.agent.Pointer');


pstj.ui.element.Element = goog.defineClass(pstj.ui.Templated, {
  /**
   * Basic auto element. The element idea is taken from Polymer and is
   * backported and applied to closure primitives. The user is encouraged
   * to use declarative syntax in the templates / html to auto assign
   * handlers for high order events and data binding.
   *
   * @constructor
   * @struct
   * @suppress {checkStructDictInheritance}
   * @extends {pstj.ui.Templated}
   * @param {pstj.ui.Template=} opt_template The template to use in the component.
   * @param {goog.dom.DomHelper=} opt_domHelper The DOM helper to use.
   */
  constructor: function(opt_template, opt_domHelper) {
    pstj.ui.Templated.call(this, opt_template, opt_domHelper);
    /**
     * @type {Array.<pstj.ui.element.Element.EventName>}
     * @private
     */
    this.autoEvents_ = null;
  },


  /** @override */
  decorateInternal: function(element) {
    goog.base(this, 'decorateInternal', element);
    if (this.getElement().hasAttribute(
        pstj.ui.element.Element.AUTO_EVENTS_ATTRIBUTE)) {

      this.autoEvents_ = this.getElement().getAttribute(
          pstj.ui.element.Element.AUTO_EVENTS_ATTRIBUTE).split(' ');
    }
  },


  /**
   * If autoevents are listed in the html/dom attach the listeners
   * to the component's root node.
   * @protected
   */
  setupAutoEvents: function() {
    if (!goog.isNull(this.autoEvents_)) {
      goog.array.forEach(this.autoEvents_, this.enableAutoEvent, this);
      pstj.agent.Pointer.getInstance().attach(this);
    }
  },


  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.setupAutoEvents();
  },


  /** @override */
  disposeInternal: function() {
    goog.base(this, 'disposeInternal');
    goog.array.clear(this.autoEvents_);
    this.autoEvents_ = null;
  },


  /**
   * Enables an event type for automatic binding.
   * @param {pstj.ui.element.Element.EventName} type
   */
  enableAutoEvent: function(type) {
    if (type == pstj.ui.element.Element.EventName.PRESS) {
      this.getHandler().listen(this, pstj.ui.element.EventType.PRESS, this.onPress);
    }
    if (type == pstj.ui.element.Element.EventName.MOVE) {
      this.getHandler().listen(this, pstj.ui.element.EventType.MOVE, this.onMove);
    }
    if (type == pstj.ui.element.Element.EventName.RELEASE) {
      this.getHandler().listen(this, pstj.ui.element.EventType.RELEASE, this.onRelease);
    }
    if (type == pstj.ui.element.Element.EventName.TAP) {
      this.getHandler().listen(this, pstj.ui.element.EventType.TAP, this.onTap);
    }
    if (type == pstj.ui.element.Element.EventName.LONGPRESS) {
      this.getHandler().listen(this, pstj.ui.element.EventType.PRESS, this.onLongPress);
    }
  },


  /**
   * Default handler for the auto event of type PRESS
   * @protected
   * @param {goog.events.Event} e The default goog event.
   */
  onPress: goog.functions.FALSE,


  /**
   * Default handler for the auto event of type MOVE
   * @protected
   * @param {goog.events.Event} e The default goog event.
   */
  onMove: goog.functions.FALSE,


  /**
   * Default handler for the auto event of type RELEASE.
   * @protected
   * @param {goog.events.Event} e The default goog event.
   */
  onRelease: goog.functions.FALSE,


  /**
   * Default handler for the long press event.
   * @protected
   * @param {goog.events.Event} e The default goog event.
   */
  onLongPress: goog.functions.FALSE,


  /**
   * Default handler for the tap event.
   * @protected
   * @param {pstj.agent.PointerEvent} e Wrapped event from the pointer agent.
   */
  onTap: goog.functions.FALSE,


  statics: {
    /**
     * The attribute to lookup for auto events.
     * @type {string}
     */
    AUTO_EVENTS_ATTRIBUTE: 'auto-events',


    /**
     * Listes the autoevent names that are automatically recognized
     * @enum {string}
     */
    EventName: {
      PRESS: 'press',
      MOVE: 'move',
      RELEASE: 'release',
      TAP: 'tap',
      LONGPRESS: 'longpress'
    }
  }
});
