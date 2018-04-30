import Toggle from 'accessible-toggle';
import { $$ } from '../lib/domUtils';

const navSections = $$('.js-nav-toggleable');

if (navSections.length > 0) {
  navSections.forEach(section => {
    new Toggle(section, {
      mediaQuery: '(max-width: 800px)',
      assignFocus: false,
      trapFocus: false,
    });
  });
}
