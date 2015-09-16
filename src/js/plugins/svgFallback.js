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
            return !!document.createElementNS &&
                   !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
        }()),

        init: function init(attr = 'data-png') {
            this.replaceImgSrc(attr);
            this.addClass();
        },

        replaceImgSrc: function replaceImgSrc(attr) {
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

        addClass: function addClass() {
            const className = this.svgSupport ? ' svg' : ' no-svg';
            document.documentElement.className = document.documentElement.className + className;
        },
    };
}(document, window));
