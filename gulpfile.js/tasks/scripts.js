'use strict';

const browserSync = require('browser-sync');
const cached = require('gulp-cached');
const gulp = require('gulp');
const gulpJspm = require('gulp-jspm');
const eslint = require('gulp-eslint');
const filter = require('gulp-filter');
const lazypipe = require('lazypipe');
const plumber = require('gulp-plumber');
const rev = require('gulp-rev');
const sequence = require('gulp-sequence');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const config = require('../lib/config');

const taskConfig = config.pkg.tasks.scripts;

gulp.task('scripts:lint', () => {
    if (config.mode === 'production') return true;

    return gulp.src(taskConfig.lint)
        .pipe(cached('esLint'))
        .pipe(eslint())
        .pipe(eslint.format());
});

const tasks = {
    development: (filename) => {
        return lazypipe()
            .pipe(plumber, config.errorHandler)
            .pipe(sourcemaps.init)
            .pipe(gulpJspm, {
                selfExecutingBundle: true,
                fileName: filename,
            })
            .pipe(sourcemaps.write, '.')
            .pipe(gulp.dest, taskConfig.dist)
            .pipe(filter, ['**/*.js'])
            .pipe(browserSync.stream)
            .pipe(size, config.output.size);
    },
    production: (filename) => {
        return lazypipe()
            .pipe(plumber, config.errorHandler)
            .pipe(sourcemaps.init)
            .pipe(gulpJspm, {
                selfExecutingBundle: true,
                minify: true,
                fileName: filename,
            })
            .pipe(rev)
            .pipe(sourcemaps.write, '.')
            .pipe(gulp.dest, taskConfig.dist)
            .pipe(rev.manifest, config.pkg.manifest.file, { base: config.pkg.manifest.path, merge: true })
            .pipe(gulp.dest, config.pkg.manifest.path);
    },
};

for (const file in taskConfig.files) {
    gulp.task(file, () => {
        const task = tasks[config.mode](file);
        return gulp.src(taskConfig.files[file]).pipe(task());
    });
}

gulp.task('scripts', ['scripts:lint'], (cb) => {
    sequence.apply(this, Object.keys(taskConfig.files).concat('browserSync:reload'))(cb);
});
