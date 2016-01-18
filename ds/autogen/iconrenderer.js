/**
 * @fileoverview Provide means to generate content for the files needed to
 * represent an icon that can be used in material design.
 *
 * The reprerentation parses all the needed information upfront from a
 * given Element (assuming SVG element) and can subsequently be used as
 * needed for the construction of all needed files.
 *
 * The expected files are at least 3:
 * - renderer file for each icon (element)
 * - one common file for the icon names that have been parsed
 * - one common file for the generated soy templates
 *
 * This class can only generate the first of those, the other two must be
 * generated separately and should consume data from this class.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ds.autogen.IconRenderer');

goog.require('goog.array');
goog.require('goog.dom.classlist');
goog.require('goog.string');
goog.require('pstj.ds.template');

goog.scope(function() {
var autogen = pstj.ds.autogen;


/**
 * The main class representing a new file for a custom renderer.
 */
autogen.IconRenderer = goog.defineClass(null, {
  /**
   * @param {Element} element An element, containing the view representation
   * of one or more icons.
   */
  constructor: function(element) {
    /**
     * The root element for the icon.
     * @type {Element}
     */
    this.element = element;
    /**
     * List of the icon names this DOM element can support.
     * @type {Array<string>}
     */
    this.iconNames = null;
    /**
     * The name to use as class name for the created renderer.
     * @type {string}
     */
    this.className = '';
    /**
     * Textual representation of the renderer class generated for the icon
     * element.
     * @type {string}
     */
    this.text = '';
    this.parse();
  },

  /**
   * Processes the assigned root element and converts it to a form that
   * is ready to be written out.
   *
   * @protected
   */
  parse: function() {
    this.templatizeCssClassNames();
    this.iconNames = this.getIconNames();
    this.className = goog.string.toTitleCase(goog.string.toCamelCase(
        this.iconNames[0]));

    this.removeIsAttribute();
    this.removeNameAttribute();
    this.text = this.getRendererClassAsText();
  },

  /**
   * Retrieves the names of icons the element is expected to implement.
   *
   * @return {!Array<string>}
   */
  getIconNames: function() {
    if (this.element.hasAttribute('name')) {
      return goog.array.map(
          this.element.getAttribute('name').split(','), function(name) {
            return goog.string.trim(name);
          });
    } else throw new Error(
        'At least one icon name should be supported via the name attribute.');
  },

  /**
   * Removes the attribute used to mark decpratable elements. It will be not
   * needed as we do not use decoration for icons currently.
   *
   * @protected
   */
  removeIsAttribute: function() {
    this.element.removeAttribute('is');
  },

  /**
   * Removes the name attribute. In source it is used to match the element to
   * a name of an icon, but when compiled we do not need it and thus we remove
   * it to make the code smaller.
   *
   * @protected
   */
  removeNameAttribute: function() {
    this.element.removeAttribute('name');
  },

  /**
   * Replaces the class names on all elements (including the root one) with
   * goog scheme to allow for minification when compiling.
   *
   * @protected
   */
  templatizeCssClassNames: function() {
    goog.array.forEach(this.element.querySelectorAll('[class]'), function(el) {
      this.templatizeCssClassNameOnElement(el);
    }, this);
    this.templatizeCssClassNameOnElement(this.element);
  },

  /**
   * Given an element convert its class name value to one that can be used in
   * closure with minification.
   *
   * @param {Element} el The element to convert the classes on.
   */
  templatizeCssClassNameOnElement: function(el) {
    goog.dom.classlist.set(el, goog.array.map(goog.dom.classlist.get(el),
        function(classname) {
          return '{css ' + classname + '}';
        }).join(' '));
  },

  /**
   * Generates the text content of a file that represent the renderer for this
   * element's DOM and returns it as text.
   *
   * @return {string}
   */
  getRendererClassAsText: function() {
    return pstj.ds.template.IconRenderer({
      iconName: this.iconNames[0],
      className: this.className,
      icons: this.iconNames
    }).getContent();
  },

  /**
   * Returns a name that is suitable to be used as file name for the renderer
   * implementation that has been generated.
   *
   * @return {string}
   */
  getRendererFileName: function() {
    return this.className.toLowerCase();
  },

  /**
   * Returns the raw template content converted to soy format.
   * @return {string}
   */
  getRendererTemplateContent: function() {
    return this.element.outerHTML;
  }
});
});  // goog.scope
