import config from '../config';

import gulp from 'gulp';
import lazypipe from 'lazypipe';
import path from 'path';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

const tasks = {
    development: () => {
        return lazypipe()
            .pipe(gulp.dest, config.tasks.jquery.dist);
    }(),
    production: () => {
        return lazypipe()
            .pipe(sourcemaps.init)
            .pipe(uglify)
            .pipe(sourcemaps.write, '.')
            .pipe(gulp.dest, config.tasks.jquery.dist);
    }(),
};

// Get the most recent copies of jQuery
gulp.task('jquery', () => {
    return gulp.src(config.tasks.jquery.src).pipe(tasks[config.mode]());
});
