(($) => {
    document.documentElement.className = document.documentElement.className.replace('no-js', 'js');

    // Open external links in a new tab
    externalLinks.init();

    // Replace SVGs with PNGs in older browsers
    svgFallback.init();

    // Run jQuery plugins
    $('.inplace').autoHideLabels();
}(jQuery));
