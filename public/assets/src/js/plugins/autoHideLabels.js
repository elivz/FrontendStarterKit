/**
 * Enables form labels to be overlaid on the inputs
 * Fades them out when the input is selected, and hides
 * when the user begins to type.
 */
 (function($) {

    'use strict';

    $.fn.autoHideLabels = function(options) {

        var settings = {
            label: 'label',
            input: 'textarea, input:not([type="checkbox"], [type="radio"], [type="button"], [type="submit"], [type="reset"], [type="file"], [type="hidden"])'
        };

        if (options) {
            $.extend(settings, options);
        }

        return $(this).each(function() {
            var $this = $(this);

            $this.on('focusin', function() {
                if ($this.find(settings.input).val() === '') {
                    $this.find(settings.label).fadeTo(100, 0.4);
                }
            });

            $this.on('focusout', function() {
                if ($this.find(settings.input).val() === '') {
                    $this.find(settings.label).fadeTo(100, 1);
                }
            });

            $this.on('input keyup', function() {
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

}(jQuery));
