'use strict';

const browserSync = require('browser-sync');
const cached = require('gulp-cached');
const filter = require('gulp-filter');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const path = require('path');
const plumber = require('gulp-plumber');
const size = require('gulp-size');
const unretina = require('gulp-unretina');

const config = require('../config');

const paths = {
    src: path.join(config.tasks.images.src, `/**/*.{${config.tasks.images.extensions}}`),
    dist: config.tasks.images.dist,
};

// Optimize Images
gulp.task('images', () => {
    const retinaFilter = filter(['**/*@2x.png'], { restore: true });

    return gulp.src(paths.src)
        .pipe(plumber(config.plumber))
        .pipe(cached('images'))
        .pipe(imagemin(config.tasks.images.optimization))
        .pipe(gulp.dest(paths.dist))
        .pipe(size(config.output.size))

        // Deretinaize any images with the suffix '@2x'
        .pipe(retinaFilter)
        .pipe(unretina())
        .pipe(imagemin(config.tasks.images.optimization))
        .pipe(gulp.dest(paths.dist))
        .pipe(retinaFilter.restore)

        // Reload
        .pipe(browserSync.stream());
});
