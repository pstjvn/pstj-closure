goog.provide('pstj.demos.navigation');

goog.require('goog.dom');
goog.require('goog.ui.tree.TreeControl');
goog.require('pstj.demos.navigationdata');


function initTree() {
  goog.ui.tree.TreeControl.defaultConfig.cleardotPath =
      '../../../library/closure/goog/images/tree/cleardot.gif';
  var tree = new goog.ui.tree.TreeControl('All Demos');
  tree.setIsUserCollapsible(false);
  buildNode(tree, pstj.demos.navigationdata);
  tree.render(goog.dom.getElement('demo-list'));
}


/**
 * @param {goog.ui.tree.TreeControl} parent
 * @param
 * {Array<Object<string, (string|Array<Object<string, string>>)>>} nodeArray
 */
function buildNode(parent, nodeArray) {
  for (var i = 0, node; node = nodeArray[i]; i++) {
    if (node.name) {
      var childNode = parent.getTree().createNode();
      parent.add(childNode);
      if (node.url) {
        childNode.setSafeHtml(goog.html.SafeHtml.create('a', {
          'href': node.url,
          'title': node.name,
          'target': 'demo'
        }, node.name));
        // Need to prevent BaseNode.onClick_ from calling preventDefault.
        childNode.onClick_ = goog.nullFunction;
      } else if (node.childNodes) {
        childNode.setText(node.name);
        buildNode(childNode, node.childNodes);
      }
    }
  }
}


initTree();
