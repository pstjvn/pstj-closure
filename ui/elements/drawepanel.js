goog.provide('pstj.ui.element.DrawerPanel');


goog.require('goog.dom.classlist');
goog.require('goog.style');
goog.require('pstj.templates');
goog.require('pstj.ui.Template');
goog.require('pstj.ui.element.Element');
goog.require('pstj.ui.element.EventType');
goog.require('pstj.ui.element.MediaQuery');



pstj.ui.element.DrawerPanelTemplate = goog.defineClass(pstj.ui.Template, {
  /**
   * Template for the drawer panel component.
   * @constructor
   * @struct
   * @extends {pstj.ui.Template}
   * @suppress {checkStructDictInheritance}
   */
  constructor: function() {
    pstj.ui.Template.call(this);
  },


  /** @override */
  getTemplate: function(model) {
    return pstj.templates.DrawerPanel(model);
  }
});
goog.addSingletonGetter(pstj.ui.element.DrawerPanelTemplate);


pstj.ui.element.DrawerPanel = goog.defineClass(pstj.ui.element.Element, {
  /**
   * Create a new instance of the drawer panel element.
   *
   * @constructor
   * @struct
   * @extends {pstj.ui.element.Element}
   * @param {number=} opt_responsiveWidth The width at which to change view.
   * @param {pstj.ui.Template=} opt_template The template to use in the
   *    component.
   * @param {goog.dom.DomHelper=} opt_domHelper The DOM helper to use.
   */
  constructor: function(opt_responsiveWidth, opt_template, opt_domHelper) {
    pstj.ui.element.Element.call(this,
        opt_template || pstj.ui.element.DrawerPanelTemplate.getInstance(),
        opt_domHelper);
    /**
     * The width of the drawe panel.
     * @type {number}
     * @private
     */
    this.drawerWidth_ = 256;
    /**
     * Flag for if transitions are enabled. By default they are not to avoid
     * animation when initially showing on screen.
     * @type {boolean}
     * @private
     */
    this.transition_ = false;
    /**
     * Flag to indicate if currently we are in narrow layout.
     * @type {boolean}
     * @private
     */
    this.narrow_ = false;
    /**
     * The currently selected section.
     * @type {pstj.ui.element.DrawerPanel.Section}
     * @private
     */
    this.selected_ = pstj.ui.element.DrawerPanel.Section.MAIN;


    /**
     * @type {pstj.ui.Templated}
     * @private
     */
    this.main_ = new pstj.ui.Templated();
    this.addChildAt(this.main_, 0);
    /**
     * @type {pstj.ui.Templated}
     * @private
     */
    this.drawer_ = new pstj.ui.Templated();
    this.addChildAt(this.drawer_, 1);
    /**
     * Reference to the screeining element that hides the main panel when
     * the drawer is shown in narrow mode.
     * @type {pstj.ui.element.Element}
     * @private
     */
    this.scrim_ = new pstj.ui.element.Element();
    this.main_.addChild(this.scrim_);

    this.mediaQuery_ = new pstj.ui.element.MediaQuery('max-width:' +
        ((opt_responsiveWidth) ? (opt_responsiveWidth + 'px') : '640px'));

  },


  /**
   * @param {goog.ui.Component} child The child to add.
   * @param {boolean=} opt_render If the child should be rendered.
   * @param {pstj.ui.element.DrawerPanel.Section=} opt_type The type of
   *    child arrangement we want. If skipped the child is assumed to be put
   *    in the main section.
   * @override
   */
  addChild: function(child, opt_render, opt_type) {
    // here we need to be a little more creative as we are
    // actually adding two children. Instead of making a mess of it
    // we will use a little trick. We add two very empty
    // children that we know where they are and then we add
    // components to them (drawer and main respectively)
    if (opt_type === pstj.ui.element.DrawerPanel.Section.DRAWER) {
      this.drawer_.addChild(child, opt_render);
    } else {
      this.main_.addChildAt(child, this.main_.getChildCount() - 1, opt_render);
    }
  },


  /** @override */
  decorateInternal: function(element) {
    goog.base(this, 'decorateInternal', element);
    var main = this.getElementByClass(goog.getCssName('drawer-panel-main'));
    var drawer = this.getElementByClass(goog.getCssName('drawer-panel-drawer'));

    // fall back to indexed elements.

    if (!main || !drawer) {
      if (this.getElement().children.length < 2) {
        throw new Error(
            'DrawerPanel needs at least [main] and [drawer] children');
      }
      main = this.getElement().children[1];
      drawer = this.getElement().children[0];
    }

    this.main_.decorate(main);
    this.drawer_.decorate(drawer);
    this.scrim_.decorate(
        this.getElementByClass(goog.getCssName('drawer-panel-scrim')));
  },


  /** @override */
  enterDocument: function() {

    this.drawer_.getElement().style.width = this.drawerWidth_ + 'px';
    this.getHandler().listen(
        this.mediaQuery_,
        pstj.ui.element.EventType.MEDIA_CHANGE,
        this.handleQueryMatchChange);

    this.handleQueryMatchChange(null);

    goog.base(this, 'enterDocument');

    // wait for layout and then wait for next animation frame to
    // enable transitioning.
    (new goog.async.AnimationDelay(function() {
      (new goog.async.AnimationDelay(function() {
        this.enableTransition(true);
      }, this.getDomHelper().getWindow(), this)).start();
    }, this.getDomHelper().getWindow(), this)).start();
  },


  /** @override */
  exitDocument: function() {
    goog.base(this, 'exitDocument');
    this.enableTransition(false);
  },


  /**
   * Enables or disables the transitioning of the drawer.
   * @param {boolean} enable If true the transitioninig will be enabled.
   * @protected
   */
  enableTransition: function(enable) {
    this.transition_ = enable;
    goog.dom.classlist.enable(this.getElement(), goog.getCssName('transition'),
        this.transition_);
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
    this.setNarrow_();

    if (this.isNarrow()) {
      this.setSelectedSection(pstj.ui.element.DrawerPanel.Section.MAIN);
    }

    this.dispatchEvent(pstj.ui.element.EventType.RESPONSIVE_CHANGE);
  },


  /**
   * Choses a new selected section. The corresponding classes are updated.
   * @param {pstj.ui.element.DrawerPanel.Section} section The setion to set as
   *    active/selected.
   */
  setSelectedSection: function(section) {
    this.selected_ = section;
    if (this.selected_ == pstj.ui.element.DrawerPanel.Section.DRAWER) {
      goog.dom.classlist.remove(this.main_.getElement(),
          goog.getCssName('selected'));
      this.selected_ = section;
      goog.dom.classlist.add(this.drawer_.getElement(),
          goog.getCssName('selected'));
    } else if (this.selected_ == pstj.ui.element.DrawerPanel.Section.MAIN) {
      goog.dom.classlist.remove(this.drawer_.getElement(),
          goog.getCssName('selected'));
      this.selected_ = section;
      goog.dom.classlist.add(this.main_.getElement(),
          goog.getCssName('selected'));
    }
  },


  /** @override */
  onTap: function(e) {
    if (e.target == this.scrim_) {
      this.toggleDrawer();
    }
  },


  /**
   * Toggles the panel state.
   */
  toggleDrawer: function() {
    this.setSelectedSection(
        (this.selected_ == pstj.ui.element.DrawerPanel.Section.MAIN) ?
        pstj.ui.element.DrawerPanel.Section.DRAWER :
        pstj.ui.element.DrawerPanel.Section.MAIN);
  },


  /**
   * Checks is the panel is currently in narrow mode.
   * @return {boolean}
   */
  isNarrow: function() {
    return this.narrow_;
  },


  /**
   * Sets the width to be used for the drawer.
   * @param {number} width The width to assign.
   */
  setDrawerWidth: function(width) {
    if (this.isInDocument()) {
      throw new Error('Cannot setup DrawerPanel after insertion');
    }
    this.drawerWidth_ = width;
  },


  /**
   * Sets the narrow state of the component.
   * @private
   */
  setNarrow_: function() {
    this.narrow_ =  this.mediaQuery_.queryMatches;
    goog.style.setStyle(this.main_.getElement(), 'left',
        (this.isNarrow()) ? 0 : this.drawerWidth_  + 'px');
    goog.dom.classlist.enable(
        this.getElement(),
        goog.getCssName('narrow-layout'),
        this.isNarrow());
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
