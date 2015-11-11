/**
 * @fileoverview Provides application level abstraction for a toast component.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.control.Toast');

goog.require('goog.array');
goog.require('goog.async.Delay');
goog.require('goog.log');
goog.require('pstj.control.Control');
goog.require('pstj.material.Toast');


/**
 * The global app toast controller.
 * @extends {pstj.control.Control}
 */
pstj.control.Toast = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    /**
     * @type {goog.debug.Logger}
     * @private
     */
    this.logger_ = goog.log.getLogger('pstj.control.Toast');
    /**
     * The UI for the control.
     * @type {pstj.material.Toast}
     * @protected
     */
    this.ui = new pstj.material.Toast();
    /**
     * The function to execute on pressing the toast.
     * @type {?function():void}
     * @private
     */
    this.handler_ = null;
    /**
     * The scope in which to execut the press handler.
     * @type {?Object}
     * @private
     */
    this.scope_ = null;
    /**
     * If the toast is currently shown.
     * @private
     * @type {boolean}
     */
    this.free_ = true;
    /**
     * @type {goog.async.Delay}
     * @private
     */
    this.hideDelay_ = new goog.async.Delay(function() {
      this.closeUi();
    }, 10000, this);
    /**
     * @type {goog.async.Delay}
     * @private
     */
    this.nextDelay_ = new goog.async.Delay(this.nextItem_, 500, this);
    /**
     * A queue with functions that execute what we need in the context of this
     * control.
     * @type {!Array<!function():void>}
     * @private
     */
    this.q_ = [];

    this.init();
  },

  /**
   * Add new message to be displayed in the toast UI.
   *
   * If a message is already displayed the added one will be displayed after
   * the current one is hidden.
   *
   * @param {!string} message The message to display.
   * @param {string=} opt_action The action name to display.
   * @param {function(): void=} opt_handler The handler to execute if any.
   * @param {Object=} opt_scope The scope to execute the handler in.
   */
  add: function(message, opt_action, opt_handler, opt_scope) {
    goog.log.info(this.logger_, 'Adding new toast');
    opt_action = goog.isString(opt_action) ? opt_action :
        this.getDefaultButtonLabel();
    opt_handler = opt_handler || null;
    opt_scope = opt_scope || null;
    if (this.free_()) {
      this.show(message, opt_action, opt_handler, opt_scope);
    } else {
      goog.log.info(this.logger_, 'Toast is not free, add to queue');
      this.enqueu_(message, opt_action, opt_handler, opt_scope);
    }
  },

  /** @override */
  init: function() {
    goog.log.info(this.logger_, 'Initializing toast controller');
    goog.base(this, 'init');
    this.getHandler().listen(this.ui, goog.ui.Component.EventType.CLOSE,
        function(e) {
          this.hideDelay_.stop();
          this.nextDelay_.start();
        });
    this.getHandler().listen(this.ui, goog.ui.Component.EventType.ACTION,
        function(e) {
          this.callHandler_();
        });
    this.addToView();
  },

  /**
   * Adds the UI part to the view.
   * You can override this method if you need to.
   *
   * @protected
   */
  addToView: function() {
    this.ui.render(document.body);
  },

  /**
   * Closes the UI.
   *
   * You can override this one if you change the UI implementation.
   *
   * @protected
   */
  closeUi: function() {
    this.ui.setOpen(false);
  },

  /**
   * Opens the UI for the toast (showing a new message).
   *
   * You can override this one if you change the UI implementation.
   *
   * @param {!string} message The message to display.
   * @param {!string} action The action name to display.
   * @protected
   */
  openUi: function(message, label) {
    this.ui.setLabel(label);
    this.ui.setContent(message);
    this.ui.setOpen();
    this.hideDelay_.start();
  },

  /**
   * Shows a new message in the toast.
   *
   * @param {!string} message The message to display.
   * @param {!string} action The action name to display.
   * @param {?function(): void} handler The handler to execute if any.
   * @param {?Object} scope The scope to execute the handler in.
   * @protected
   */
  show: function(message, action, handler, scope) {
    this.handler_ = handler;
    this.scope_ = scope;
    this.free_ = false;
    this.openUi(message, action);
  },

  /**
   * Helper method to use a label when none is provided.
   *
   * You should override this method if you need to use internatianalization
   * or you need to change the default label.
   *
   * @return {!string}
   */
  getDefaultButtonLabel: function() {
    return 'Dismiss';
  },

  /**
   * The user selected to call the action associated with the current toast.
   *
   * @private
   */
  callHandler_: function() {
    if (goog.isFunction(this.handler_)) {
      this.handler_.call(this.scope_);
    }
    this.handler_ = null;
    this.scope_ = null;
    this.closeUi();
  },

  /**
   * Adds new message to the queue.
   * @param {!string} message The message to display.
   * @param {!string} action The action name to display.
   * @param {?function(): void} handler The handler to execute if any.
   * @param {?Object} scope The scope to execute the handler in.
   * @protected
   */
  enqueu_: function(message, action, handler, scope) {
    this.q_.push(goog.bind(this.show, this, message, action, handler, scope);
  },

  /**
   * Checks the queue foritems to show.
   * @private
   */
  nextItem_: function() {
    if (goog.array.isEmpty(this.q_)) {
      this.q_.shift()();
    } else {
      this.free_ = true;
    }
  }
});
goog.addSingletonGetter(pstj.control.Toast);
