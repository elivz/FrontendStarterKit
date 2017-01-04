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

// Optimize Images
gulp.task('images', () => {
    const retinaFilter = filter(['**/*@2x.png'], { restore: true });

    return gulp.src(taskConfig.src)
        .pipe(cached('images'))
        .pipe(imagemin(config.imageminConfig))
        .pipe(gulp.dest(taskConfig.dist))
        .pipe(size(config.output.size))

        // Deretinaize any images with the suffix '@2x'
        .pipe(retinaFilter)
        .pipe(unretina())
        .pipe(imagemin(config.imageminConfig))
        .pipe(gulp.dest(taskConfig.dist))
        .pipe(retinaFilter.restore)

        // Reload
        .pipe(browserSync.stream());
});
