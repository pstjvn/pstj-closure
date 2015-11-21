/**
 * @fileoverview The drawer panel is a two section user interface abstraction
 * that simplifies the responsive layout for an application with menu panel and
 * main panel.
 *
 * When the screen is wide enough the menu panel is displayed at the
 * left hand side and the main panel is positioned next to it on the right
 * and is taking up the rest of the screen. When the screen is not wide enough
 * the menu panel is hidden on the left and the main panel is taking the whole
 * screen.
 *
 * The determination of the view (narrow vs wide) is based on a threshold that
 * is configurable on instantiation time and is 640 pixels by default (
 * {@see setResponsiveWidth}).
 *
 * The idea for the panel is taken directly from the polymer's own
 * core-drawer-panel code.
 *
 *
 * Limitations:
 * - Right hand menu panel is not currently supported.
 * - Because of the complex structure of the component it cannot add child
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
goog.require('goog.async.AnimationDelay');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.style');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.agent.Pointer');
goog.require('pstj.lab.style.css');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.EventMap');
goog.require('pstj.material.EventType');
goog.require('pstj.material.Panel');
goog.require('pstj.material.State');
goog.require('pstj.ui.MediaQuery');

goog.scope(function() {
var css = pstj.lab.style.css;
var E = pstj.material.Element;
var ER = pstj.material.ElementRenderer;
var EventMap = pstj.material.EventMap;
var EventType = pstj.material.EventType;
var MediaQuery = pstj.ui.MediaQuery;
var Panel = pstj.material.Panel;
var State = goog.ui.Component.State;


/** @extends {E} */
pstj.material.DrawerPanel = goog.defineClass(E, {
  /**
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
     * @type {!MediaQuery}
     * @private
     */
    this.mediaquery_ = new MediaQuery('max-width: 640px');

    // enable narrow and transitioning.
    this.setSupportedState(State.NARROW, true);
    this.setSupportedState(State.TRANSITIONING, true);

    // Auto subscribe for the events as they are always used in this component.
    this.setAutoEventsInternal(
        EventMap.EventFlag.PRESS |
        EventMap.EventFlag.MOVE |
        EventMap.EventFlag.RELEASE |
        EventMap.EventFlag.TAP);

    // Always use the pointer agent. This line makes sure that when creating
    // the element imperatively we still get the pointer agent bindings.
    // When decoration pattern is used it is set up in the default template.
    this.setUsePointerAgent(true);
  },

  /**
   * Getter for the sub-element designated as a drawer by the template.
   * @return {E}
   */
  getDrawerPanel: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(
        pstj.material.DrawerPanel.Section.DRAWER), E);
  },

  /**
   * Getter for the sub-element designated as main container.
   * @return {Panel}
   */
  getMainPanel: function() {
    return /** @type {!Panel} */(goog.asserts.assertInstanceof(this.getChildAt(
        pstj.material.DrawerPanel.Section.MAIN), Panel));
  },

  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    this.getDrawerPanel().setSupportedState(
        goog.ui.Component.State.SELECTED, true);
    this.getMainPanel().setSupportedState(
        goog.ui.Component.State.SELECTED, true);

    this.getRenderer().setDrawerWidth(this, this.getDrawerWidth());
    this.setSelectedSection(this.selectedSection_);
  },

  /**
   * Update / set the responsive with for the panel.
   * @param {number} width
   */
  setResponsiveWidth: function(width) {
    // dispose of the old instance
    this.getHandler().unlisten(this.mediaquery_,
        MediaQuery.EventType.MEDIA_CHANGE,
        this.onMediaChange);
    this.mediaquery_.dispose();

    // create new media query instance.
    this.mediaquery_ = new MediaQuery('max-width: ' + width + 'px');
    if (this.isInDocument()) {
      this.getHandler().listen(this.mediaquery_,
          MediaQuery.EventType.MEDIA_CHANGE,
          this.onMediaChange);
    }
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this.mediaquery_,
        MediaQuery.EventType.MEDIA_CHANGE,
        this.onMediaChange);
    // wait for layout and then wait for next animation frame to
    // enable transitioning.
    (new goog.async.AnimationDelay(function() {
      (new goog.async.AnimationDelay(function() {
        this.setTransitioning(true);
      }, this.getDomHelper().getWindow(), this)).start();
    }, this.getDomHelper().getWindow(), this)).start();
    // Call this because we are often rendererd with delay and the left
    // property is not set correctly
    this.onMediaChange(null);
  },

  /** @override */
  exitDocument: function() {
    goog.base(this, 'exitDocument');
    this.setTransitioning(false);
  },

  /**
   * Handler for the media matching events.
   * @param {goog.events.Event} e The media event.
   * @protected
   */
  onMediaChange: function(e) {
    // Do not propagate to parents, we use this only internally, a different
    // event is use in the component hierarchy.
    if (!goog.isNull(e)) {
      e.stopPropagation();
    }

    this.setNarrow(this.mediaquery_.queryMatches);
    // if we get into narrow mode hide the drawer.
    if (this.isNarrow()) {
      this.setSelectedSection(pstj.material.DrawerPanel.Section.MAIN);
    }
    // Emit the event for the change
    this.dispatchEvent(EventType.RESPONSIVE_CHANGE);
  },

  /**
   * Choses a new selected section. The corresponding classes are updated.
   * @param {pstj.material.DrawerPanel.Section} section The section to set
   *    as active/selected.
   */
  setSelectedSection: function(section) {
    this.selectedSection_ = section;

    this.getDrawerPanel().setSelected(
        this.selectedSection_ == pstj.material.DrawerPanel.Section.DRAWER);
    this.getMainPanel().setSelected(
        this.selectedSection_ == pstj.material.DrawerPanel.Section.MAIN);

    // If the view is narrow and he selected section is the drawer show
    // the overlay of the main panel
    if (this.isNarrow()) {
      if (this.selectedSection_ == pstj.material.DrawerPanel.Section.DRAWER) {
        this.getMainPanel().setOverlay(true);
      } else {
        this.getMainPanel().setOverlay(false);
      }
    }
  },

  /**
   * Provides API for closing the drawer.
   */
  close: function() {
    this.setSelectedSection(pstj.material.DrawerPanel.Section.MAIN);
  },

  /**
   * Provides API to open the drawer.
   */
  open: function() {
    this.setSelectedSection(pstj.material.DrawerPanel.Section.DRAWER);
  },


  /** @override */
  onTap: function(e) {
    // If the event is coming from the overlay of the main panel we need to
    // toggle the sidebar. The overlay component is sitting
    // on top of the shadow component, make sure to protect that order for
    // this to work.
    //
    // NOTE: this is not working great; the order of components is not
    // preserved when adding them imperatively: the new children are
    // rendered in the content div but the order to access them is
    // changed and thus to keep it simple is best if we can check for the
    // element directly instead of looking up the overlay component
    if (goog.dom.classlist.contains(e.getSourceElement(), goog.getCssName(
        'material-panel-overlay'))) {
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
          if (pstj.agent.Pointer.getInstance().getOriginalType() !=
              pstj.agent.Pointer.Type.MOUSE) {
            this.getMainPanel().setOverlay(true);
          }
        }
      } else {
        // If the drawer is selected (thus visible) swiping on the scrim can
        // hide it.
        if (goog.dom.classlist.contains(e.getSourceElement(), goog.getCssName(
            'material-panel-overlay'))) {
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
      this.getRenderer().setNarrow(this);
      // if we are not narrow anymore hide the overlay on the
      // main panel.
      if (!enable && this.getMainPanel().isOverlay()) {
        this.getMainPanel().setOverlay(false);
      }
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
    var sidebar = this.getRenderer().getSidebar(this);
    goog.asserts.assert(sidebar);

    if (!goog.isDef(opt_offset)) {

      css.clearTranslation(sidebar);

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

      css.setTranslation(sidebar, opt_offset, 0);
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
  getTemplate: function(model) {
    return pstj.material.template.DrawerPanel(model);
  },

  /**
   * Updates the DOM for the narrow / not-norrow state.
   * @param {pstj.material.DrawerPanel} instance
   */
  setNarrow: function(instance) {
    goog.style.setStyle(instance.getMainPanel().getElement(), 'left',
        (instance.isNarrow()) ? 0 : instance.getDrawerWidth() + 'px');
  },

  /**
   * Sets the drawer width, assumes the drawer is a regular panel.
   * @param {pstj.material.DrawerPanel} instance
   * @param {number} width
   */
  setDrawerWidth: function(instance, width) {
    var el = this.getSidebar(instance);
    if (!goog.isNull(el)) {
      goog.style.setStyle(el, 'width', width + 'px');
    }
  },

  /**
   * Provided an instance of the DrawerPanel that already has a root
   * component returns the sidebar div element.
   *
   * @param {pstj.material.DrawerPanel} instance
   * @return {Element}
   */
  getSidebar: function(instance) {
    return instance.getElementByClass(goog.getCssName(
        this.getCssClass(), 'sidebar'));
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

