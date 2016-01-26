import config from '../config';

import browserSync from 'browser-sync';
import cached from 'gulp-cached';
import gulp from 'gulp';
import gulpJspm from 'gulp-jspm';
import eslint from 'gulp-eslint';
import filter from 'gulp-filter';
import lazypipe from 'lazypipe';
import path from 'path';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import rev from 'gulp-rev';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

const paths = {
    src: config.tasks.scripts.src,
    dist: config.tasks.scripts.dist,
    manifest: path.join(config.paths.src, 'rev-manifest.json'),
};

gulp.task('scripts:lint', () => {
    return gulp.src([
            path.join(paths.src, '**/*.js'),
            '!'+path.join(paths.src, 'plugins/modernizr.js'),
            '!'+path.join(paths.src, 'config.js'),
            '!'+path.join(paths.src, 'jspm_packages/**/*.js'),
        ])
        .pipe(cached('esLint'))
        .pipe(eslint())
        .pipe(eslint.format());
});

const tasks = {
    development: (filename) => {
        return lazypipe()
            .pipe(plumber, config.plumber)
            .pipe(sourcemaps.init)
            .pipe(gulpJspm, {selfExecutingBundle: true})
            .pipe(rename, filename)
            .pipe(sourcemaps.write, '.')
            .pipe(gulp.dest, paths.dist)
            .pipe(filter, ['*.{' + config.tasks.scripts.extensions + '}'])
            .pipe(browserSync.stream)
            .pipe(uglify)
            .pipe(size, config.output.size);
    },
    production: (filename) => {
        return lazypipe()
            .pipe(plumber, config.plumber)
            .pipe(sourcemaps.init)
            .pipe(gulpJspm, {selfExecutingBundle: true})
            .pipe(rename, filename)
            .pipe(uglify)
            .pipe(rev)
            .pipe(sourcemaps.write, '.')
            .pipe(gulp.dest, paths.dist)
            .pipe(filter, ['*.{' + config.tasks.scripts.extensions + '}'])
            .pipe(rev.manifest, paths.manifest, {base: config.paths.src, merge: true})
            .pipe(gulp.dest, config.paths.src);
    },
};

gulp.task('scripts', () => {
    const task = tasks[config.mode]('main.js');
    return gulp.src(path.join(paths.src, 'main.js')).pipe(task());
});
