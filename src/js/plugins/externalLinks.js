/*
 * Open links to a different domain in a new window
 */

export default ((window, document) => {
    // RegEx to test if a link goes to a different hostname
    const localTest = new RegExp(`/${window.location.host}/`);

    // Find the links
    const links = document.body.getElementsByTagName('a');

    // Add a target attribute to any links that match
    for (const link of links) {
        if (!localTest.test(link.href)) {
            link.target = '_blank';
        }
    }
})(window, window.document);
