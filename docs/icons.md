# Material Icons

Material icons are expected to be able to mutate from state to state when it makes sense.

In this implementation two postulates are used:
- icon mutations are predefined (i.e. declarative and constructed using css)
- for icon that do not have declarative mutation (from icon to icon) default mutation is used that is scripted but also declared in advance

This is done for two reasons:
- imperative and computed animations require much more code to work
- they are also more CPU intensive and do not reward with much better UE.

Declarative mutations are organized into a single 'icon' - an svg element that is constructed in such way as to allow iconName-to-iconName transition with simple predefined rules. A set of herustics are run at compile time to determine the states / icons a single SVG element will support at runtime and only those are attempted. All other changes are handled by the default animation rules.

At runtime the following happens:

- all icons are created with 'type' property that is set to 'none'
- once the icon is set the type chnages to 'from-$1-to-$2' where $1 is the old icon name ('none' by default) and $2 is the new icon name. $2 should be a supported type which is enforced by compiler check. In development mode this is enforced by stricter herustics as well for the sake of providing the designers with enough tools to allow for smooth development process
- an event listener for 'animationend' event is set up that once triggered will change the type attribute to '$2'

So a mutation cycle in a single SVG (i.e. one that supports both old and new type) looks like this:
- iconName
- from-iconName-to-newIconName
- newIconName

All icons support the 'none' type internally.

When the svg element does not support the 'newIconName' a second svg element is attached that supports the new type and the 'from-none-to-newType' is used on it, while on the old SVG element the 'from-type-to-none' attribute value is set.

Both transition to final state at rougthly the same time at which point the old svg element is removed from the tree.

For a new icon to be usable the icon author should provide the following:
- svg element with the 'name' property containing a comma separated list of icon names that the svg can support (could be a single one or more than one)
- a new less file with the needed styling for all states supported by the icon, including the transition from 'none' to any of the icon names supported as well as from all supported icons names to 'none'

For examples of the above please see [less/icons.less](../less/icons.less) and [templates/icons.xml](../template/icons.xml)