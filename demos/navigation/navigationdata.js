goog.provide('pstj.demos.navigationdata');


/**
 * The menu definitions.
 * @type {Array<Object<string, (string|Array<Object<string, string>>)>>}
 */
pstj.demos.navigationdata = [
  {name: 'Material Elements', childNodes: [
    {name: 'Button', url: '../material/button.html'},
    {name: 'Checkbox', url: '../material/checkbox.html'},
    {name: 'Element', url: '../material/element.html'},
    {name: 'IconContainer', url: '../material/iconcontainer.html'},
    {name: 'RadioButton', url: '../material/radiobutton.html'},
    {name: 'RadioGroup', url: '../material/radiogroup.html'},
    {name: 'Ripple', url: '../material/ripple.html'},
    {name: 'Shadow', url: '../material/shadow.html'},
    {name: 'ToggleButton', url: '../material/togglebutton.html'}
  ]},
  {name: 'TableView', url: '../tableview/index.html'},
  {name: 'Animation Sequence', url: '../animation/animation.html'},
  {name: 'Google APIs', childNodes: [
    {name: 'Google GAPI loading', url: '../app/google/gapi.html'},
    {name: 'Google Auth2 loading', url: '../app/google/auth2.html'}
  ]},
  {name: 'Dicsovery document', url: '../discovery/discovery.html'},
  {name: 'Data structures', childNodes: [
    {name: 'Double buffered list', url: '../ds/dbl.html'}
  ]},
  {name: 'Graphics', childNodes: [
    {name: 'SVG drawing', url: '../graphics/svgdrawing.html'}
  ]},
  {name: 'Widgets', childNodes: [
    {name: 'Swiper', url: '../widgets/swiper.html'},
    {name: 'SwipeTule', url: '../widgets/swipetile.html'}
  ]}
];

