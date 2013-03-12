## Reusable units and components derived on top of closure library.


Closure library utilities shared between many projects. Because of the shared name space those are put together in a single project. It is worth noting that the compiler makes tree shaking in advanced mode and thus the size of the compiled application will not be affected by the size of this code directly.

### How to use?

The code structure is opinionated and should any of the UI components be used the templates should be copied over to your template folder to allow them to compile to javascript. This is done intentionally to allow for i18n and l10n in the applications.

Supposed code structure should look somthing similar to this:
```
/
  library/
    closure/
      goog/
        base.js
  compiler/
    compiler.jar
  templates/
    SoyToJsSrcCompiler.jar
    SoyMsgExtractor.jar
    soyutils_usegoog.js
    soyutils.js
  stylesheets/
    cs.jar
  externs/*
  apps/
    pstj/ <--- this is git clone of the additional library
    my-awesome-app/ <--- this is your app code
```

If you want to use the ready made Makefile to easily build your application the structure of your applications should be as follows:

```
/
  index.html
  js/ <-- all your javascript to be built
  template/ <-- your templates and copies of third party templates.
    *.soy
  build/ <-- builds will go here including deps.js and build js/css
  assets/ <-- static resources, like images
  gss/* <-- gss/css files to be concatenated and renamed
  i18n/ <-- this will be populated with xlf file to ease translation
  options/ <-- could be copied over from this project
  tpl/ <-- the built templates will go here.
```

One can also kick-start a project following this structure pattern using a copy of the Makefile in this project. The available options in the Makefile are in the top of the file. To start issue ```make initproject```.

