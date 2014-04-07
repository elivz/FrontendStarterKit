// Columbus MeatUp Scripts

var site = {

    init: function() {

        // Site-specific functions
        site.popup();
        site.validation();

        $('.inplace').autoHideLabels();

    },

    popup: function() {
        $('.open-tour').on('click', function(e) {
            e.preventDefault();

            $('#tour').lightbox_me({
                centered: true
            });
        });

    },

    validation: function() {
        $('#entry-form').on('submit', function(e) {
            var $form = $(this),
                valid = true;

            // Check text fields
            $form.find('input[type="text"], input[type="email"], input[type="tel"]').each(function() {
                var $field = $(this);
                if ( $field.val() === '' ) {
                    $field.addClass('invalid');
                    valid = false;
                } else {
                    $field.removeClass('invalid');
                }
            });

            // Check checkboxes
            $form.find('input[name="Field112"]').each(function() {
                var $field = $(this);
                if ( ! $field.is(':checked') ) {
                    valid = false;
                    $field.parent().addClass('invalid');
                } else {
                    $field.parent().removeClass('invalid');
                }
            });

            if ( ! valid ) {
                e.preventDefault();
            }
        });
    }

};

// Start things off
$(document).ready(site.init);