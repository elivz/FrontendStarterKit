import browserSync from 'browser-sync';
import cached from 'gulp-cached';
import gulp from 'gulp';
import path from 'path';
import size from 'gulp-size';

import config from '../config';

const paths = {
    src: path.join(config.tasks.fonts.src, `/**/*.{${config.tasks.fonts.extensions}}`),
    dist: config.tasks.fonts.dist,
};

// Copy web fonts to dist
gulp.task('fonts', () => {
    gulp.src(paths.src)
        .pipe(cached('fonts'))
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream())
        .pipe(size(config.output.size));
});
