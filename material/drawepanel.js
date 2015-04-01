/**
 * @fileoverview The drawer panel is a two section user interface abstraction
 * that simplifies the responsive layout for an application with menu panel and
 * main panel.
 *
 * When the screen is wide enough the menu panel is displayed at the
 * left hand side and the main panel is positioned right next to it on its right
 * and is taking up the rest of the screen. When the screen is not wide enough
 * the menu panel is hidden on the left and the main panel is taking the whole
 * screen.
 *
 * The 'enough' threshold is configurable on instantiation time and is 640
 * pixels by default.
 *
 * This implementation does not support right hand menu panel, should this be of
 * any interest it can be easily added.
 *
 * The idea for the panel is taken directly from the polymer's own
 * core-drawer-panel code.
 *
 * NOTE: because of the complex structure of the component it cannot add child
 * nodes before it is decorated/element created as the drawer/main panels are
 * actually children of the drawer panel. Future implementation that is a
 * composite of two independent nodes will not have this limitation. For now
 * first render / decorate the node and only then attempt to add child nodes
 * with 'addToHeader' and 'addToMain'.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.DrawerPanel');
goog.provide('pstj.material.DrawerPanelRenderer');

goog.require('goog.asserts');
goog.require('goog.style');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.lab.style.css');
goog.require('pstj.material.Element');
goog.require('pstj.material.EventMap');
goog.require('pstj.material.EventType');
goog.require('pstj.material.MediaQuery');
goog.require('pstj.material.Panel');
goog.require('pstj.material.State');


goog.scope(function() {
var css = pstj.lab.style.css;
var E = pstj.material.Element;
var ER = pstj.material.ElementRenderer;
var EventMap = pstj.material.EventMap;
var EventType = pstj.material.EventType;
var MediaQuery = pstj.material.MediaQuery;
var Panel = pstj.material.Panel;
var State = goog.ui.Component.State;


/**
 * Implementation for the material drawer panel.
 */
pstj.material.DrawerPanel = goog.defineClass(E, {
  /**
   * @constructor
   * @struct
   * @extends {E}
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {pstj.material.DrawerPanelRenderer=} opt_renderer Renderer used to
   *     render or  decorate the component; defaults to {@link
   *     pstj.material.DrawerPanelRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    goog.base(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * The width of the drawer panel.
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
    this.selectedSection_ = pstj.material.DrawerPanel.Section.MAIN;
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
    this.mediaquery_ = new MediaQuery('max-width: 640px');

    // enable narrow and transitioning.
    this.setSupportedState(State.NARROW, true);
    this.setSupportedState(State.TRANSITIONING, true);
    this.setAutoEventsInternal(
        EventMap.EventFlag.PRESS |
        EventMap.EventFlag.MOVE |
        EventMap.EventFlag.RELEASE |
        EventMap.EventFlag.TAP);

    this.setUsePointerAgent(true);
  },


  /**
   * Getter for the sub-element designated as a drawer by the template.
   * @return {E}
   */
  getDrawer: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(
        pstj.material.DrawerPanel.Section.DRAWER), E);
  },


  /**
   * Getter for the sub-element designated as main container.
   * @return {Panel}
   */
  getPanel: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(
        pstj.material.DrawerPanel.Section.MAIN), Panel);
  },


  /** @override */
  decorateInternal: function(element) {
    goog.base(this, 'decorateInternal', element);
    // Allow selected state for the two sub-components.
    this.getDrawer().setSupportedState(goog.ui.Component.State.SELECTED, true);
    this.getPanel().setSupportedState(goog.ui.Component.State.SELECTED, true);
    // Update the
    this.getRenderer().setDrawerWidth(this, this.getDrawerWidth());
    this.setSelectedSection(this.selectedSection_);
  },


  /**
   * Update / set the responsive with for the panel.
   * @param {number} width
   */
  setResponsiveWidth: function(width) {
    this.getHandler().unlisten(this.mediaquery_,
        pstj.material.EventType.MEDIA_CHANGE,
        this.onMediaChange);
    this.mediaquery_.dispose();
    this.mediaquery_ = new MediaQuery('max-width: ' + width + 'px');
    if (this.isInDocument()) {
      this.getHandler().listen(this.mediaquery_,
          pstj.material.EventType.MEDIA_CHANGE,
          this.onMediaChange);
    }
  },


  /** @override */
  enterDocument: function() {
    this.getHandler().listen(this.mediaquery_,
        pstj.material.EventType.MEDIA_CHANGE,
        this.onMediaChange);
    // Update state artificially on entering the doc.
    this.onMediaChange(null);

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
  onMediaChange: function(e) {
    if (!goog.isNull(e)) {
      e.stopPropagation();
    }
    this.setNarrow(this.mediaquery_.queryMatches);
    // if we get into narrow mode hide the drawer.
    if (this.isNarrow()) {
      this.setSelectedSection(pstj.material.DrawerPanel.Section.MAIN);
    }
    this.dispatchEvent(EventType.RESPONSIVE_CHANGE);
  },


  /**
   * Choses a new selected section. The corresponding classes are updated.
   * @param {number} section The section to set as active/selected.
   */
  setSelectedSection: function(section) {
    this.selectedSection_ = section;
    this.getDrawer().setSelected(
        this.selectedSection_ == pstj.material.DrawerPanel.Section.DRAWER);
    this.getPanel().setSelected(
        this.selectedSection_ == pstj.material.DrawerPanel.Section.MAIN);
    if (this.isNarrow()) {
      if (this.selectedSection_ == pstj.material.DrawerPanel.Section.DRAWER) {
        this.getPanel().setScrimed(true);
      } else {
        this.getPanel().setScrimed(false);
      }
    }
  },


  /** @override */
  onTap: function(e) {
    if (e.getSourceElement() == this.getPanel().getScrim().getElement()) {
      this.toggleDrawer();
    }
  },


  /** @override */
  onPress: function(e) {
    // listen to those only in narrow mode
    if (this.isNarrow()) {
      // if MAIN is selected we can swipe to show the side:
      if (this.selectedSection_ == pstj.material.DrawerPanel.Section.MAIN) {
        if (e.getPoint().x < this.swipeThreshold_) {
          this.setDragging(true);
        }
      } else {
        // If the drawer is selected (thus visible) swiping on the scrim can
        // hide it.
        if (e.getSourceElement() == this.getPanel().getScrim().getElement()) {
          this.setDragging(true);
          // potentially hide the scrim.
        }
      }
    }
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
      if (
          (this.selectedSection_ == pstj.material.DrawerPanel.Section.MAIN) &&
          (e.getDistance(pstj.agent.Pointer.Direction.X) < 0)
      ) {
        this.setSelectedSection(pstj.material.DrawerPanel.Section.DRAWER);
      } else if (
          (this.selectedSection_ == pstj.material.DrawerPanel.Section.DRAWER) &&
          (e.getDistance(pstj.agent.Pointer.Direction.X) > 0)
      ) {
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
   * Returns the current state of the dragger.
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
        (this.selectedSection_ == pstj.material.DrawerPanel.Section.MAIN) ?
        pstj.material.DrawerPanel.Section.DRAWER :
        pstj.material.DrawerPanel.Section.MAIN);
  },



  /**
   * Getter for the width of the drawer panel.
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
    if (this.drawerWidth_ != width) {
      this.drawerWidth_ = width;
      if (this.isInDocument()) {
        this.getRenderer().setDrawerWidth(this, this.getDrawerWidth());
      }
    }
  },


  /** @override */
  setNarrow: function(enable) {
    goog.base(this, 'setNarrow', enable);
    if (this.getElement()) {
      this.getRenderer().setNarrow(this, this.isNarrow());
    }
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
      if (this.selectedSection_ == pstj.material.DrawerPanel.Section.MAIN) {
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


/** Implementation for the material drawer renderer */
pstj.material.DrawerPanelRenderer = goog.defineClass(ER, {
  /**
   * @constructor
   * @extends {ER}
   */
  constructor: function() {
    goog.base(this);
  },

  /** @inheritDoc */
  getCssClass: function() {
    return pstj.material.DrawerPanelRenderer.CSS_CLASS;
  },

  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.template.DrawerPanel(m);
  },

  /**
   * Updates the DOm for the narrow / not-norrow state.
   * @param {pstj.material.DrawerPanel} instance
   */
  setNarrow: function(instance) {
    goog.style.setStyle(instance.getPanel().getElement(), 'left',
        (instance.isNarrow()) ? 0 : instance.getDrawerWidth() + 'px');
  },


  /**
   * Sets the drawer width for this rendered dom structure.
   * @param {pstj.material.DrawerPanel} instance
   * @param {number} width
   */
  setDrawerWidth: function(instance, width) {
    var el = this.querySelector(instance.getElement(), '.' + goog.getCssName(
        this.getCssClass(), 'drawer'));
    goog.style.setStyle(el, 'width', width + 'px');
  },

  statics: {
    CSS_CLASS: goog.getCssName('material-drawer-panel')
  }
});
goog.addSingletonGetter(pstj.material.DrawerPanelRenderer);


goog.ui.registry.setDefaultRenderer(pstj.material.DrawerPanel,
    pstj.material.DrawerPanelRenderer);


goog.ui.registry.setDecoratorByClassName(
    pstj.material.DrawerPanelRenderer.CSS_CLASS, function() {
      return new pstj.material.DrawerPanel(null);
    });

});  // goog.scope

