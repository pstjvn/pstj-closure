
Explore the option to have event registration separate from 'enter/exitDocument'
This will allow the automatic registration of pointer etc events without actually
subscribing the DOM node to the pointer. That could be handled by a separate
flag in the base Element.

Explore the option to have move/end events attached to subscribers of the
pointer agent only when locking оnto an element. This will allow to lower
the number of event listeners in the whole application by 2/3ds theoretically.

Handle combination of touch+mouse start events one after the other without
releasing from the previous one. Currently this case is not well handled and
basically overrides the previous start event (so querying the event type will
return false positive). Also no check is made if the mouse is a secondary (as
only one pointer as mouse is assumed, but in reality combined with one touch
it is possible to have 'double finger' zoom events. This should be handled
correctly for the gesture reconizer plugin to work absolutely correctly. In
practice however this is doubted to have big impact as users will rarely if
at all use combination of finger and mouse.

Implement the idea of config that is a model. This will require some work
in the base model. *fromJSON can be reused with a model and then we can
set the model. Alternatively the UI can be constructed from the model and
this is better as it will allow the autobinding to happen. For example
listen for mutate events on the model and then branch based on the
property updated for input elements.