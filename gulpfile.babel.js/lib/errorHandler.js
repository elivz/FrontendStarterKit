import notify from 'gulp-notify';

// Error handler for Plumber
export default function errorHandler(error) {
    notify.onError({
        title: 'Gulp Error',
        message: '<%= error.message %>',
        sound: 'beep'
    })(error);

    this.emit('end');
};
