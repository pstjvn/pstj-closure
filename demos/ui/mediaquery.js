goog.provide('pstj.demos.ui.mediaquery');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('pstj.ui.MediaQuery');


(function() {
  var support = document.getElementById('support');
  var result = document.getElementById('result');
  goog.dom.setTextContent(support, pstj.ui.MediaQuery.hasSupport ?
      'MediaQuery is supported' :
      'MediaQuery is not supported');
  var mq = new pstj.ui.MediaQuery('min-width: 500px');
  goog.events.listen(mq, pstj.ui.MediaQuery.EventType.MEDIA_CHANGE,
      function(e) {
        goog.dom.setTextContent(result, e.target.queryMatches ?
            'Query matches' : 'Query does not match');
      });
})();
