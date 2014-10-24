Creating Material Design UI with JSON and pstj closure library.
===

Basics
---

The main idea is that it is possible to bundle the
material design elements inside a compile and use a decorator instance to create
a subset or a comple app like interface from a simple JSON file.

On the server side the JSON can be dynamically generated or static / manually
edited.

The JSON itslef can combine the UI structure with a **live** data model that can
be assimilated by the UI components (a la observable models), but those are not
required and can be skipped in favor of simple 'static' view.

The basic JSON structure contains a list of UI components, each object in the
list is representing a single Element instance. Required is only the type, which is
used to determine the instance to use for UI creation. In addition a config
property is allowed which usually contains Element specific settings to help
configure the instance created from the JavaScript.

If you deicide to use the 'live' model option the **model** property is used.
It should contain the model you would like to convay to the component instance.
On the client side it is assumed to be a JSON structire compatible with the
basic **ListItem** interface. For more information please see *Models.md*

The final property that can be interpreted is **elements** and it can contain
list of additional elements to be created as chidlren of the current Element.

A working example of a dynamic form *without* the use of live model is following.

###Example

```
[
  {
    type: 'form',
    config: {
      action: '',
      method: 'post',
      encoding: 'json'
    },
    elements: [
      {
        type: 'input',
        config: {
          type: 'text',
          pattern: '^\\d{2,5}$',
          required: true,
          name: 'inputname',
          value: '',
          label: 'Enter your number',
          errorText: 'Numbers only'
        }
      },
      {
        type: 'radiogroup',
        config: {
          values: 'one, two, five',
          labels: 'One,Two,Five',
          value: 'two',
          name: 'radiog'
        }
      },
      {
        type: 'progressbar'
      },
      {
        type: 'item',
        config: {
          classNames: 'horizontal'
        },
        elements: [
          {
            type: 'label',
            config: {
              content: 'Toggle box test',
              classNames: 'flex'
            }
          },
          {
            type: 'togglebutton',
            config: {
              name: 'toggleb',
              value: 1
            }
          }
        ]
      }
    ]
  }
]
```

As seen from the example it is completely viable option to convey the currently
active server settings to the UI without the use of complex data models.

// TODO : add model enabled variant for the same view

Material Design Elements
---

The following Elements are currently supported.

- material-input
- material-toggle-button
- material-radio-group
- material-progressbar

Details on the supported configuration parameters for each component can be
found on the corresponding how-to page.


**Example**
```
"material-form": [
  "material-input": {
    "id": 1,
    "type": "tel",
    "name": "somename",
    "value": "somevalue"
  }
]
```

In this example the same input will be created as the above one.


Details
---
The form elements are always DIV elements with the following classes
declaring the type and the details of each input:

- material-input - a single line text input
- material-toggle - toggles are bit values, only on and off
- material-range - a numerical range
- material-select - a select box
- material-textarea - a text area



###material-input

The input is described with the following properties:

**id** requered, should be an integer

**name** optional, if the server can understand JSON the name can be ommited
and the ID will be used. If the server expects regular form submission
(i.e. URL encoded values) the property should be provided

**type** optional, determines the type of the input. Can be one of the following:

- text
- password
- tel
- email
- number

If not provided the *text* type will be used.

**value** Determines the initial value of the item. If the
*imperative* method of initialization is used it is required
even if it is empty for the model to work correctly.

**pattern** optional, if provided will be used to validate the
user provided value. If it is not provided but the type is set
to *tel*, *number* or *email* the corresponding automatic
checks will be performed to validate the input

When the input is provided declaratively the ID is not required
and will be automatically generated if needed. Note that the form
declaration is not nessesarily bound to the type of form submission
that will be used, but the same type is assumed, which means that
if the form was created declaratively, the urlencoded method will
be used if no configuration is provided and when the imperative
mode of creation is used the form will be submitted as json if
nothing else is stated in the configuration.



