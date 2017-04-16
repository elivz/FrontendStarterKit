'use strict';

const yargs = require('yargs');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');

const pkg = require('../../package.json').build;

module.exports = {
    pkg,

    mode: yargs.argv.production ? 'production' : 'development',

    output: {
        size: {
            gzip: true,
            showFiles: true,
        },
    },

    browserSync: {
        open: 'external',
        xip: true,
        proxy: pkg.paths.url,
    },

    svgoConfig: pkg.tasks.images.svgo,

    imageminConfig: [
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.gifsicle({ interlaced: true }),
        imagemin.svgo({ plugins: pkg.tasks.images.svgo }),
    ],

    errorHandler: error => {
        notify.onError({
            title: 'Gulp Error',
            message: '<%= error.message %>',
            sound: 'beep',
        })(error);
        this.emit('end');
    },
};
