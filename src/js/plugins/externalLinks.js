/*
 * Open links to a different domain in a new window
 */

export default (() => {
    // RegEx to test if a link goes to a different hostname
    const localTest = new RegExp('/' + window.location.host + '/');

    // Find the links
    const links = document.body.getElementsByTagName('a');

    // Add a target attribute to any links that match
    let length = links.length;
    while (length--) {
        if (!localTest.test(links[length].href)) {
            links[length].target = '_blank';
        }
    }
})();
