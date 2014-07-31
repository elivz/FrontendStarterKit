if (window.devicePixelRatio >= 1.2){
    var images = document.getElementsByTagName('img');
    for (var i=0;i < images.length;i++) {
        var attr = images[i].getAttribute('data-src2x');
        if (attr) {
            images[i].src = attr;
        }
    }
}