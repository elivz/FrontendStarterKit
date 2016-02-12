import config from '../config';

import browserSync from 'browser-sync';
import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import path from 'path';

const paths = {
    src: path.join(config.tasks.rootfiles.src, '/**/*'),
    dist: config.tasks.rootfiles.dist,
};

// Copy web root files to dist
gulp.task('rootfiles', () => {
    gulp.src(paths.src)
        .pipe(gulp.dest(paths.dist));
});
