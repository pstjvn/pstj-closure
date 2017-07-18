goog.provide('pstj.codegen.node.Property');

goog.require('pstj.codegen.node.Node');


pstj.codegen.node.Property = class extends pstj.codegen.node.Node {
  constructor() {
    super();
    /**
     * The type of the property. It can be a primitive type like a number,
     * string or boolean, or a reference type, like an array or another class/
     * object. Because the type is an enum reference, for classes we also need
     * the name of the reference class.
     *
     * @type {pstj.codegen.node.type}
     */
    this.type = pstj.codegen.node.type.UNKNOWN;
    /**
     * The type the property must have once it is in JS land. This can be
     * different from the original type.
     *
     * @type {?pstj.codegen.node.format}
     */
    this.format = null;
    /**
     * This is Sysmaster specific item - allows to change the type of the
     * field because we have no control on how it comes from server and we
     * want to use it as different one. Conversion must also be supported
     * by the emitter.
     *
     * @type {?pstj.codegen.node.type}
     */
    this.desiredType = null;
    /**
     * Sysmaster specific item - allows to chose another name for the local
     * representation of the field.
     *
     * @type {?string}
     */
    this.desiredName = null;
    /**
     * If the field is required.
     *
     * @type {boolean}
     */
    this.required = false;
    /**
     * The minimum allowed value of any.
     *
     * @type {?number}
     */
    this.minimum = null;
    /**
     * The maximum number allowed if any.
     *
     * @type {?number}
     */
    this.maximum = null;
    /**
     * The pattern if one should be applied and imposed on the string value.
     *
     * @type {?string}
     */
    this.pattern = null;
    /**
     * If the property is an array this flag tells us of the API allows
     * any values of the same type, or only unique ones. Should those be
     * unique the developer will have to check uniquness on his own if the
     * array item type if not a primitive. For primitives values code will be
     * generated that guarantees the uniqueness.
     *
     * @type {boolean}
     */
    this.itemsCanRepat = false;
    /**
     * A property representing the type of the items if the property is an
     * array.
     *
     * @type {pstj.codegen.node.type}
     */
    this.itemType = pstj.codegen.node.type.UNKNOWN;
    /**
     * If the type of the property is an Object or an Array with reference
     * type of Object, we store the referref type here.
     *
     * @type {?string}
     */
    this.referredType = null;
  }
};