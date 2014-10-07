goog.provide('pstj.material.State');

goog.require('goog.ui.Component.State');


/**
 * Augments the Component State enumaration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.NARROW = /** @type {!goog.ui.Component.State} */ (
    0x80);


/**
 * Augments the Component State enumaration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.TRANSITIONING =
    /** @type {!goog.ui.Component.State} */ (0x100);


/**
 * Augments the Component State enumaration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.SEAMED = /** @type {!goog.ui.Component.State} */ (
    0x200);


/**
 * Augments the Component State enumaration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.SCROLL = /** @type {!goog.ui.Component.State} */ (
    0x400);


/**
 * Augments the Component State enumaration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.WATERFALL = /** @type {!goog.ui.Component.State} */ (
    0x800);


/**
 * Augments the Component State enumaration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.WATERFALL_TALL =
    /** @type {!goog.ui.Component.State} */ (0x1000);


/**
 * Augments the Component State enumaration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.COVER = /** @type {!goog.ui.Component.State} */ (
    0x2000);


/**
 * Augments the Component State enumaration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.STANDARD = /** @type {!goog.ui.Component.State} */ (
    0x4000);


/**
 * Augments the Component State enumaration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.SHADOW = /** @type {!goog.ui.Component.State} */ (
    0x8000);


/**
 * Augments the Component State enumaration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 * @type {!goog.ui.Component.State}
 */
goog.ui.Component.State.TALL = /** @type {!goog.ui.Component.State} */ (
    0x10000);


/**
 * Augments the Component State enumaration to allow us to host the material
 * element states in the same place and use the code in control renderer.
 */
goog.ui.Component.State.ALLALL = /** @type {!goog.ui.Component.State} */ (
    0xFFFFF);

