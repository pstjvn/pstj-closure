goog.provide('pstj.ui.TemplateRenderer');

goog.require('');

/**
 * My new class description
 * @constructor
 */
pstj.ui.TemplateRenderer = function() {};
goog.addSingletonGetter(pstj.ui.TemplateRenderer);

pstj.ui.TemplateRenderer.DECORATE_CSS_CLASS = 'decorate';

goog.scope(function() {

  var _ = pstj.ui.TemplateRenderer.prototype;

  /**
   * Returns the html sring to be the DOM for a component instance.
   * @param {*} model The component's model if any.
   * @return {string} The HTML of the component.
   */
  _.getTemplate = function(model) {
    return '<div></div>';
  };

  /**
   * Returns the compiled DOM from the html template. This is required to
   *   allow the component to have referrence to a root DOM node.
   * @param {*} model The model of the component if any to use in building the
   *   template.
   * @return {Element} The constructed element.
   */
  _.getTemplateCompiled_ = function(model) {
    return /** @type {!Element} */ (goog.dom.htmlToDocumentFragment(
      this.getTemplate(model)));
  };

  /**
   * Creates the root DOM node for the component. Internally it will call the
   *   decoration sub-routine on the component instance.
   * @param {goog.ui.Component} component The component to work with.
   */
  _.createDom = function(component) {
    component.decorateInternal(this.getTemplateCompiled_(component.getModel()));
  };

  /**
   * Bu default find all subcomponents that require decoration and try to
   *   decorate them.
   *
   * TODO: fix this and make sure comonents have correct children / parent
   *   relations.
   * @param {goog.ui.Component} component The component that is the structure
   *   to decorate.
   * @param {Eleent} el The element bound to the component.
   */
  _.decorate = function(component, el) {
    // Find all element that require decoration by class name
    var toDecorate = component.querySelectorAll('.' + goog.getCssName(
      pstj.ui.TemplateRenderer.DECORATE_CSS_CLASS));
    // for each found element attempt to find component that matches class name
    // and create instance (the instance will use the default registered
    // renderer internally) and add it as a child component. Note that this will
    // most probably work only for single level fold of component.
    goog.array.forEach(toDecorate, function(element) {
      var decorator = goog.ui.registry.getDecorator(element);
      if (!goog.isNull(decorator)) {
        var comp = new decorator();
        component.addChild(comp);
        comp.decorate(element);
      }
    }, this);
  };

  /**
   * Looks up the content element starting from the root element of the
   *   component. Notice that because the component can have chilren it is
   *   possible that the content element might be found in one of the
   *   children, so make sure to scope correctly your look up.
   * @param {Element} element The root DOM node of the component.
   * @return {Element}
   */
  _.getContentElement = function(element) {
    return element;
  };

});
