/*
 * Open links to a different domain in a new window
 */

import { $$ } from '../lib/domUtils';

// RegEx to test if a link goes to a different hostname
const localTest = new RegExp(`/${window.location.host}/`);

// Find the links
const links = $$('a');

// Add a target attribute to any links that match
links.forEach(link => {
  if (!localTest.test(link.href) && !link.classList.contains('js-same-tab')) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  }
});
