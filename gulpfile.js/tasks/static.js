'use strict';

const gulp = require('gulp');
const config = require('../lib/config');

const taskConfig = config.pkg.tasks.static;

// Copy favicon & touch icons to dist
gulp.task('static', () => {
    gulp.src(taskConfig.src).pipe(gulp.dest(taskConfig.dist));
});
