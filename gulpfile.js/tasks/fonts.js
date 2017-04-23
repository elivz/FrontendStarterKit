const browserSync = require('browser-sync');
const cached = require('gulp-cached');
const gulp = require('gulp');
const size = require('gulp-size');
const config = require('../lib/config');

const taskConfig = config.pkg.tasks.fonts;

// Copy web fonts to dist
gulp.task('fonts', () => {
    gulp
        .src(taskConfig.src)
        .pipe(cached('fonts'))
        .pipe(gulp.dest(taskConfig.dist))
        .pipe(browserSync.stream())
        .pipe(size(config.output.size));
});
