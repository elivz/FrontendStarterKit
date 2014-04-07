/**
 * Enables form labels to be overlaid on the inputs
 * Fades them out when the input is selected, and hides
 * when the user begins to type.
 */
 ;(function( $ ) {

    $.fn.autoHideLabels = function(options) {

        return $(this).each(function() {
            var $wrapper = $(this),
                $label = $wrapper.find('label'),
                $input = $wrapper.find('textarea, input:not([type="checkbox"],[type="radio"],[type="button"],[type="submit"],[type="reset"],[type="file"],[type="hidden"])');

            // Set the label as a title on the input,
            // so it is accessible even after a value is entered
            if (!$input.attr('title')) {
                $input.attr('title', $label.text());
            }

            $input
                .on('focusin', function() {
                    if ($input.val() === '') {
                        $label.fadeTo(100, 0.4);
                    }
                })
                .on('focusout', function() {
                    if ($input.val() === '') {
                        $label.fadeTo(100, 1);
                    }
                })
                .on('keyup', function() {
                    if ($input.val() === '') {
                        $label.fadeTo(100, 0.4);
                    } else {
                        $label.fadeOut(100);
                    }
                });

            if ($input.val() !== '') {
                $label.hide();
            }
        });

    };

}( jQuery ));