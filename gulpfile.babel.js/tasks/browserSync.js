import config from '../config';

import browserSync from 'browser-sync';
import gulp from 'gulp';

gulp.task('browserSync', () => {
    return browserSync.init(config.browserSync);
});

gulp.task('browserSync:reload', browserSync.reload);
