import config from '../config';

import browserSync from 'browser-sync';
import cached from 'gulp-cached';
import gulp from 'gulp';
import path from 'path';


const paths = {
    src: path.join(config.tasks.templates.src, '/*.{' + config.tasks.templates.extensions + '}'),
    dist: config.tasks.templates.dist
};

// Copy web html to dist
gulp.task('templates', () => {
    gulp.src(paths.src)
        .pipe(cached('templates'))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('templates-watch', ['templates'], () => {
    return browserSync.reload();
});
