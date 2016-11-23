## Animation creation library: internal working explained

This document explains in details the arcitecture for the animation system
used internally in mostly all classes in this library.

### How is this better than having my own RAF bound implementation of animation control?

There are several potential gains from using this system as compared to using a RAF bound function(s) in your library code or your component:

* a simple and robust way to separate your *measure* and *mutate* phases
* returns a simple function that can be invoked multiple times without creating additional memory allocations (more static mem footprint and thus *predictable performance*)
* one centralized control structire for all animations, extending the scheduler can make more robust controls, for example delay heavy JS operation until the scheduler stops / is emptied
* create controlled animations from commands (i.e. predefined animations with hot swappable nodes), ship those animations as library with the scheduler and all benefits noted above

### What is it?
A library for creating animations or simply repeatable actions bound to browser rendering timeframes.

Its use is very simple and staight forward, but describing its internal workings
can be used to navigate the code more adequately and incrementally change
the implementation without breaking the users. The main goal in the nearest
future will be to allow animations to be constructed imperatively so a set
of commanding logic can be created on application logic level and directed from
a web worker extracted unit.

### Classes

##### State

This class is designed to be used to pass stateful information between the two
passes of the animation tick. By default only the timestamp of the anmation
is stored in the state.

If you need more information stored between the passes you can extenr this class.
Example of such inforamtion is results from measuremenets made in the **measure**
phase of the animation and to be used in the **mutate** phase.

Note that the `clear` method will be called after each animation iteration,
override it to let go of state related to iteration itself.


##### Task

This class contains a simple callback that is designed to be a function that
accepts a `State` interface implementation (can be a class instance or a structural
match) and is expected to be invoked on each animation iteration.

Note that the `Task` instance should not have any assumptions on when it will
be called, instead the callback should be a pure function and work only with the
state object.

If you need to contain state you have two choices:

* create your own `State` instance and use it to hold any information you might need
* bind the callback for the `Task` instance or use closures to bind to values

Note that using the first option is the preferred way to go as it is included in the design.

##### TaskSet

This class is designed to represent a collection of two `Task` instances, a state instance
to be passed to both `Task` instances when they are called (**measure**/**mutate** in this order) and a flag to designate the current `TaskSet` scheduled state; a `TaskSet` should
not be scheduled more than once and the flag is checked before schedulling the set.

The `TaskSet` will be used to control the animation and represents a cohesive uint
to be worked with in the controlling logic.

##### IScheduler

This is an interface that implements the mechnizm to use when scheduling when
a new animation pass will be triggered.

An implementation of this interface should have a `start` method, which will
internally schedule when the animation handler will be called. It should
also implement the `setHandler` method, which in turn will be called internally
to set the correct handler. The handler should be called once the time to run the
animation pass arrives.

**NOTE**: why provide an interace for this instead of a simpler approach to just
implement it as class and use it?

Currently the best way to do animation timing/scheduling is using RequestAnimationFrame. However if for some reason we need to run a taskset in another platform we might need to
reside to setTimeout (nodejs for example). This is why we elect to provide different
implementations. Another possibility is to have adapting animation scheduler which is
an abstraction layer above RAF and throttls the animations to 30fps instead of 60
when needed.

##### RafSI

This is the default browser focused implementation of the `IScheduler` interface.
It uses RAF internally to schedule the animation passes. The class is final and should
not be extended, instead you should include the `browser.js` file to activate this
implementation for the Scheduler object and it will use it internally.

Example:
```
// This will activate the scheduler to use the RAF for scheduling animation passes
goog.require('pstj.animation.browser');
```

##### Scheduler

This class is the main scheduling utility used by the animation system.

It should be provided with an `IScheduler` implementation in order to be able to
actually schedule animation passes. Once provided it will set up its internal
handler to be used by the implementation provided and will call its `start` method
when called to schedule a new pass.

### Important notes

The two most important classes from the list above is the `State` class, which
you might need to extend if you need to store specific logic between passes
or pass stages, and the `IScheduler` interface, which you might want to implement
if you need something different than the default RAF implementation.

All other classes should be uninportant to you if your only aim is to use the
animation infrastructure.

### How it all works?

Here is how you go about creating a working animation:

```
// Register RAF as scheduler for animation pass.
goog.require('pstj.animation.browser');
// Gain access to creating an animation function.
goog.require('pstj.animation.create');

let myOffset = 0;
let myAnimation = pstj.animation.create(function(state) {
  // measure somthing in the DOM
  myOffset = document.getElementById('scroller').scrollTop;
  // If we want to continue the animation,
  // schedule another pass for the next frame
  if (myOffset < 1000) myAnimation();
}, function(state) {
  // mutate something in the DOM
  document.getElementById('myProgress').style.width = myOffset / 100 + 'px';
}, null);
myAnimation();
```

In this example we use the measure phase function to query the DOM (DOM reads) and cache the value in a closed-over variable. In the second function (the murate phase) we change a property on the DOM.

In the first phase we also check if we should run this animation pass again in the next scheuled animation frame.

We also did not use any state, instead the creation of the animation used a default state.

Note that the scheduler will run as long as it has at least one animation to perform for the next phase. Each time you invoke the returned function, its internal taskset is scheduled for the next frame, you can invoke it as many times as you need in the same pass, it will not be duplicated. If the scheduler is not running and you invoke your function it will trigger the scheduler and it will be active as long as at least one animation is to be run on the next pass.

FAQ:

1) I get this error: **No implementation provided for the timing function**
A) You need to specify implementation for how timing should be handled in scheduler. If you target only the browser you can just require the 'pstj.animation.browser' namespace, it will handle wiring for you.