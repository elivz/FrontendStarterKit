'use strict';

const gulp = require('gulp');
const config = require('../lib/config');

const taskConfig = config.pkg.tasks.favicons;

// Copy favicon & touch icons to dist
gulp.task('favicons', () => {
    gulp.src(taskConfig.src)
        .pipe(gulp.dest(taskConfig.dist));
});
