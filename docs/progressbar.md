Material design Progressbar
===

The progressbar is used to indicate work in progress without actual estimate
of the remaining/completed task ratio (i.e. it is not suitable for download
indication where we know the size of the download and we know what part of
it we already have).

The progressbar is best utilized for longer running tasks (i.e. tasks that we
are sure will take more than at least 2 animation cycles of the progressbar
itself).

The progressbar has animation cycle of 2 seconds, thus it could be used in
the following cases:

- taks that we know for sure (ot at least 80% of the cases) takes more than 4 seconds to complete
- task that has been started but is not completing wihtin the expected time frame - for example we start async data processing and it tales more than 500ms)

The progressbar is designed to be descreet and intuitive allowing the user to
concentrait on the content/task and instead is providing subtle indication only.

One possible place to use this element is at the bottom of the header-panel's
header element - it should be configured in an accent color and it should be
matched to the main color of the header.

Another useful place is in the lists, where an item is updating after a user
interaction. Note that in this case it should be started only if the update is
taking longer than anticipated, as those updates should be considered 'immediate'.

Third possible use case is when synchrnoizind data with the server (for example
after an offline period) in which case the progressbar should be positioned
at 'global' position - for example above the current view's header.

The progressbar provides the following public API:

### Methods:
- start - starts the animation
- complete - indicates completion of the task
- reset - sets back the initial state (i.e. the progressbar has no visual representation)

### CSS Classes
The element has the following basic css class: *material-progress-bar*,
and the following subclasses: *material-progress-bar-inner*

### Example CSS styling:

```
// Set the color of the progressbar
.material-progress-bar-inner {
  background-color: &:extend(.teal500);
}

// Set the height
.material-progress-bar {
  height: 4px;
}
```
### Events
The element dispatches the following events:

- pstj.material.EventType.LOAD_START
- pstj.material.EventType.LOAD_END
