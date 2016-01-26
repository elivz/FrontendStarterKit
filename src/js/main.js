// import $ from 'jquery/jquery';
import 'plugins/modernizr';
import 'respimage';
import 'plugins/externalLinks';

// Prevent tap delay on mobile devices
import fastclick from 'fastclick';
document.addEventListener('DOMContentLoaded', () => {
    fastclick(document.body);
}, false);
