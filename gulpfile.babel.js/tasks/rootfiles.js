import config from '../config';

import gulp from 'gulp';
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
