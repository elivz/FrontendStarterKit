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
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

const paths = {
    src: config.tasks.scripts.src,
    dist: config.tasks.scripts.dist
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
            .pipe(filter, ['*.js'])
            .pipe(browserSync.stream)
            .pipe(uglify)
            .pipe(size, config.output.size);
    },
    production: (filename) => {
        return lazypipe()
            .pipe(plumber, config.plumber)
            .pipe(sourcemaps.init)
            .pipe(concat, filename)
            .pipe(babel)
            .pipe(uglify)
            .pipe(sourcemaps.write, '.')
            .pipe(gulp.dest, paths.dist);
    }
};

gulp.task('scripts:lint', () => {
    return gulp.src(path.join(paths.src, '/**/*.js'))
        .pipe(cached('esLint'))
        .pipe(eslint())
        .pipe(eslint.format());
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

gulp.task('scripts:header', () => {
    const task = tasks[config.mode](config.tasks.scripts.entries.header.filename);
    const src = config.tasks.scripts.entries.header.dependencies
        .concat(path.join(config.tasks.scripts.entries.header.src, '**/*.js'));

    return gulp.src(src).pipe(task());
});

gulp.task('scripts:ie8', () => {
    const task = tasks[config.mode](config.tasks.scripts.entries.ie8.filename);
    const src = config.tasks.scripts.entries.ie8.dependencies
        .concat(path.join(config.tasks.scripts.entries.ie8.src, '**/*.js'));

    return gulp.src(config.tasks.scripts.entries.ie8.dependencies).pipe(task());
});

// Default Task
gulp.task('scripts', () => {
    gulp.start(
        'scripts:main',
        'scripts:header',
        'scripts:ie8'
    );
});
