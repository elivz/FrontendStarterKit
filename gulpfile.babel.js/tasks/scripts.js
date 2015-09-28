import config from '../config';

import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import cached from 'gulp-cached';
import concat from 'gulp-concat';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import filter from 'gulp-filter';
import lazypipe from 'lazypipe';
import path from 'path';
import plumber from 'gulp-plumber';
import rev from 'gulp-rev';
import sequence from  'gulp-sequence';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

const paths = {
    src: config.tasks.scripts.src,
    dist: config.tasks.scripts.dist,
    manifest: path.join(config.paths.src, 'rev-manifest.json')
};

const tasks = {
    development: (filename) => {
        return lazypipe()
            .pipe(plumber, config.plumber)
            .pipe(sourcemaps.init)
            .pipe(concat, filename)
            .pipe(babel)
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
            .pipe(concat, {path: filename, cwd: ''})
            .pipe(babel)
            .pipe(uglify)
            .pipe(rev)
            .pipe(sourcemaps.write, '.')
            .pipe(gulp.dest, paths.dist)
            .pipe(filter, ['*.{' + config.tasks.scripts.extensions + '}'])
            .pipe(rev.manifest, paths.manifest, {base: config.paths.src, merge: true})
            .pipe(gulp.dest, config.paths.src);
    }
};

gulp.task('scripts:lint', () => {
    return gulp.src(path.join(paths.src, '/**/*.js'))
        .pipe(cached('esLint'))
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('scripts:header', () => {
    const task = tasks[config.mode](config.tasks.scripts.entries.header.filename);
    const src = config.tasks.scripts.entries.header.dependencies
        .concat(path.join(config.tasks.scripts.entries.header.src, '**/*.js'));

    return gulp.src(src).pipe(task());
});

gulp.task('scripts:main', ['scripts:lint'], () => {
    const task = tasks[config.mode](config.tasks.scripts.entries.main.filename);
    const srcPath = config.tasks.scripts.entries.main.src;
    const src = [path.join(srcPath, 'libs/**/*.js')]
        .concat(config.tasks.scripts.entries.main.dependencies)
        .concat(path.join(srcPath, 'plugins/**/*.js'))
        .concat(path.join(srcPath, '*.js'));

    return gulp.src(src).pipe(task());
});

// Default Task
gulp.task('scripts', sequence(
    'scripts:header',
    'scripts:main'
));
