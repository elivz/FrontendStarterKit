/*
 * Replace the source of image elements with a fallback
 * when the browser does not support SVG images.
 *
 * <img src="cat.svg" data-png="cat.png" alt="Cat">
 *
 * <script>svgFallback.init('data-png');</script>
 */

((document, window) => {
    window.svgFallback = {
        svgSupport: (() => {
            return document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1');
        }()),

        init: function init(attr = 'data-png') {
            if (!this.svgSupport) {
                const images = document.getElementsByTagName('img');
                let imgLength = images.length;

                while (imgLength--) {
                    const newSrc = images[imgLength].getAttribute(attr);
                    if (newSrc !== null) {
                        images[imgLength].setAttribute('src', newSrc);
                    }
                }
            }
        },
    };
}(document, window));
