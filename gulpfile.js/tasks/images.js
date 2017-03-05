'use strict';

const browserSync = require('browser-sync');
const cached = require('gulp-cached');
const filter = require('gulp-filter');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const size = require('gulp-size');
const unretina = require('gulp-unretina');
const config = require('../lib/config');

const taskConfig = config.pkg.tasks.images;

// Copy and optimize all images for individual use
gulp.task('images:main', () => {
    const retinaFilter = filter(['**/*@2x.png'], { restore: true });

    return gulp.src(taskConfig.main.src)
        .pipe(cached('images'))
        .pipe(imagemin(config.imageminConfig))
        .pipe(gulp.dest(taskConfig.main.dist))
        .pipe(size(config.output.size))

        // Deretinaize any images with the suffix '@2x'
        .pipe(retinaFilter)
        .pipe(unretina())
        .pipe(imagemin(config.imageminConfig))
        .pipe(gulp.dest(taskConfig.main.dist))
        .pipe(retinaFilter.restore)

        // Reload
        .pipe(browserSync.stream());
});

// Copy and optimize any images in the templates folder (to be inlined)
gulp.task('images:inline', () => {
    return gulp.src(taskConfig.inline.src)
        .pipe(cached('templates-images'))
        .pipe(imagemin(config.imageminConfig))
        .pipe(gulp.dest(taskConfig.inline.dist));
});

gulp.task('images', ['images:main', 'images:inline']);
