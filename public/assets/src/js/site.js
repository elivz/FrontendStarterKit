// Site-Specific Scripts

var site = {

    init: function() {

        // Run jQuery plugins
        $('.inplace').autoHideLabels();

    }

};

// Start things off
$(document).ready(site.init);