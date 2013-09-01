goog.provide('pstj.demos.tableview');

goog.require('goog.dom');
goog.require('pstj.ds.List');
goog.require('pstj.ui.TableView');

/**
 * Demo for the table view widget.
 */
pstj.demos.tableview = function() {



  var tableview = new pstj.ui.TableView();

  // Generate fake data for the example.
  var data = [];
  for (var i = 0; i < 200; i++) {
    data.push({
      'id': i,
      'name': i
    });
  }
  // Decorate an elemenet to become a table view
  tableview.decorate(goog.dom.getElementByClass('tableview'));
  // Generate the rows of the table view
  tableview.generateRows();
  // Load the model
  tableview.setModel((new pstj.ds.List(data)));
};

pstj.demos.tableview();

