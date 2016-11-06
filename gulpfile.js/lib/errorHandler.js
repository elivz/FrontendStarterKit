'use strict';

const notify = require('gulp-notify');

// Error handler for Plumber
module.exports = function errorHandler(error) {
    notify.onError({
        title: 'Gulp Error',
        message: '<%= error.message %>',
        sound: 'beep',
    })(error);

    this.emit('end');
};
