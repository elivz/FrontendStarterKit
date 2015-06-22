/**
 * Enables form labels to be overlaid on the inputs
 * Fades them out when the input is selected, and hides
 * when the user begins to type.
 */
'use strict';

(function ($) {
    $.fn.autoHideLabels = function autoHideLabels(options) {
        var settings = {
            label: 'label',
            input: 'textarea, input:not([type="checkbox"], [type="radio"], [type="button"], [type="submit"], [type="reset"], [type="file"], [type="hidden"])'
        };

        if (options) {
            $.extend(settings, options);
        }

        return $(this).each(function attachHandlers() {
            var $this = $(this);

            $this.on('focusin', function () {
                if ($this.find(settings.input).val() === '') {
                    $this.find(settings.label).fadeTo(100, 0.4);
                }
            });

            $this.on('focusout', function () {
                if ($this.find(settings.input).val() === '') {
                    $this.find(settings.label).fadeTo(100, 1);
                }
            });

            $this.on('input keyup', function () {
                if ($this.find(settings.input).val() === '') {
                    $this.find(settings.label).fadeTo(100, 0.4);
                } else {
                    $this.find(settings.label).fadeOut(100);
                }
            });

            if ($this.find(settings.input).val() !== '') {
                $this.find(settings.label).hide();
            }
        });
    };
})(jQuery);

/*
 * Open links to a different domain in a new window
 */
(function (document, window) {
    var externalTest = new RegExp('/' + window.location.host + '/');
    var links = document.getElementsByTagName('a');
    var length = links.length;

    for (var i = 0; i < length; i++) {
        if (!externalTest.test(links[i].href)) {
            links[i].target = '_blank';
        }
    }
})(document, window);

(function ($, document) {
    var site = {
        init: function init() {
            // Run jQuery plugins
            $('.inplace').autoHideLabels();
        }
    };

    // Start things off
    site.init();
})(jQuery, document);
//# sourceMappingURL=scripts.js.map