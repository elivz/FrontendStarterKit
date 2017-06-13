import Toggle from 'toggle';
import './plugins/analytics';
import './plugins/externalLinks';

import './modules';

// Add "js" class to the html element
document.documentElement.className = document.documentElement.className.replace(
    'no-js',
    'js'
);

// Toggle navigation using hamburger menu
new Toggle(document.getElementById('navigation'), {
    mediaQuery: '(max-width: 600px)',
});
