/**
 * Enables form labels to be overlaid on the inputs
 * Fades them out when the input is selected, and hides
 * when the user begins to type.
 */
(($) => {
    $.fn.autoHideLabels = function autoHideLabels(options) {
        const settings = {
            label: 'label',
            input: 'textarea, input:not([type="checkbox"], [type="radio"], [type="button"], [type="submit"], [type="reset"], [type="file"], [type="hidden"])',
        };

        if (options) {
            $.extend(settings, options);
        }

        return $(this).each(function attachHandlers() {
            const $this = $(this);

            $this.on('focusin', () => {
                if ($this.find(settings.input).val() === '') {
                    $this.find(settings.label).fadeTo(100, 0.4);
                }
            });

            $this.on('focusout', () => {
                if ($this.find(settings.input).val() === '') {
                    $this.find(settings.label).fadeTo(100, 1);
                }
            });

            $this.on('input keyup', () => {
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
