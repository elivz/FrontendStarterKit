// import $ from 'jquery/jquery';
import 'respimage';
import 'plugins/externalLinks';
import 'plugins/svgFallback';

// Add "js" class to the html element
document.documentElement.className = document.documentElement.className.replace('no-js', 'js');

// Prevent tap delay on mobile devices
import fastclick from 'fastclick';
document.addEventListener('DOMContentLoaded', () => {
    fastclick(document.body);
}, false);
