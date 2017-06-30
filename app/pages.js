/**
 * @fileoverview Provides pages widget that can host any number of 'page' items
 * and switch between them, possibly animating the transition.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.app.Pages');
goog.provide('pstj.app.PagesRenderer');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.events.EventType');
goog.require('goog.log');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.app.Page');
goog.require('pstj.app.UiControl');
goog.require('pstj.material.ElementRenderer');
/** @suppress {extraRequire} */
goog.require('pstj.material.HeaderPanel');
goog.require('pstj.templates');


/** @extends {pstj.app.UiControl} */
pstj.app.Pages = goog.defineClass(pstj.app.UiControl, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.app.UiControl.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * The size od the parent element.
     * @type {goog.math.Size}
     * @private
     */
    this.parentSize_ = null;
    /**
     * The default selected child index.
     * @type {number}
     * @protected
     */
    this.selectedIndex = 0;
    /**
     * If we should use animation when switching between pages.
     *
     * When animation is used the developer should use CSS animations to set
     * things up, here we only assure that:
     * a) the display flag is set and layout is forced
     * b) the display flag is set to none after the end of the transition
     *
     * This means that is your transition does not end (i.e. you do not have
     * CSS transition applied to the element it will not be hidden as expected)
     *
     * @private
     * @type {boolean}
     */
    this.useAnimation_ = false;
    /**
     * Cahce for the index to apply with animation.
     * @private
     * @type {number}
     */
    this.nextIndexToApply_ = this.selectedIndex;
    // Basic configuration.
    this.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);
  },

  /**
   * @protected
   * @param {boolean} enable
   */
  setUseAnimation: function(enable) {
    this.useAnimation_ = enable;
  },

  /**
   * We need a logger as the logic here is a bit complex...
   * @protected
   * @type {goog.log.Logger}
   */
  logger: goog.log.getLogger('pstj.app.Pages'),

  /**
   * Setter for the selected index.
   *
   * Note that is the index is out of bound the setter will be ignored and no
   * error will be thrown, but one will be logged.
   *
   * @param {number} idx The index to select.
   * @suppress {uselessCode}
   */
  setSelectedIndex: function(idx) {
    if (idx < 0 || idx > this.getChildCount() - 1) {
      goog.log.error(this.logger, 'Attempted to set an index that is out' +
          ' of bound: ' + idx);
    } else if (idx == this.selectedIndex) {
      goog.log.info(this.logger, 'Set index to the already selected one');
    } else {
      if (goog.isNull(this.parentSize_)) {
        goog.log.warning(this.logger,
            'Cannot use animation, no parent size set');
      }
      this.nextIndexToApply_ = idx;
      if (this.useAnimation_) {
        this.setTransitioning(true);
        (/** @type {HTMLElement} */(
            this.getChildAt(this.nextIndexToApply_).getElement())
                .offsetWidth);
        this.getHandler().listenOnce(
            this.getChildAt(this.nextIndexToApply_).getElementStrict(),
            goog.events.EventType.TRANSITIONEND,
            this.onTransitionEnd);
        this.getRaf().start();
      } else {
        this.getRaf().fire();
      }
    }
  },

  /** @inheritDoc */
  onRaf: function(ts) {
    this.getChildAt(this.selectedIndex).setSelected(false);
    this.selectedIndex = this.nextIndexToApply_;
    this.getChildAt(this.selectedIndex).setSelected(true);
  },

  /** @override */
  decorateInternal: function(el) {
    goog.base(this, 'decorateInternal', el);
    if (el.hasAttribute('animate')) this.useAnimation_ = true;
  },

  /**
   * Handles the end of the transition for a subpage.
   * @param {goog.events.Event} e The DOM transition end event.
   * @protected
   */
  onTransitionEnd: function(e) {
    this.setTransitioning(false);
  },

  /**
   * Provides access to the currently selected index.
   * @return {number}
   */
  getSelectedIndex: function() {
    return this.selectedIndex;
  },

  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    if (!this.getChildAt(this.selectedIndex).isSelected()) {
      this.getChildAt(this.selectedIndex).setSelected(true);
    }
  },

  /**
   * @override
   * @return {!pstj.app.Page}
   */
  getChildAt: function(index) {
    return goog.asserts.assertInstanceof(goog.base(this, 'getChildAt',
        index), pstj.app.Page);
  }
});


/** @extends {pstj.material.ElementRenderer} */
pstj.app.PagesRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return pstj.app.PagesRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return pstj.templates.AppPages(model);
  },

  /**
   * Given the component instance attempts to determine the size of the
   * container it is put in. The container MUST be of of min-width so
   * the animations will work as expected.
   * @override
   */
  initializeDom: function(instance) {
    goog.asserts.assertInstanceof(instance, pstj.app.Pages);
    var parent = goog.dom.getParentElement(instance.getElementStrict());
    if (goog.isNull(parent)) {
      throw new Error('Element does not have a parent');
    }
    instance.parentSize_ = goog.style.getSize(parent);
  },

  statics: {
    /**
     * @const {string}
     */
    CSS_CLASS: goog.getCssName('app-pages')
  }
});
goog.addSingletonGetter(pstj.app.PagesRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.app.Pages,
    pstj.app.PagesRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.app.PagesRenderer.CSS_CLASS, function() {
      return new pstj.app.Pages(null);
    });
