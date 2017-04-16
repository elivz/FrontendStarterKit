'use strict';

const browserSync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const sequence = require('gulp-sequence');

const config = require('./config');

// Set up Browsersync
gulp.task('browserSync', () => {
    return browserSync.init(config.browserSync);
});
gulp.task('browserSync:reload', browserSync.reload);

// Default task
gulp.task('default', sequence.apply(this, config.pkg.default));

// File watcher
gulp.task('watch', ['browserSync'], () => {
    Object.keys(config.pkg.tasks).forEach(taskName => {
        const taskOptions = config.pkg.tasks[taskName];
        let src = taskOptions.src || [];
        if (typeof taskOptions.files == 'object') {
            for (const file in taskOptions.files) {
                src = src.concat(taskOptions.files[file]);
            }
        }

        gulp.watch(src, () => {
            gulp.start(taskName);
        });
    });
});

// Clean distribution files
gulp.task('clean', () => {
    return del(config.pkg.clean);
});
