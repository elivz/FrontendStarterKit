"use strict";

const browserSync = require('browser-sync');
const cached = require('gulp-cached');
const gulp = require('gulp');
const path = require('path');
const size = require('gulp-size');

const config = require('../config');

const paths = {
    src: path.join(config.tasks.fonts.src, `/**/*.{${config.tasks.fonts.extensions}}`),
    dist: config.tasks.fonts.dist,
};

// Copy web fonts to dist
gulp.task('fonts', () => {
    gulp.src(paths.src)
        .pipe(cached('fonts'))
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream())
        .pipe(size(config.output.size));
});
