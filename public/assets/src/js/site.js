(function($, document) {

    "use strict";

    var site = {

        init: function() {

            // Run jQuery plugins
            $('.inplace').autoHideLabels();

        }

    };

    // Start things off
    site.init();

}(jQuery, document));