/**
 * @fileoverview Provides the base class for material design implementation for
 * the closure library. We include both the base control and its renderer in
 * order to allow for some additional type checks in DEBUG mode of the code as
 * we are overloading a lot of the control base class found in the library and
 * to avoid circular dependency between the control and its renderer.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.Element');
goog.provide('pstj.material.ElementRenderer');

goog.require('goog.array');
goog.require('goog.async.AnimationDelay');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventType');
goog.require('goog.functions');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');
goog.require('goog.ui.ControlRenderer');
goog.require('goog.ui.registry');
goog.require('pstj.agent.Pointer');
goog.require('pstj.agent.Pointer.EventType');
goog.require('pstj.agent.Scroll');
goog.require('pstj.material.EventMap');
goog.require('pstj.material.State');
goog.require('pstj.material.template');
goog.require('soydata');


goog.scope(function() {
var Control = goog.ui.Control;
var EventMap = pstj.material.EventMap;
var Pointer = pstj.agent.Pointer;
var State = goog.ui.Component.State;
var pev = pstj.agent.Pointer.EventType;


/**
 * Implementation for the custom renderer.
 */
pstj.material.ElementRenderer = goog.defineClass(goog.ui.ControlRenderer, {
  /**
   * Implementation of the control renderer for the material design elements.
   * Note that several key features of the goog.ui.ControlRenderer are
   * over-ridden to make better use of the modern browsers and not all
   * features are implemented in a manner to work in older engines. This
   * base renderer should be enough for most elements. The class is designed
   * to be used as a single instance so please do not instantiate it,
   * instead use the static 'getInstance' method.
   * @constructor
   * @struct
   * @extends {goog.ui.ControlRenderer}
   * @suppress {checkStructDictInheritance}
   */
  constructor: function() {
    goog.ui.ControlRenderer.call(this);
    var baseClass = this.getStructuralCssClass();
    /**
     * @type {Object.<number, string>}
     * @private
     */
    this.classByMaterialState_ = goog.object.create(
        State.NARROW, goog.getCssName(baseClass, 'narrow'),
        State.TRANSITIONING, goog.getCssName(baseClass, 'transition'),
        State.SEAMED, goog.getCssName(baseClass, 'seamed'),
        State.SCROLL, goog.getCssName(baseClass, 'scroll'),
        State.WATERFALL, goog.getCssName(baseClass, 'waterfall'),
        State.WATERFALL_TALL, goog.getCssName(baseClass, 'waterfall-tall'),
        State.COVER, goog.getCssName(baseClass, 'cover'),
        State.STANDARD, goog.getCssName(baseClass, 'standard'),
        State.SHADOW, goog.getCssName(baseClass, 'shadow'),
        State.TALL, goog.getCssName(baseClass, 'tall'),
        State.INVALID, goog.getCssName(baseClass, 'invalid'),
        State.EMPTY, goog.getCssName(baseClass, 'empty'),
        State.INVISIBLE, goog.getCssName(baseClass, 'invisible'),
        State.RAISED, goog.getCssName(baseClass, 'raised'));

    /**
     * @type {Object.<string, number>}
     * @private
     */
    this.materialStateByClass_ = goog.object.transpose(
        this.classByMaterialState_);
  },


  /**
   * Getter for the material state that corresponds to the specified class name.
   * @override
   */
  getClassForState: function(state) {
    var result = goog.base(this, 'getClassForState', state);
    if (!goog.isDef(result)) {
      return this.classByMaterialState_[state];
    } else {
      return result;
    }
  },


  /**
   * Getter for the material state based on a specified class name.
   * @override
   */
  getStateFromClass: function(className) {
    var state = goog.base(this, 'getStateFromClass', className);
    if (state == 0) {
      state = parseInt(this.materialStateByClass_[className], 10);
    }
    return /** @type {State} */ (isNaN(state) ? 0 : state);
  },


  /**
   * Overrides the DOM creation to rely on a template.
   * @override
   * @param {goog.ui.Control} control The control to create DOM for.
   * @return {Element}
   */
  createDom: function(control) {
    goog.asserts.assertInstanceof(control, pstj.material.Element);
    var el = this.createRootElement(this.getTemplate(this.generateTemplateData(
        control)));
    goog.dom.classlist.addAll(el, this.getClassNames(control));
    this.setAriaStates(control, el);
    this.setupAutoEvents(control, el);
    return el;
  },


  /**
   * The renderer must assume a specific model of the data that is required by
   * the soy template thus it should be able to parse and prepare the model of
   * the control element and submit it to the soy template function. If your
   * control contains complex data you should override this method.
   * @param {!goog.ui.Control} control The control that needs the template.
   * @return {?}
   * @protected
   */
  generateTemplateData: function(control) {
    var model = control.getModel();
    if (model) {
      return { data: model };
    } else if (control.getContent()) {
      return {
        content: control.getContent()
      };
    } else {
      return null;
    }
  },


  /**
   * Creates a DOM tree from an html string assuring its type.
   * @param {string|soydata.SanitizedHtml} htmlstring The HTML to parse
   *    into DOM tree.
   * @return {!Element}
   * @protected
   */
  createRootElement: function(htmlstring) {
    return /** @type {!Element} */(goog.dom.htmlToDocumentFragment(
        /** @type {string} */ (htmlstring)));
  },


  /**
   * As the material elements rely on html we provide a method to get the
   * template required without chaining the rest of the logic of the renderer.
   * Simply override this method to get a different template for the same
   * element.
   * @param {?} model The model to apply on the template.
   *    The template is a soy template and accepts a single object as model
   *    parameter.
   * @return {soydata.SanitizedHtml} The output of the soy template.
   * @protected
   */
  getTemplate: function(model) {
    return pstj.material.template.CoreElement(model);
  },


  /** @override */
  getCssClass: function() {
    return pstj.material.ElementRenderer.CSS_CLASS;
  },


  /**
   * Adds the auto events to the decoration process.
   * @override
   */
  decorate: function(control, element) {
    goog.base(this, 'decorate', control, element);
    goog.asserts.assertInstanceof(control, pstj.material.Element);
    this.setupAutoEvents(control, element);
    return element;
  },


  /**
   * We do not want to override the content of the elements as they are
   * carefully crafted to have a particular structure that is linked to the
   * visual behavior.
   * @override
   */
  // setContent: function(a, b) {},


  /**
   * Extracts the known auto events from the class names.
   * @param {pstj.material.Element} control
   * @param {Element} element
   */
  setupAutoEvents: function(control, element) {
    var autoEvents = control.getAutoEvents();
    var classNames = goog.array.toArray(goog.dom.classlist.get(element));
    goog.array.forEach(classNames, function(className) {
      autoEvents |= EventMap.getEventFlagForClass(className);
    });
    control.setAutoEventsInternal(autoEvents);
  },


  /**
   * Performs a node search starting from the element passed.
   * @param {Element} element
   * @param {!string} selector
   * @return {Element}
   */
  querySelector: function(element, selector) {
    return element.querySelector(selector);
  },


  /**
   * Queries the component's root node for elements matching the query string.
   * @param {Element} element The element that we want to search in.
   * @param {!string} selector CSS query string.
   * @return {!NodeList} The node collection. Collection could be empty.
   */
  querySelectorAll: function(element, selector) {
    return element.querySelectorAll(selector);
  },


  /**
   * By default we do not want to provide key target so that the handler will
   * NOT listen for keyboard events. This is done to allow the complex material
   * element to have the focusable state but to not really create multiple
   * listeners for itself and its children components/element.
   * @override
   */
  getKeyEventTarget: function(control) {
    return null;
  },


  statics: {
    /**
     * @type {string}
     * @final
     */
    CSS_CLASS: goog.getCssName('core-element'),


    /**
     * Creates a custom renderer which is based on a custom class name and
     * optionally a custom template function.
     * @param {Function} ctor The constructor of the renderer you want to
     *    create.
     * @param {string} cssClassName The name of the CSS class for the custom
     *    renderer.
     * @param {function(Object.<string, *>=): string=} opt_templateFn Optional
     *    template soy function to use to generate the DOM.
     * @return {pstj.material.ElementRenderer} An instance of the desired
     *    renderer customized with new class name and optionally new template.
     */
    getCustomRenderer: function(ctor, cssClassName, opt_templateFn) {
      var renderer = new ctor();

      /**
       * @return {string}
       */
      renderer.getCssClass = function() {
        return cssClassName;
      };

      if (goog.isFunction(opt_templateFn)) {
        /**
         * @param {Object.<string, *>} model
         * @return {string}
         */
        renderer.getTemplate = function(model) {
          return opt_templateFn(model);
        };
      }
      return renderer;
    }
  }
});


goog.addSingletonGetter(pstj.material.ElementRenderer);


/**
 * Implementation of the Element / Material design base control.
 */
pstj.material.Element = goog.defineClass(goog.ui.Control, {
  /**
   * Implementation of the base material design element. The implementation uses
   * the ideas of the template component and assumes that the DOM will be
   * created by decorating element of constructing them from a soy template.
   * This means that we can minify the classes and also use classes to assign
   * auto events etc.
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   * @constructor
   * @extends {goog.ui.Control}
   * @struct
   * @suppress {checkStructDictInheritance}
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    Control.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * @type {goog.async.AnimationDelay}
     * @private
     */
    this.raf_ = null;
    /**
     * The mask of auto events to be assigned to the element.
     * @type {number}
     * @private
     */
    this.autoEvents_ = EventMap.EventFlag.NONE;
    // by default we disable all event handling (mouse and keyboard).
    this.setHandleMouseEvents(false);
    // Disable all states by default (make it more like the Component).
    this.setSupportedState(goog.ui.Component.State.ALLALL, false);
    this.setAutoStates(goog.ui.Component.State.ALLALL, false);
    this.setDispatchTransitionEvents(goog.ui.Component.State.ALLALL, false);
  },


  /**
   * We want to always go with the decoration via internal decorate methods as
   * we are also making deep decorator path pattern working here.
   * @override
   */
  createDom: function() {
    goog.base(this, 'createDom');
    this.decorateInternal(this.getElement());
  },


  /**
   * Augments the decoration by automatically finding the nodes marked for
   * decoration and adding them as children of the current element.
   * @override
   */
  decorateInternal: function(element) {
    goog.base(this, 'decorateInternal', element);
    // Automatically find decorative children.
    // NOTE: this was initially designed to allow one element to decorate its
    // mandatory children (i.e. Header panel -> Header and Main) and then
    // decorate its actual children (i.e. input in the main panel etc) but
    // because the child is created with decorate and the parent is not yet
    // finished with the decoration phase the "ALREADY RENDERED" error is
    // thrown. For fix see bellow.

    // Currently there is no interest in making this work and instead
    // only the imperative construction of complex UI patterns will be
    // supported.

    // THIS IS NOT WORKING! WE NEED TO FIX IT WITH smjsapp / js / tw / decrator
    var nodes = this.getDecorativeChildren();
    if (nodes.length > 0) {
      nodes = goog.array.toArray(nodes);
      for (var i = 0; i < nodes.length; i++) {
        console.log('Auto decorating:', nodes[i].className);
        var child = goog.ui.decorate(nodes[i]);
        this.addChild(child, true);
        var toRemove = goog.array.toArray(child.getDecorativeChildren());
        for (var j = 0; j < toRemove.length; j++) {
          goog.array.remove(nodes, toRemove[j]);
        }
      }
    }
  },


  /**
   * Retrieves the nodes under the root element that are marked for automatic
   * decoration.
   * @return {!NodeList}
   */
  getDecorativeChildren: function() {
    return this.querySelectorAll('[is]');
  },


  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    if (this.autoEvents_ != EventMap.EventFlag.NONE) {
      this.enableAutoEvents();
    }
  },


  /**
   * Enables/disables handling of auto assigned events. Note that those are
   * assigned once per entering the document and if you change them mid-way
   * (i.e. when your element is in the document) you need to call this method
   * again.
   */
  enableAutoEvents: function() {
    if (this.autoEvents_ & pstj.material.Element.PointerMap) {
      this.assignAutoEventHandlers_();
      Pointer.getInstance().attach(this);
    }
    if (this.hasAutoEvent(EventMap.EventFlag.SCROLL)) {
      this.assignAutoEventHandlers_();
      pstj.agent.Scroll.getInstance().attach(this);
    }
  },


  /**
   * Assigns all events that should be listened for by the pointer agent.
   * @private
   */
  assignAutoEventHandlers_: function() {
    if (this.hasAutoEvent(EventMap.EventFlag.PRESS)) {
      this.getHandler().listen(this, pev.PRESS, this.onPress);
    } else {
      this.getHandler().unlisten(this, pev.PRESS, this.onPress);
    }

    if (this.hasAutoEvent(EventMap.EventFlag.MOVE)) {
      this.getHandler().listen(this, pev.MOVE, this.onMove);
    } else {
      this.getHandler().unlisten(this, pev.MOVE, this.onMove);
    }

    if (this.hasAutoEvent(EventMap.EventFlag.RELEASE)) {
      this.getHandler().listen(this, pev.RELEASE, this.onRelease);
    } else {
      this.getHandler().unlisten(this, pev.RELEASE, this.onRelease);
    }

    // Handle swipes
    if (this.hasAutoEvent(EventMap.EventFlag.SWIPE)) {
      this.getHandler().listen(this, pev.PRESS, this.onPress);
      this.getHandler().listen(this, pev.MOVE, this.onMove);
      this.getHandler().listen(this, pev.RELEASE, this.onRelease);
    }

    // Handle ripples - note that it should NOT be used
    if (this.hasAutoEvent(EventMap.EventFlag.RIPPLE)) {
      this.getHandler().listen(this, pev.PRESS, this.onPress);
      this.getHandler().listen(this, pev.RELEASE, this.onRelease);
    }

    if (this.hasAutoEvent(EventMap.EventFlag.TAP)) {
      this.getHandler().listen(this, pev.TAP, this.onTap);
    } else {
      this.getHandler().unlisten(this, pev.TAP, this.onTap);
    }

    if (this.hasAutoEvent(EventMap.EventFlag.LONGPRESS)) {
      this.getHandler().listen(this, pev.LONGPRESS, this.onLongPress);
    } else {
      this.getHandler().unlisten(this, pev.LONGPRESS, this.onLongPress);
    }

    if (this.hasAutoEvent(EventMap.EventFlag.SCROLL)) {
      this.getHandler().listen(this, goog.events.EventType.SCROLL,
          this.onScroll);
    } else {
      this.getHandler().unlisten(this, goog.events.EventType.SCROLL,
          this.onScroll);
    }
  },


  /**
   * Updates the event mask for the element.
   * @param {number} eventMask The combination of events to auto-enable.
   */
  setAutoEventsInternal: function(eventMask) {
    this.autoEvents_ = eventMask;
  },


  /**
   * Getter for the raised state.
   * @return {boolean}
   */
  isRaised: function() {
    return this.hasState(goog.ui.Component.State.RAISED);
  },


  /**
   * Setter for the raised state.
   * @param {boolean} raised
   */
  setRaised: function(raised) {
    this.setState(goog.ui.Component.State.RAISED, raised);
  },


  /**
   * @return {boolean}
   */
  isEmpty: function() {
    return this.hasState(State.EMPTY);
  },

  /**
   * @param {boolean} empty
   */
  setEmpty: function(empty) {
    return this.setState(State.EMPTY, empty);
  },

  /**
   * @return {boolean}
   */
  isValid: function() {
    return !this.hasState(State.INVALID);
  },

  /**
   * @param {boolean} valid
   */
  setValid: function(valid) {
    this.setState(State.INVALID, !valid);
  },


  /**
   * Checks if the narrow state is currently enabled on the component.
   * @return {boolean}
   */
  isNarrow: function() {
    return this.hasState(State.NARROW);
  },


  /**
   * Updates the state related to narrow design.
   * @param {boolean} enable If true sets the state, removes it otherwise.
   */
  setNarrow: function(enable) {
    this.setState(State.NARROW, enable);
  },


  /**
   * Checks if the component has the transitioning flag on.
   * @return {boolean}
   */
  isTransitioning: function() {
    return this.hasState(State.TRANSITIONING);
  },


  /**
   * Updates the state related to transitions/animating the states.
   * @param {boolean} enable If true sets the state. Otherwise removes it.
   */
  setTransitioning: function(enable) {
    this.setState(State.TRANSITIONING, enable);
  },


  /**
   * Getter for the auto events currently configured on the material element.
   * @return {number}
   */
  getAutoEvents: function() {
    return this.autoEvents_;
  },


  /**
   * Checks if the auto event type is assigned to the list of events that the
   * control is supposed to handle automatically.
   * @param {number} eventFlag The event type to check.
   * @return {boolean}
   */
  hasAutoEvent: function(eventFlag) {
    return !!(this.autoEvents_ & eventFlag);
  },


  /**
   * Getter for the element that we want to listen for scrolling on. This is
   * mainly used by the scroll agent.
   * @return {Element}
   */
  getScrollElement: function() {
    return this.getElement();
  },


  /**
   * Returns the element on which to generate ripple effect. By default this is
   * the root element.
   * @return {!Element}
   */
  getRippleElement: function() {
    return this.getElementStrict();
  },


  /**
   * Default handler for the auto event of type PRESS
   * @protected
   * @param {pstj.agent.PointerEvent} e Wrapped event from the pointer agent.
   */
  onPress: goog.functions.TRUE,


  /**
   * Default handler for the auto event of type MOVE
   * @protected
   * @param {pstj.agent.PointerEvent} e Wrapped event from the pointer agent.
   */
  onMove: goog.functions.TRUE,


  /**
   * Default handler for the auto event of type RELEASE.
   * @protected
   * @param {pstj.agent.PointerEvent} e Wrapped event from the pointer agent.
   */
  onRelease: goog.functions.TRUE,


  /**
   * Default handler for the long press event.
   * @protected
   * @param {pstj.agent.PointerEvent} e Wrapped event from the pointer agent.
   */
  onLongPress: goog.functions.TRUE,


  /**
   * Default handler for the tap event.
   * @protected
   * @param {pstj.agent.PointerEvent} e Wrapped event from the pointer agent.
   */
  onTap: goog.functions.TRUE,


  /**
   * Handler for any  asynchronously operating events.
   * @param {number} ts The time stamp of the handler call.
   * @protected
   */
  onRaf: goog.functions.TRUE,


  /**
   * Default scroll handler. Note that we expect the scroll events to be raf
   * synced so if you are not sure how to implement this use the scroll agent
   * and the incoming events will be automatically reduced to the raf cycle.
   * @param {goog.events.Event} e
   * @protected
   */
  onScroll: goog.functions.TRUE,


  /**
   * Getter for the instance's RAF. The instance is created on demand and
   * is automatically disposed on instance disposal.
   * @protected
   * @return {goog.async.AnimationDelay}
   */
  getRaf: function() {
    if (goog.isNull(this.raf_)) {
      this.raf_ = new goog.async.AnimationDelay(this.onRaf,
          this.getDomHelper().getWindow(), this);
      this.registerDisposable(this.raf_);
    }
    return this.raf_;
  },

  /**
   * Queries the root element of the component for a specific query pattern and
   *   returns the first match.
   * @param {!string} selector The query to look up.
   * @return {Element} The first matching element or null if none matches.
   */
  querySelector: function(selector) {
    return this.getRenderer().querySelector(this.getElement(), selector);
  },


  /**
   * Queries the component's root node for elements matching the query string.
   * @param {!string} selector CSS query string.
   * @return {!NodeList} The node collection. Collection could be empty.
   */
  querySelectorAll: function(selector) {
    return this.getRenderer().querySelectorAll(this.getElement(), selector);
  },


  statics: {


    /**
     * Map of events that if we have one of them we should attach the instance
     * to the Pointer agent.
     * @type {number}
     * @final
     */
    PointerMap: (EventMap.EventFlag.PRESS |
        EventMap.EventFlag.MOVE |
        EventMap.EventFlag.RELEASE |
        EventMap.EventFlag.TAP |
        EventMap.EventFlag.SWIPE |
        EventMap.EventFlag.LONGPRESS |
        EventMap.EventFlag.RIPPLE)
  }

});


/**
 * Creates a pre-configured element from JSON config file.
 * @param {MaterialConfig} json
 * @return {pstj.material.Element}
 */
pstj.material.Element.fromJSON = function(json) {
  var i = new pstj.material.Element(json.content || undefined);
  pstj.material.Element.setupAdditionalClasses(i, json);
  return i;
};


/**
 * Enable additional class names based on the base config option of
 * classNames. This can be used to setup elements with layout classes as
 * defined imperatively in JSON configuration.
 * @param {pstj.material.Element} instance
 * @param {MaterialConfig} config
 */
pstj.material.Element.setupAdditionalClasses = function(instance, config) {
  if (goog.isDef(config.classNames)) {
    var cl = config.classNames.split(',');
    goog.array.forEach(cl, function(cname) {
      instance.enableClassName(
          pstj.material.Element.ExternalClassRefs_[goog.string.trim(cname)],
          true);
    });
  }
};


/**
 * The un-obfuscated class name to obfuscated one translation.
 * @type {Object.<string, string>}
 * @private
 */
pstj.material.Element.ExternalClassRefs_ = goog.object.create(
    'layout', goog.getCssName('layout'),
    'flex', goog.getCssName('flex'),
    'horizontal', goog.getCssName('horizontal'),
    'vertical', goog.getCssName('vertical'),
    'flex', goog.getCssName('flex'),
    'fit', goog.getCssName('fit'));


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.Element,
    pstj.material.ElementRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.ElementRenderer.CSS_CLASS, function() {
      return new pstj.material.Element(null);
    });

});  // goog.scope

