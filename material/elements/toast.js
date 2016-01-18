goog.provide('pstj.material.Toast');
goog.provide('pstj.material.ToastRenderer');

goog.require('goog.array');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Button');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.EventType');
goog.require('pstj.material.template');
goog.require('pstj.ui.MediaQuery');


/** @extends {pstj.material.Element} */
pstj.material.Toast = goog.defineClass(pstj.material.Element, {
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
     * @type {pstj.ui.MediaQuery}
     * @private
     */
    this.mediaquery_ = new pstj.ui.MediaQuery('max-width: 640px');
    /**
     * The label to show.
     * @type {string}
     * @private
     */
    this.actionLabel_ = 'close';
    /**
     * Level of toast. Each level is supposed to be displayed on top
     * of toasts with loer level value.
     * @type {number}
     * @private
     */
    this.level_ = 0;

    // Configure the widget.
    this.setAllowTextSelection(false);
    this.setSupportedState(goog.ui.Component.State.OPENED, true);
    this.setSupportedState(goog.ui.Component.State.NARROW, true);
    this.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);
    this.setDispatchTransitionEvents(goog.ui.Component.State.OPENED, true);
    this.setAutoEventsInternal(
        pstj.material.EventMap.EventFlag.PRESS |
        pstj.material.EventMap.EventFlag.MOVE |
        pstj.material.EventMap.EventFlag.RELEASE |
        pstj.material.EventMap.EventFlag.TAP);
    this.setUsePointerAgent(true);
  },

  /** @override  */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this.mediaquery_,
        pstj.ui.MediaQuery.EventType.MEDIA_CHANGE, this.onMediaChange);
  },

  /**
   * Handles the media change (screen size changes).
   * @param {goog.events.Event} e The MEDIA_CHANGE event.
   * @protected
   */
  onMediaChange: function(e) {
    if (!goog.isNull(e)) e.stopPropagation();
    this.setNarrow(this.mediaquery_.queryMatches);
  },

  /**
   * Getter for the level value.
   * @return {number}
   */
  getLevel: function() {
    return this.level_;
  },

  /**
   * Allows the toast to be on top of another toast (or many toasts).
   * The exact way it will be interpreted depends on the renderer.
   * @param {number} level A number signifying a level above which
   * the current toast is displayed. Values should be 0 and larger.
   */
  setLevel: function(level) {
    if (this.getLevel() != level) {
      this.level_ = level;
    }
  },

  /**
   * Update the button label.
   * @param {string} label The new label to show.
   */
  setLabel: function(label) {
    if (label != this.actionLabel_) {
      this.actionLabel_ = label;
      if (this.getChildCount() > 0) {
        this.getChildAt(0).setContent(label);
      }
    }
  },

  /** @override  */
  decorateInternal: function(el) {
    goog.base(this, 'decorateInternal', el);
    this.actionLabel_ = goog.asserts.assertString(
        this.getChildAt(0).getContent());
  },

  /**
   * Toggle the toast.
   */
  toggle: function() {
    this.setOpen(!this.isOpen());
  },

  /** @override  */
  setOpen: function(enable) {
    this.setTransitioning(true);
    goog.base(this, 'setOpen', enable);
  },

  /** @override */
  onTap: function(e) {
    if (e.target == this) {
      this.setOpen(false);
    }
  }
});


/** @extends {pstj.material.ElementRenderer} */
pstj.material.ToastRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return pstj.material.ToastRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return pstj.material.template.Toast(model);
  },

  /** @override */
  generateTemplateData: function(toast) {
    return {
      text: toast.getContent() || '',
      label: toast.actionLabel_
    };
  },

  /** @override */
  getContentElement: function(el) {
    return goog.dom.getElementByClass(goog.getCssName(
        this.getCssClass(), 'text'), el);
  },

  /**
   * Updates the DOM so it will matches the level.
   * @param {pstj.material.Toast} toast The instance to update.
   */
  setLevel: function(toast) {
    goog.array.forEach(toast.getExtraClassNames(), function(cn) {
      toast.removeClassName(cn);
    });
    switch (toast.getLevel()) {
      case 1:
        toast.addClassName(goog.getCssName(this.getCssClass(), 'l1'));
        break;
      case 2:
        toast.addClassName(goog.getCssName(this.getCssClass(), 'l2'));
        break;
      case 3:
        toast.addClassName(goog.getCssName(this.getCssClass(), 'l3'));
        break;
      case 4:
        toast.addClassName(goog.getCssName(this.getCssClass(), 'l4'));
        break;
    }
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('material-toast')
  }
});
goog.addSingletonGetter(pstj.material.ToastRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.Toast,
    pstj.material.ToastRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.ToastRenderer.CSS_CLASS, function() {
      return new pstj.material.Toast(null);
    });
