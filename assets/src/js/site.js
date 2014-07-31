// Site-Specific Scripts

var site = {

    init: function() {

        // Site-specific functions


        // Run jQuery plugins
        $('.inplace').autoHideLabels();

    }

};

// Start things off
$(document).ready(site.init);