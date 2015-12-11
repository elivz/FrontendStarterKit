// import $ from 'jquery/jquery';
import 'libs/modernizr';
import 'respimage';
import 'plugins/externalLinks';
import 'plugins/svgFallback';

// Prevent tap delay on mobile devices
import fastclick from 'fastclick';
document.addEventListener('DOMContentLoaded', () => {
    fastclick(document.body);
}, false);
