'use strict';

const gulp = require('gulp');
const path = require('path');

const config = require('../config');

const paths = {
    src: [
        path.join(config.tasks.rootfiles.src, `/**/*.{${config.tasks.rootfiles.extensions}}`),
        path.join(config.tasks.rootfiles.src, `/**/.{${config.tasks.rootfiles.extensions}}`),
    ],
    dist: config.tasks.rootfiles.dist,
};

// Copy web root files to dist
gulp.task('rootfiles', () => {
    gulp.src(paths.src)
        .pipe(gulp.dest(paths.dist));
});
