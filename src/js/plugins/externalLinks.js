/*
 * Open links to a different domain in a new window
 */

((document, window) => {
    window.externalLinks = {
        // RegEx to test if a link goes to a different hostname
        localTest: new RegExp('/' + window.location.host + '/'),

        init: function init(parent = document.body) {
            // Find the links
            const links = parent.getElementsByTagName('a');

            // Add a target attribute to any links that match
            let length = links.length;
            while (length--) {
                if (!this.localTest.test(links[length].href)) {
                    links[length].target = '_blank';
                }
            }
        },
    };
}(document, window));
