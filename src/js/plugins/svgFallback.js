/*
 * Replace the source of image elements with a fallback
 * when the browser does not support SVG images.
 *
 * <img src="cat.svg" data-png="cat.png" alt="Cat">
 *
 * <script>svgFallback.init('data-png');</script>
 */

export default ((document) => {
    const svgSupport = (() => {
        return !!document.createElementNS &&
               !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
    }());

    function replaceImgSrc() {
        if (!svgSupport) {
            const images = document.getElementsByTagName('img');
            let imgLength = images.length;

            while (imgLength--) {
                const newSrc = images[imgLength].getAttribute('data-png');
                if (newSrc !== null) {
                    images[imgLength].setAttribute('src', newSrc);
                }
            }
        }
    }

    function addClass() {
        const className = svgSupport ? ' svg' : ' no-svg';
        document.documentElement.className = document.documentElement.className + className;
    }

    replaceImgSrc();
    addClass();
})(window.document);
