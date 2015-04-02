/*
 * Open links to a different domain in a new window
 */
;(function(document) {

    var externalTest = new RegExp('/' + window.location.host + '/');
    var links = document.getElementsByTagName('a');

    for (var i = 0; i < links.length; i++) {
       if (!externalTest.test(links[i].href)) {
           links[i].target = "_blank";
       }
    }

}(document));