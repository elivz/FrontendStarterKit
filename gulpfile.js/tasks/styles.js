'use strict';

const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const cssAssets = require('postcss-assets');
const cssnano = require('cssnano');
const gulp = require('gulp');
const filter = require('gulp-filter');
const lazypipe = require('lazypipe');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rev = require('gulp-rev');
const sass = require('gulp-sass');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const config = require('../lib/config');

const taskConfig = config.pkg.tasks.styles;

const tasks = {
    development: (() => {
        return lazypipe()
            .pipe(plumber, config.errorHandler)
            .pipe(sourcemaps.init)
            .pipe(sass)
            .pipe(postcss, [
                cssAssets({
                    loadPaths: ['assets/images'],
                    basePath: config.pkg.paths.webroot,
                }),
                autoprefixer(),
            ])
            .pipe(sourcemaps.write, '.')
            .pipe(gulp.dest, taskConfig.dist)
            .pipe(filter, ['**/*.css'])
            .pipe(browserSync.stream)
            .pipe(size, config.output.size);

    })(),
    production: (() => {
        return lazypipe()
            .pipe(plumber, config.errorHandler)
            .pipe(sourcemaps.init)
            .pipe(sass)
            .pipe(postcss, [
                cssAssets({
                    loadPaths: ['assets/images'],
                    basePath: config.pkg.paths.webroot,
                }),
                autoprefixer(),
                cssnano(),
            ])
            .pipe(rev)
            .pipe(sourcemaps.write, '.')
            .pipe(gulp.dest, taskConfig.dist)
            .pipe(rev.manifest, config.pkg.manifest.file, { base: config.pkg.manifest.path, merge: true })
            .pipe(gulp.dest, config.pkg.manifest.path);
    })(),
};

gulp.task('styles', () => {
    return gulp.src(taskConfig.src).pipe(tasks[config.mode]());
});
