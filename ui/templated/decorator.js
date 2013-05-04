goog.provide('pstj.ui.decorator');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.object');
goog.require('pstj.ui.DecorateClassName');

/**
 * @fileoverview Provides automtic decoration based on class names. The
 *   decoration is to be applied to a dom node and all its child nodes looking
 *   up a key class name to decorate. Decoration can only be applied if the
 *   decorator constructor function has been registered with the automatic
 *   decorator. The is mainly designed to build up complex container
 *   structures (similar to the TV UI interfaces where navigation is performed
 *   based on nested containers).
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.scope(function() {

  var _ = pstj.ui.decorator;
  var classlist = goog.dom.classlist;

  /**
   * The decorator registry.
   * @const
   * @type {Object}
   * @private
   */
  _.registry_ = {};

  /**
   * Registers a component that can be automatically applied to a DOM node.
   * @param {!function(new: pstj.ui.Templated)} ctor The constructor
   *   function for the component.
   * @param {!string} classname The class name to match for this component.
   */
  _.registerDecorator = function(ctor, classname) {
    goog.object.add(_.registry_, classname, ctor);
  };

  /**
   * Looks up a decorator contrustor that matches the class names assigned to
   *   an element.
   * @param {Element} element The DOM element to look up a constructor for.
   * @return {?function(new: goog.ui.Component)} The found constructor
   *   function or null.
   * @protected
   */
  _.findDecorator = function(element) {
    var ctor = null;
    var classes = classlist.get(element);
    for (var i = 0, len = classes.length; i < len; i++) {
      ctor = goog.object.get(_.registry_, classes[i], null);
      if (!goog.isNull(ctor)) return ctor;
    }
    return ctor;
  };

  /**
   * Decorate a DOM subtree.
   * @param {!string|Element} el The element to decorate or an ID to find an
   *   element by.
   * @param {boolean=} recursive If the decoration should be recursive.
   */
  _.decorate = function(el, recursive) {
    var mainComponent;

    el = goog.dom.getElement(el);
    if (goog.dom.isElement(el) &&
      classlist.contains(el, pstj.ui.DecorateClassName)) {

      var decorator = _.findDecorator(el);

      if (goog.isFunction(decorator)) {
        mainComponent = new decorator();
        mainComponent.decorate(el);

        if (!!recursive) {
          _.decorateChildren(mainComponent);
        }
      }
    }
  };

  /**
   * Find all child nodes in a component that are marked to be automatically
   *   decorated
   * @param {goog.ui.Component} mainComponent The main component to start
   *   looking down from.
   */
  _.decorateChildren = function(mainComponent) {
    var baseElement = mainComponent.getElement();
    var to_decorate = goog.dom.getElementsByClass(pstj.ui.DecorateClassName,
      baseElement);

    if (goog.array.isEmpty(to_decorate)) return;

    var ctor = null;
    var comp = null;
    /** @type {Array.<goog.ui.Component>} */
    var components = [mainComponent];
    var elements = [baseElement];

    goog.array.forEach(to_decorate, function(el) {
      ctor = _.findDecorator(el);
      if (goog.isFunction(ctor)) {
        comp = new ctor();
        comp.decorate(el);
        components.push(comp);
        elements.push(el);
        ctor = null;
        comp = null;
      }
    });

    var node = null;
    var index = -1;
    var limit = baseElement.parentNode;

    goog.array.forEach(components, function(component) {
      var node = component.getElement().parentNode;
      while (node != limit) {
        index = goog.array.indexOf(elements, node);
        if (index != -1) {
          components[index].addChild(component);
          break;
        } else {
          node = node.parentNode;
        }
      }
    });
  };

});
