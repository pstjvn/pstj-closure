goog.provide('pstj.material.DrawerPanel');

goog.require('goog.asserts');
goog.require('goog.async.AnimationDelay');
goog.require('goog.style');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.agent.Pointer');
goog.require('pstj.lab.style.css');
goog.require('pstj.material.DrawerPanelRenderer');
goog.require('pstj.material.Element');
goog.require('pstj.material.EventMap');
goog.require('pstj.material.EventType');
goog.require('pstj.material.MediaQuery');
goog.require('pstj.material.ScrimPanel');
goog.require('pstj.material.State');


goog.scope(function() {
var css = pstj.lab.style.css;
var State = goog.ui.Component.State;
var EventMap = pstj.material.EventMap;


/**
 * Implementation for the material drawer panel.
 */
pstj.material.DrawerPanel = goog.defineClass(pstj.material.Element, {
  /**
   * Implementation of the responsive design drawer panel found in core polymer
   * elements. Note that this implementation does not provide the righ oriented
   * drawer found in the original component.
   * @constructor
   * @struct
   * @extends {pstj.material.Element}
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {pstj.material.DrawerPanelRenderer=} opt_renderer Renderer used to
   *     render or  decorate the component; defaults to {@link
   *     pstj.material.DrawerPanelRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   * @param {number=} opt_responsiveWidth The width at which to change view.
   *    component.
   */
  constructor: function(
      opt_content, opt_renderer, opt_domHelper, opt_responsiveWidth) {
    pstj.material.Element.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * The width of the drawe panel.
     * @type {number}
     * @private
     */
    this.drawerWidth_ = 256;
    /**
     * The edge distance to consider when swiping to right.
     * @type {number}
     * @private
     */
    this.swipeThreshold_ = 15;
    /**
     * The currently selected section.
     * @type {pstj.material.DrawerPanel.Section}
     * @private
     */
    this.selected_ = pstj.material.DrawerPanel.Section.MAIN;
    /**
     * The current drag status.
     * @type {boolean}
     * @private
     */
    this.dragging_ = false;
    /**
     * @type {pstj.material.MediaQuery}
     * @private
     */
    this.mediaQuery_ = new pstj.material.MediaQuery('max-width:' +
        ((opt_responsiveWidth) ? (opt_responsiveWidth + 'px') : '640px'));

    // enable narrow and transitioning.
    this.setSupportedState(State.NARROW, true);
    this.setSupportedState(State.TRANSITIONING, true);

    // enable tap for the child scrim.
    this.setAutoEventsInternal(EventMap.EventFlag.TAP);
  },


  /**
   * Adds child to the drawer.
   * @param {goog.ui.Component} child
   * @param {boolean=} opt_render
   */
  addToDrawer: function(child, opt_render) {
    this.getDrawer().addChild(child, opt_render);
  },


  /**
   * Adds child to the main panel, preserving the position of the scrim.
   * @param {goog.ui.Component} child
   * @param {boolean=} opt_render
   */
  addToMain: function(child, opt_render) {
    this.getMain().addChildAt(child, this.getMain().getChildCount() - 1,
        opt_render);
  },


  /**
   * Getter for the sub-element designated as a drawer by the template.
   * @return {pstj.material.Element}
   */
  getDrawer: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(1),
        pstj.material.Element);
  },


  /**
   * Getter for the sub-element designated as main container.
   * @return {pstj.material.ScrimPanel}
   */
  getMain: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(0),
        pstj.material.ScrimPanel);
  },


  /** @override */
  decorateInternal: function(element) {
    goog.base(this, 'decorateInternal', element);
    // Allow selected state for the two sub-components.
    this.getDrawer().setSupportedState(goog.ui.Component.State.SELECTED, true);
    this.getMain().setSupportedState(goog.ui.Component.State.SELECTED, true);
    this.getRenderer().setDrawerWidth(this, this.getDrawerWidth());
    this.setSelectedSection(this.selected_);
  },


  /** @override */
  enterDocument: function() {
    this.getHandler().listen(this.mediaQuery_,
        pstj.material.EventType.MEDIA_CHANGE, this.handleQueryMatchChange);
    this.handleQueryMatchChange(null);
    goog.base(this, 'enterDocument');

    // wait for layout and then wait for next animation frame to
    // enable transitioning.
    (new goog.async.AnimationDelay(function() {
      this.setTransitioning(true);
    }, this.getDomHelper().getWindow(), this)).start();
  },


  /** @override */
  exitDocument: function() {
    goog.base(this, 'exitDocument');
    this.setTransitioning(false);
  },


  /**
   * Handler for the media matching events.
   * @param {?goog.events.Event} e The media event.
   * @protected
   */
  handleQueryMatchChange: function(e) {
    if (!goog.isNull(e)) {
      e.stopPropagation();
    }
    this.setNarrow(this.mediaQuery_.queryMatches);

    // if we get into narrow mode hide the drawer.
    if (this.isNarrow()) {
      this.setSelectedSection(pstj.material.DrawerPanel.Section.MAIN);
    }

    this.dispatchEvent(pstj.material.EventType.RESPONSIVE_CHANGE);
  },


  /**
   * Choses a new selected section. The corresponding classes are updated.
   * @param {pstj.material.DrawerPanel.Section} section The setion to set as
   *    active/selected.
   */
  setSelectedSection: function(section) {
    this.selected_ = section;
    this.getDrawer().setSelected(
        this.selected_ == pstj.material.DrawerPanel.Section.DRAWER);
    this.getMain().setSelected(
        this.selected_ == pstj.material.DrawerPanel.Section.MAIN);
  },


  /** @override */
  onTap: function(e) {
    if (e.target == this.getMain().getScrim()) {
      this.toggleDrawer();
    }
  },


  /** @override */
  onPress: function(e) {
    // listen to those only in narrow mode
    if (this.isNarrow()) {
      // if MAIN is selected we can swipe to show the side:
      if (this.selected_ == pstj.material.DrawerPanel.Section.MAIN) {
        if (e.getPoint().x < this.swipeThreshold_) {
          this.setDragging(true);
        }
      } else {
        // If the drawer is selected (thus visible) swiping on the scrim can
        // hide it.
        if (e.getSourceElement() == this.getScrim().getElement()) {
          this.setDragging(true);
          // potentially hide the scrim.
        }
      }
    }
  },


  getScrim: function() {
    return this.getMain().getScrim();
  },


  /** @override */
  onMove: function(e) {
    if (this.isDragging()) {
      this.setDrawerPosition(e.getDistance(pstj.agent.Pointer.Direction.X));
    }
  },


  /** @override */
  onRelease: function(e) {
    if (this.isDragging()) {
      this.setDragging(false);
      if (this.selected_ == pstj.material.DrawerPanel.Section.MAIN &&
          e.getDistance(pstj.agent.Pointer.Direction.X) < 0) {
        this.setSelectedSection(pstj.material.DrawerPanel.Section.DRAWER);
      } else if (this.selected_ == pstj.material.DrawerPanel.Section.DRAWER &&
          e.getDistance(pstj.agent.Pointer.Direction.X) > 0) {
        this.setSelectedSection(pstj.material.DrawerPanel.Section.MAIN);
      }
      this.setDrawerPosition();
    }
  },


  /**
   * Sets the dragging state.
   * @param {boolean} dragging If we are currently dragging state.
   * @protected
   */
  setDragging: function(dragging) {
    this.dragging_ = dragging;
    this.setTransitioning(!this.isDragging());
  },


  /**
   * Returns the current state of nthe dragger.
   * @return {boolean}
   */
  isDragging: function() {
    return this.dragging_;
  },


  /**
   * Toggles the panel state.
   */
  toggleDrawer: function() {
    this.setSelectedSection(
        (this.selected_ == pstj.material.DrawerPanel.Section.MAIN) ?
        pstj.material.DrawerPanel.Section.DRAWER :
        pstj.material.DrawerPanel.Section.MAIN);
  },



  /**
   * Getter for the withd of the drawer panel.
   * @return {number}
   */
  getDrawerWidth: function() {
    return this.drawerWidth_;
  },


  /**
   * Sets the width to be used for the drawer.
   * @param {number} width The width to assign.
   */
  setDrawerWidth: function(width) {
    if (this.isInDocument() && width != this.drawerWidth_) {
      this.drawerWidth_ = width;
      this.getRenderer().setDrawerWidth(this, this.getDrawerWidth());
    } else {
      this.drawerWidth_ = width;
    }
  },


  /** @override */
  setNarrow: function(enable) {
    goog.base(this, 'setNarrow', enable);
    goog.style.setStyle(this.getMain().getElement(), 'left',
        (this.isNarrow()) ? 0 : this.getDrawerWidth() + 'px');
  },


  /**
   * Sets the drawer position when swiping on the component. Needed precaution
   * is taken to not over-move the drawer. If no value is provided the
   * translation is cleared.
   * @param {number=} opt_offset The offset as reported by the pointer event.
   * @protected
   */
  setDrawerPosition: function(opt_offset) {
    if (!goog.isDef(opt_offset)) {
      css.clearTranslation(this.getDrawer().getElement());
    } else {
      if (this.selected_ == pstj.material.DrawerPanel.Section.MAIN) {
        if (Math.abs(opt_offset) > this.drawerWidth_) {
          opt_offset = this.drawerWidth_ * -1;
        }
        opt_offset = opt_offset * -1 - this.drawerWidth_;
      } else {
        if (opt_offset < 0) opt_offset = 0;
        opt_offset = opt_offset * -1;
      }
      css.setTranslation(this.getDrawer().getElement(), opt_offset, 0);
    }
  },


  /**
   * Override to allow to state the exact type of the renderer.
   * @override
   * @return {pstj.material.DrawerPanelRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        pstj.material.DrawerPanelRenderer);
  },


  statics: {
    /**
     * The section types we have in the component.
     * @enum {number}
     */
    Section: {
      MAIN: 0,
      DRAWER: 1
    }
  }

});


goog.ui.registry.setDefaultRenderer(pstj.material.DrawerPanel,
    pstj.material.DrawerPanelRenderer);


goog.ui.registry.setDecoratorByClassName(
    pstj.material.DrawerPanelRenderer.CSS_CLASS, function() {
      return new pstj.material.DrawerPanel(null);
    });

});  // goog.scope

