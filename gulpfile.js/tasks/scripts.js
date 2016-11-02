"use strict";

const browserSync = require('browser-sync');
const cached = require('gulp-cached');
const gulp = require('gulp');
const gulpJspm = require('gulp-jspm');
const eslint = require('gulp-eslint');
const filter = require('gulp-filter');
const lazypipe = require('lazypipe');
const path = require('path');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const rev = require('gulp-rev');
const sequence = require('gulp-sequence');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const config = require('../config');

const paths = {
    src: config.tasks.scripts.src,
    dist: config.tasks.scripts.dist,
    manifest: path.join(config.paths.src, 'rev-manifest.json'),
};

gulp.task('scripts:lint', () => {
    if (config.mode === 'production') return true;

    return gulp.src([
            path.join(paths.src, '**/*.js'),
            '!' + path.join(paths.src, 'config.js'),
            '!' + path.join(paths.src, 'jspm_packages/**/*.js'),
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
            .pipe(gulpJspm, { selfExecutingBundle: true })
            .pipe(rename, filename)
            .pipe(sourcemaps.write, '.')
            .pipe(gulp.dest, paths.dist)
            .pipe(browserSync.stream, { match: '**/*.js' })
            .pipe(filter, [`**/*.{${config.tasks.scripts.extensions}}`])
            .pipe(uglify)
            .pipe(size, config.output.size);
    },
    production: (filename) => {
        return lazypipe()
            .pipe(plumber, config.plumber)
            .pipe(sourcemaps.init)
            .pipe(gulpJspm, { selfExecutingBundle: true })
            .pipe(rename, filename)
            .pipe(uglify)
            .pipe(rev)
            .pipe(sourcemaps.write, '.')
            .pipe(gulp.dest, paths.dist)
            .pipe(rev.manifest, paths.manifest, { base: config.paths.src, merge: true })
            .pipe(gulp.dest, config.paths.src);
    },
};

for (const file of config.tasks.scripts.files) {
    gulp.task(file, () => {
        const task = tasks[config.mode](file);
        return gulp.src(path.join(paths.src, file)).pipe(task());
    });
}

gulp.task('scripts', ['scripts:lint'], (cb) => {
    sequence.apply(this, config.tasks.scripts.files.concat('browserSync:reload'))(cb);
});
