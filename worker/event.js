'use strict';

goog.provide('pstj.worker.Event');

goog.require('goog.events.Event');
goog.require('goog.events.EventType');


/**
 * Implements specific event type that can hold the data transfered with the
 * messages coming from the worker.
 * The message is to be deserialized via dependency injectable mechanizm so the
 * main worker class can remain neutral. Structured messages are expected to be
 * impemented on higher level code.
 */
pstj.worker.Event = class extends goog.events.Event {
  /**
   * @param  {goog.events.EventTarget} target Targer of the event.
   * @param  {string} data   Serialized data coming with the event.
   */
  constructor(target, data) {
    super(goog.events.EventType.MESSAGE, target);
    this.data = data;
  }
}
