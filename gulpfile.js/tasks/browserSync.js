'use strict';

const browserSync = require('browser-sync');
const gulp = require('gulp');

const config = require('../config');

gulp.task('browserSync', () => {
    return browserSync.init(config.browserSync);
});

gulp.task('browserSync:reload', browserSync.reload);
