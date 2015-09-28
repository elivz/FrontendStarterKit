import config from '../config';

import gulp from  'gulp';
import path from  'path';
import sequence from  'gulp-sequence';

// Default Task
gulp.task('default', sequence(
    'clean',
    [
        'scripts',
        'jquery',
        'fonts',
        'images',
        'sprites'
    ],
    'styles',
    'templates'
));
