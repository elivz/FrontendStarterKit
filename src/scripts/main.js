import Toggle from 'accessible-toggle';
import './plugins/analytics';
import './plugins/externalLinks';

// Toggle navigation using hamburger menu
new Toggle(document.getElementById('navigation'), {
    mediaQuery: `(max-width: 600px)`,
});
