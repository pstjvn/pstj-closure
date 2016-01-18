goog.provide('pstj.material.Icon');
goog.provide('pstj.material.Icon.EventType');

goog.require('goog.events.EventType');
goog.require('pstj.autogen.icons.names');
goog.require('pstj.material.Element');
goog.require('pstj.material.IconRenderer');


/**
 * Implements the material icon. The class representa a single icon and is
 * static, meaning that its renderer will pick up the icon at creation time and
 * from then on the icon can only mutate to known configurations. Should
 * the icon need to mutate to a form it does not support it will fire the
 * 'REPLACE' event and the container should instanciate a new icon which
 * contains the required SVG set for that icon instead and dispose of the
 * previous instance.
 *
 * The class implements a single instance with its mutations. The allowed
 * mutations are pre-defined for each SVG set. The IconContainer class should
 * manage those.
 *
 * In order to allow animated change of icons when the same renderer does not
 * support the state we want to go into 'indirect mutation' could be applied.
 * For this to work you need to use the {@see IconContainer} class.
 */
pstj.material.Icon = goog.defineClass(pstj.material.Element, {
  /**
   * @constructor
   * @extends {pstj.material.Element}
   * @struct
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    goog.base(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * The name of the icon that should be currently displayed.
     * @type {pstj.autogen.icons.names}
     */
    this.type = pstj.autogen.icons.names.NONE;
  },


  /** @inheritDoc */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    // Subscribe for the animation end - used for svg elements that we mutate
    // with css animations.
    this.getHandler().listen(this.getElementStrict(),
        goog.events.EventType.ANIMATIONEND, this.onAnimationEnd);
  },


  /**
   * Handles the end of an animation (keyframes). In this default implementation
   * it only resets the type attribute to the current type.
   * @param {goog.events.BrowserEvent} e
   * @protected
   */
  onAnimationEnd: function(e) {
    if (this.dispatchEvent(pstj.material.Icon.EventType.MORPHEND)) {
      this.getRenderer().resetType(this);
    }
  },


  /**
   * Sets the icon type.
   * Previously available checks (if the SVG can actually resolved the
   * icon type) are extracted into the icon container in order to support
   * the dev/compiled differences in icon creation.
   *
   * @param {pstj.autogen.icons.names} iconName
   */
  setIcon: function(iconName) {
    this.getRenderer().setType(this, iconName);
    this.type = iconName;
  },


  /**
   * Assert the type of the renderer to be compatible with the requirements
   * of the icon class.
   * @override
   * @return {pstj.material.IconRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        pstj.material.IconRenderer);
  }
});


/**
 * The event type we fire when an icon finished transforming from one to
 * another. We call it 'morphing' and the event is fired when the css
 * animation ends.
 * @enum {string}
 */
pstj.material.Icon.EventType = {
  MORPHEND: goog.events.getUniqueId('morph-end')
};
