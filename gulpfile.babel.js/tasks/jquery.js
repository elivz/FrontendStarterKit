import config from '../config';

import gulp from 'gulp';
import jquery from 'gulp-jquery';
import lazypipe from 'lazypipe';
import path from 'path';
import rename from 'gulp-rename';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

const task = (filename) => {
    return lazypipe()
        .pipe(sourcemaps.init)
        .pipe(rename,filename)
        .pipe(uglify)
        .pipe(sourcemaps.write, '.')
        .pipe(gulp.dest, config.tasks.jquery.dist)
        .pipe(size, config.output.size);
};

// Get the most recent copies of jQuery
gulp.task('jquery', function() {
    jquery.src({
            release: 1,
            flags: config.tasks.jquery.flags
        })
        .pipe(task('jquery.1.js')());

    jquery.src({
            release: 2,
            flags: config.tasks.jquery.flags
        })
        .pipe(task('jquery.2.js')());
});
