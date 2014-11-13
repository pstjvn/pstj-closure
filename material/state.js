/**
 * @fileoverview Augments the default component states with the states used by
 * the material design implementation. This is needed to make the material
 * design elements successfully compatible with the closure control subsystem
 * and thus reuse a lot of the logic related to the element's state.
 *
 * Some trickery is used to make the compiler happy.
 *
 * You do not need to require this file as it does not really provide anything
 * more then what you already get using pstj.material.Element. It is separate
 * from it for convenience and cleaner code.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.State');

goog.require('goog.ui.Component.State');


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.NARROW = /** @type {!goog.ui.Component.State} */ (
    0x80);


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.TRANSITIONING =
    /** @type {!goog.ui.Component.State} */ (0x100);


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.SEAMED = /** @type {!goog.ui.Component.State} */ (
    0x200);


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.SCROLL = /** @type {!goog.ui.Component.State} */ (
    0x400);


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.WATERFALL = /** @type {!goog.ui.Component.State} */ (
    0x800);


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.WATERFALL_TALL =
    /** @type {!goog.ui.Component.State} */ (0x1000);


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.COVER = /** @type {!goog.ui.Component.State} */ (
    0x2000);


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.STANDARD = /** @type {!goog.ui.Component.State} */ (
    0x4000);


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.SHADOW = /** @type {!goog.ui.Component.State} */ (
    0x8000);


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.TALL = /** @type {!goog.ui.Component.State} */ (
    0x10000);


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.INVALID = /** @type {!goog.ui.Component.State} */ (
    0x20000);


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.EMPTY = /** @type {!goog.ui.Component.State} */ (
    0x40000);


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.INVISIBLE = /** @type {!goog.ui.Component.State} */ (
    0x80000);


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.RAISED = /** @type {!goog.ui.Component.State} */ (
    0x100000);


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.SCRIM = /** @type {!goog.ui.Component.State} */ (
    0x200000);


/**
 * Augments the Component State enumeration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 */
goog.ui.Component.State.ALLALL = /** @type {!goog.ui.Component.State} */ (
    0xFFFFFF);

