'use strict';

const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const cssAssets = require('postcss-assets');
const cssnano = require('cssnano');
const gulp = require('gulp');
const filter = require('gulp-filter');
const lazypipe = require('lazypipe');
const path = require('path');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rev = require('gulp-rev');
const sass = require('gulp-sass');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');

const config = require('../config');

const paths = {
    src: config.tasks.styles.dependencies
        .concat(path.join(config.tasks.styles.src, `/**/*.{${config.tasks.styles.extensions}}`)),
    dist: config.tasks.styles.dist,
    manifest: path.join(config.paths.dist, 'rev-manifest.json'),
};

const tasks = {
    development: (() => {
        return lazypipe()
            .pipe(plumber, config.plumber)
            .pipe(sourcemaps.init)
            .pipe(sass)
            .pipe(postcss, [
                cssAssets({
                    loadPaths: ['assets/images'],
                    basePath: config.paths.webroot,
                }),
                autoprefixer(),
            ])
            .pipe(sourcemaps.write, '.')
            .pipe(gulp.dest, paths.dist)
            .pipe(filter, [`**/*.{${config.tasks.styles.extensions}}`])
            .pipe(browserSync.stream)
            .pipe(size, config.output.size);

    })(),
    production: (() => {
        return lazypipe()
            .pipe(plumber, config.plumber)
            .pipe(sourcemaps.init)
            .pipe(sass)
            .pipe(postcss, [
                cssAssets({
                    loadPaths: ['assets/images'],
                    basePath: config.paths.webroot,
                }),
                autoprefixer(),
                cssnano(),
            ])
            .pipe(rev)
            .pipe(sourcemaps.write, '.')
            .pipe(gulp.dest, paths.dist)
            .pipe(rev.manifest, paths.manifest, { base: config.paths.src, merge: true })
            .pipe(gulp.dest, config.paths.src);
    })(),
};

gulp.task('styles', () => {
    return gulp.src(paths.src).pipe(tasks[config.mode]());
});
