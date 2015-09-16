(($) => {
    if (document.classList) {
        document.classList.remove('no-js');
        document.classList.add('js');
    } else {
        document.className = 'js';
    }

    // Open external links in a new tab
    externalLinks.init();

    // Replace SVGs with PNGs in older browsers
    svgFallback.init();

    // Run jQuery plugins
    $('.inplace').autoHideLabels();
}(jQuery));
