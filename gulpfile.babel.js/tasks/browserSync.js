import browserSync from 'browser-sync';
import gulp from 'gulp';

import config from '../config';

gulp.task('browserSync', () => {
    return browserSync.init(config.browserSync);
});

gulp.task('browserSync:reload', browserSync.reload);
