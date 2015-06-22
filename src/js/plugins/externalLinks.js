/*
 * Open links to a different domain in a new window
 */
((document, window) => {
    const externalTest = new RegExp('/' + window.location.host + '/');
    const links = document.getElementsByTagName('a');
    const length = links.length;

    for (let i = 0; i < length; i++) {
        if (!externalTest.test(links[i].href)) {
            links[i].target = '_blank';
        }
    }
}(document, window));
