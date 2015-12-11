/*
 * Replace the source of image elements with a fallback
 * when the browser does not support SVG images.
 *
 * <img src="cat.svg" data-png="cat.png" alt="Cat">
 */

import '../plugins/modernizr';

export default ((document) => {
    if (!Modernizr.svg) {
        const images = document.getElementsByTagName('img');
        let imgLength = images.length;

        while (imgLength--) {
            const newSrc = images[imgLength].getAttribute('data-png');
            if (newSrc !== null) {
                images[imgLength].setAttribute('src', newSrc);
            }
        }
    }
})(window.document);
