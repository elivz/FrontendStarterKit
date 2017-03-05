import $ from 'jquery';
import 'a11y-toggle';

// Reusable modules
import analytics from 'plugins/analytics';
import 'plugins/externalLinks';

// Export jQuery to global namespace
window.$ = $;

// Add "js" class to the html element
document.documentElement.className = document.documentElement.className.replace('no-js', 'js');

// Start tracking
analytics.init();
