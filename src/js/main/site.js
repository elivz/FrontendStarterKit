((document, $) => {
    // Add "js" class to the html element
    document.documentElement.className = document.documentElement.className.replace('no-js', 'js');

    // Prevent tap delay on mobile devices
    document.addEventListener('DOMContentLoaded', () => {
        FastClick.attach(document.body);
    }, false);

    // Open external links in a new tab
    externalLinks.init();

    // Replace SVGs with PNGs in older browsers
    svgFallback.init();
}(document, jQuery));
