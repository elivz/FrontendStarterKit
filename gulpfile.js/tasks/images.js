'use strict';

const browserSync = require('browser-sync');
const cached = require('gulp-cached');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const size = require('gulp-size');
const config = require('../lib/config');

const taskConfig = config.pkg.tasks.images;

// Copy and optimize all images for individual use
gulp.task('images:main', () =>
    gulp
        .src(taskConfig.main.src)
        .pipe(cached('images'))
        .pipe(imagemin(config.imageminConfig))
        .pipe(gulp.dest(taskConfig.main.dist))
        .pipe(size(config.output.size))
        .pipe(browserSync.stream())
);

// Copy and optimize any images in the templates folder (to be inlined)
gulp.task('images:inline', () =>
    gulp
        .src(taskConfig.inline.src)
        .pipe(cached('inline-images'))
        .pipe(imagemin(config.imageminConfig))
        .pipe(gulp.dest(taskConfig.inline.dist))
);

gulp.task('images', ['images:main', 'images:inline']);
