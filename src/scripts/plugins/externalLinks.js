/*
* Open links to a different domain in a new window
*/

/* eslint-disable no-script-url */

// Find the links
const links = document.body.getElementsByTagName('a');

// Add a target attribute to any links that match
Array.from(links).forEach(link => {
  if (
    link.href.indexOf('javascript:') === -1 &&
    link.href.indexOf(window.location.host) === -1
  ) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', `${link.getAttribute('rel')} noopener`);
  }
});
