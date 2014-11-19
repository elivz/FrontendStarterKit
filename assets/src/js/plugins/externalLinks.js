/*
 * Open links to a different domain in a new window
 */
;(function($, body) {

    var a = new RegExp('/' + window.location.host + '/');

    $(body).find('a').each(function() {
       if (!a.test(this.href)) {
           $(this).attr("target", "_blank");
       }
    });

}( jQuery, document.body ));