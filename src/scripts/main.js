import 'a11y-toggle';
import './plugins/analytics';
import './plugins/externalLinks';

import './modules';

// Add "js" class to the html element
document.documentElement.className = document.documentElement.className.replace(
    'no-js',
    'js'
);
