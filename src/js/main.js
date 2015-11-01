import fastclick from 'fastclick';
import externalLinks from 'plugins/externalLinks';
import respimage from 'respimage';
import svgFallback from 'plugins/svgFallback';

// Add "js" class to the html element
document.documentElement.className = document.documentElement.className.replace('no-js', 'js');

// Prevent tap delay on mobile devices
document.addEventListener('DOMContentLoaded', () => {
    fastclick(document.body);
}, false);

// Open external links in a new tab
externalLinks();

// Replace SVGs with PNGs in older browsers
svgFallback();
