import config from '../config';

import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import gulp from 'gulp';
import filter from 'gulp-filter';
import lazypipe from 'lazypipe';
import minifyCss from 'gulp-minify-css';
import path from 'path';
import plumber from 'gulp-plumber';
import rev from 'gulp-rev';
import sass from 'gulp-sass';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';

const paths = {
    src: config.tasks.styles.dependencies
        .concat(path.join(config.tasks.styles.src, '/**/*.{' + config.tasks.styles.extensions + '}')),
    dist: config.tasks.styles.dist,
    manifest: path.join(config.paths.src, 'rev-manifest.json'),
};

const tasks = {
    development: (() => {
        return lazypipe()
            .pipe(plumber, config.plumber)
            .pipe(sourcemaps.init)
            .pipe(sass)
            .pipe(autoprefixer, config.tasks.styles.autoprefixer)
            .pipe(sourcemaps.write, '.')
            .pipe(gulp.dest, paths.dist)
            .pipe(filter, ['*.{' + config.tasks.styles.extensions + '}'])
            .pipe(browserSync.stream)
            .pipe(minifyCss, {compatibility: 'ie8', sourceMap: false})
            .pipe(size, config.output.size);
    })(),
    production: (() => {
        return lazypipe()
            .pipe(plumber, config.plumber)
            .pipe(sourcemaps.init)
            .pipe(sass)
            .pipe(autoprefixer, config.tasks.styles.autoprefixer)
            .pipe(minifyCss, {compatibility: 'ie8'})
            .pipe(rev)
            .pipe(sourcemaps.write, '.')
            .pipe(gulp.dest, paths.dist)
            .pipe(filter, ['*.{' + config.tasks.styles.extensions + '}'])
            .pipe(rev.manifest, paths.manifest, {base: config.paths.src, merge: true})
            .pipe(gulp.dest, config.paths.src);
    })(),
};

gulp.task('styles', () => {
    return gulp.src(paths.src).pipe(tasks[config.mode]());
});
