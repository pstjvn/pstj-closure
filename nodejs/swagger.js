// Inlcude support for closure library.
require('../../../library/closure/goog/bootstrap/nodejs.js');
require(__dirname + '/../deps.js');

goog.require('pstj.swagger.Dto');

var Node = goog.module.get('pstj.swagger.Dto');

console.log(new Node('peps', {}));