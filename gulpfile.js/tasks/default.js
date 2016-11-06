'use strict';

const gulp = require('gulp');
const sequence = require('gulp-sequence');

// Default Task
gulp.task('default', sequence(
    'clean',
    [
        'fonts',
        'images',
        'sprites',
        'rootfiles',
    ],
    'styles',
    'scripts',
    'templates'
));
