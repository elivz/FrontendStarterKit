/*
 * Open links to a different domain in a new window
 */
(function(document) {

    var matchExternal = new RegExp('/' + window.location.host + '/'),
        links = document.getElementsByTagName('a');

    for (i = 0; i < links.length; i++) {
       if (!matchExternal.test(links[i].href)) {
           links[i].target = '_blank';
       }
    };

}(document));