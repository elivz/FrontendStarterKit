'use strict';

const imagemin = require('gulp-imagemin');
const pkg = require('../../package.json').build;

module.exports = {
    pkg,

    productionMode: process.env.NODE_ENV || false,

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
};
