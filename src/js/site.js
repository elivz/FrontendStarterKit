(($, document) => {
    const site = {
        init() {
            // Run jQuery plugins
            $('.inplace').autoHideLabels();
        }
    };

    // Start things off
    site.init();
}(jQuery, document));
