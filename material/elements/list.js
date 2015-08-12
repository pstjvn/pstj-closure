goog.provide('pstj.material.List');
goog.provide('pstj.material.ListRenderer');

goog.require('goog.dom');
goog.require('goog.dom.animationFrame');
goog.require('goog.events.EventType');
goog.require('goog.log');
goog.require('goog.style');
goog.require('goog.ui.registry');
goog.require('pstj.lab.style.css');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');


/** @extends {pstj.material.Element} */
pstj.material.List = goog.defineClass(pstj.material.Element, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.material.Element.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * @final
     * @type {goog.debug.Logger}
     * @private
     */
    this.logger_ = goog.log.getLogger('pstj.material.List');
    /**
     * The call to use to create a new list item.
     * @type {?function(): goog.ui.Control}
     * @private
     */
    this.createListElement_ = null;
    /**
     * The height of a single element.
     * @type {!number}
     * @private
     */
    this.itemHeight_ = 0;
    /**
     * The last scroll we updated on.
     * @type {!number}
     * @private
     */
    this.lastScrollTop_ = 0;
    /**
     * Our own DOM node height.
     * @type {!number}
     * @private
     */
    this.height_ = 0;
    /**
     * The measure / mutate passes.
     * @type {?function(...?)}
     * @private
     */
    this.onScroll_ = goog.dom.animationFrame.createTask({
      measure: this.measurePass_,
      mutate: this.mutatePass_
    }, this);
    /**
     * Flag, if the scroll position is going down from last update.
     * @type {boolean}
     * @private
     */
    this.goingDown_ = true;
    /**
     * The index of the physically visible item.
     * @type {number}
     * @private
     */
    this.phisicalStart_ = 0;
    /**
     * The index of the last item drawn physically.
     * @type {number}
     * @private
     */
    this.phisicalEnd_ = 0;
    /**
     * Virtual offset used to calculate children indexes.
     * @type {number}
     * @private
     */
    this.virtualOffset_ = 0;
    /**
     * Cache for the length of the model. When we scroll right to the bottom
     * at least one item remains without model, thus we must prevent this
     * from breaking JS execution.
     * @type {number}
     * @private
     */
    this.modelLength_ = 0;
    /**
     * Cache for the total height
     * @type {number}
     */
    this.scrollTargetHeight_ = 0;
    /**
     * Reference to the item that might get drawn over the scroll limit
     * when scrolling too fast with the mouse.
     * @type {goog.ui.Component}
     * @private
     */
    this.overboardItem_ = null;
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.height_ = goog.style.getSize(this.getElement()).height;
    this.setModel(this.getModel());
    this.getHandler().listen(this.getElement(), goog.events.EventType.SCROLL,
        this.handleScroll);
  },

  /**
   * @private
   * @param {!goog.dom.animationFrame.State} state
   */
  measurePass_: function(state) {
    var currentScrollTop = this.getElement().scrollTop;
    this.goingDown_ = currentScrollTop - this.lastScrollTop_ > 0;
    this.lastScrollTop_ = currentScrollTop;
  },

  /**
   * @private
   * @param {!goog.dom.animationFrame.State} state
   */
  mutatePass_: function(state) {
    var newphisicalstart = Math.floor(this.lastScrollTop_ / this.itemHeight_);
    var newphisicalend = newphisicalstart + this.getChildCount() - 1;
    if (this.goingDown_) {
      if (newphisicalstart < this.phisicalEnd_) {
        var count = newphisicalstart - this.phisicalStart_;
        for (var i = 0; i < count; i++) {
          var npi = this.phisicalEnd_ + i + 1;
          if (npi < this.modelLength_) {
            var child = this.getChildAtVirtual(i);
            this.setModelForItem_(child, npi);
            this.applyPosition(child, npi);
          }
        }
        this.virtualOffset_ = this.virtualOffset_ + count;
        if (this.virtualOffset_ >= this.getChildCount()) {
          this.virtualOffset_ -= this.getChildCount();
        }
        this.phisicalStart_ = newphisicalstart;
        this.phisicalEnd_ = newphisicalend;
      } else {
        this.forEachChild(function(child, i) {
          this.setModelForItem_(child, newphisicalstart + i);
          this.applyPosition(child, newphisicalstart + i);
        }, this);
        this.virtualOffset_ = 0;
        this.phisicalStart_ = newphisicalstart;
        this.phisicalEnd_ = newphisicalend;
      }
    } else {
      if (newphisicalend > this.phisicalStart_) {
        var count = this.phisicalEnd_ - newphisicalend;
        for (var i = 0; i < count; i++) {
          var child = this.getChildAtVirtual(this.getChildCount() - 1 - i);
          this.setModelForItem_(child, this.phisicalStart_ - 1 - i);
          this.applyPosition(child, this.phisicalStart_ - 1 - i);
        }
        this.virtualOffset_ = this.virtualOffset_ - count;
        if (this.virtualOffset_ < 0) {
          this.virtualOffset_ += this.getChildCount();
        }
        this.phisicalStart_ = newphisicalstart;
        this.phisicalEnd_ = newphisicalend;
      } else {
        this.forEachChild(function(child, i) {
          this.setModelForItem_(child, newphisicalstart + i);
          this.applyPosition(child, newphisicalstart + i);
        }, this);
        this.virtualOffset_ = 0;
        this.phisicalStart_ = newphisicalstart;
        this.phisicalEnd_ = newphisicalend;
      }
    }
  },

  /**
   * Returns the correct child index when transformations of children are
   * applied on irregular steps.
   *
   * @param {number} i The index to get.
   * @return {goog.ui.Component} The actual child in the DOM tree with matching
   *    the index.
   * @protected
   */
  getChildAtVirtual: function(i) {
    var index = i + this.virtualOffset_;
    if (index >= this.getChildCount()) {
      index -= this.getChildCount();
    }
    return this.getChildAt(index);
  },

  /**
   * @protected
   * @param {goog.events.Event} e The scroll event.
   */
  handleScroll: function(e) {
    this.onScroll_();
  },

  /** @override */
  setModel: function(model) {
    if (this.isInDocument()) {
      var old_model = this.getModel();
      if (!goog.isNull(old_model)) {
        this.removeModelListeners();
      }
    }

    goog.base(this, 'setModel', model);
    if (!goog.isNull(this.getModel())) {
      this.modelLength_ = this.getModelCount();
      if (this.isInDocument()) {
        this.addModelListeneres();
        this.initialize();
      }
    } else {
      this.modelLength_ = 0;
    }
  },

  /**
   * We assume all elements have equal height.
   */
  initialize: function() {
    if (!goog.isNull(this.getModel())) {
      this.measureItemHeight();
      this.scrollTargetHeight_ = this.getModelCount() * this.itemHeight_;
      this.getRenderer().setScrollHeight(
          this.getElement(), this.scrollTargetHeight_);

      this.initElements_();
    }
  },

  /**
   * Method to create / trim elements needed for the list.
   *
   * // TODO: Make this smarter so it will work with resize and without
   * // offsetting the list to the top.
   *
   * @private
   */
  initElements_: function() {
    var count = Math.ceil(this.height_ / this.itemHeight_) + 1;
    if (this.hasChildren()) {
      if (count == this.getChildCount()) return;
      goog.array.forEach(this.removeChildren(), function(child) {
        goog.dispose(child);
      });
    }

    if (count > this.modelLength_) count = this.modelLength_;

    // Init elements.
    for (var i = 0; i < count; i++) {
      var child = this.createListElement_();
      this.addChild(child, true);
      this.setModelForItem_(child, i);
      this.applyPosition(child, i);
    }
    this.phisicalStart_ = 0;
    this.phisicalEnd_ = count - 1;
    this.virtualOffset_ = 0;
    // Scroll to the top.
    this.getElement().scrollTop = 0;
  },

  /**
   * Method specifically designed to be overridden.
   *
   * Returns the current length of the model. If you utilize custom model
   * objects override this method to make it return the length of items in
   * your custom model.
   *
   * @return {!number}
   * @protected
   */
  getModelCount: function() {
    var model = this.getModel();
    if (goog.isNull(model)) return 0;
    return model.length;
  },

  /**
   * Force the model lenght update.
   *
   * This is useful for subclasses that use events to monitor for model
   * changes and need to recalculate when model changes.
   */
  updateModelLength: function() {
    this.modelLength_ = this.getModelCount();
  },

  /**
   * Handles the update of a child item in the list with a new
   * model instance from the listing model.
   *
   * @param {goog.ui.Component} item The component instance to update.
   * @param {number} index The model index to apply.
   * @private
   */
  setModelForItem_: function(item, index) {
    if (index < 0 || index > this.modelLength_ - 1) {
      this.overboardItem_ = item;
      goog.style.setOpacity(item.getElement(), 0);
      return;
    } else {
      if (item == this.overboardItem_) {
        this.overboardItem_ = null;
        goog.style.setOpacity(item.getElement(), 1);
      }
    }
    this.setModelForItemInternal(item, index);
  },

  /**
   * Sets the model on the specified item using the index to extract a
   * specific model item.
   *
   * Override this method if your model's item is expected to be
   * set differently (for example using 'setModel').
   *
   * @param {goog.ui.Component} item The component instance to update.
   * @param {number} index The model index to apply.
   * @protected
   */
  setModelForItemInternal: function(item, index) {
    item.setContent(this.getModel()[index].toString());
  },

  /**
   * Applies the physical position of a virtual element.
   * @param {goog.ui.Component} child
   * @param {number} position The index to position the child on.
   * @protected
   */
  applyPosition: function(child, position) {
    pstj.lab.style.css.setTranslation(child.getElement(),
        0, position * this.itemHeight_);
  },

  /**
   * Allows for imperatively setting the item height.
   * @param {!number} height
   */
  setItemHeight: function(height) {
    this.itemHeight_ = height;
  },

  /**
   * Allows for imperatively setting the height of the container. This is
   * mostly due to the flexing of the views.
   * @param {!number} height
   */
  setHeight: function(height) {
    this.height_ = height;
  },

  /**
   * Attempts to measure the height of a single item in the view.
   * @protected
   * @suppress {uselessCode}
   */
  measureItemHeight: function() {
    if (this.itemHeight_ == 0) {
      if (this.getChildCount() == 0) {
        if (!goog.isNull(this.createListElement_)) {
          var item = this.createListElement_();
          this.addChild(item, true);
          item.getElement().offsetHeight;
          this.itemHeight_ = goog.style.getSize(item.getElement()).height;
          this.removeChild(item);
          goog.dispose(item);
        } else {
          goog.log.warning(this.logger_, 'Does not have element creation set');
        }
      } else {
        throw new Error('Cannot measure items after first item added');
      }
    }
  },

  /**
   * Add listeners to the model so we can reflect changes in it.
   * @protected
   */
  addModelListeneres: function() {},

  /**
   * Removes previously added listeners to the model so we can free it.
   * @protected
   */
  removeModelListeners: function() {},

  /** @override */
  disposeInternal: function() {
    goog.base(this, 'disposeInternal');
    this.createListElement_ = null;
    this.onScroll_ = null;
    this.overboardItem_ = null;
  },

  /**
   * Sets the function that should be able to create list item instances.
   * @param {!function(): goog.ui.Control} fn
   */
  setCreateListItem: function(fn) {
    this.createListElement_ = fn;
  },

  /**
   * @override
   * @return {pstj.material.ListRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        pstj.material.ListRenderer);
  }
});


/** @extends {pstj.material.ElementRenderer} */
pstj.material.ListRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return pstj.material.ListRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return pstj.material.template.List(null);
  },

  /**
   * Updates the height of the scroll target element.
   * @param {Element} el The root DOM element.
   * @param {!number} height
   */
  setScrollHeight: function(el, height) {
    goog.style.setHeight(this.getScrollTarget(el), height);
  },

  /** @override */
  getContentElement: function(el) {
    return this.getScrollTarget(el);
  },

  /**
   * Getter for the scroll target of the list.
   * @param {Element} el The root DOM element.
   * @return {Element} The target element.
   */
  getScrollTarget: function(el) {
    return goog.dom.getElementByClass(goog.getCssName(
        this.getStructuralCssClass(), 'scroll-target'));
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('material-list')
  }
});
goog.addSingletonGetter(pstj.material.ListRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.List,
    pstj.material.ListRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.ListRenderer.CSS_CLASS, function() {
      return new pstj.material.List(null);
    });
