'use strict';

const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const criticalCss = require('critical');
const cssAssets = require('postcss-assets');
const cssnano = require('cssnano');
const filter = require('gulp-filter');
const gulp = require('gulp');
const lazypipe = require('lazypipe');
const postcss = require('gulp-postcss');
const rev = require('gulp-rev');
const sass = require('gulp-sass');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const config = require('../lib/config');

const taskConfig = config.pkg.tasks.styles;

const tasks = {
    development: (() =>
        lazypipe()
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
            .pipe(postcss, [cssnano()])
            .pipe(size, config.output.size))(),
    production: (() =>
        lazypipe()
            .pipe(sass)
            .pipe(postcss, [
                cssAssets({
                    loadPaths: ['assets/images'],
                    basePath: config.pkg.paths.webroot,
                    cachebuster: true,
                }),
                autoprefixer(),
                cssnano(),
            ])
            .pipe(rev)
            .pipe(gulp.dest, taskConfig.dist)
            .pipe(rev.manifest, config.pkg.manifest.file, {
                base: config.pkg.manifest.path,
                merge: true,
            })
            .pipe(gulp.dest, config.pkg.manifest.path))(),
};

// Process data in an array synchronously, moving onto the n+1 item only after the nth item callback
function doSynchronousLoop(data, processData, done) {
    if (data.length > 0) {
        const loop = (data, i, processData, done) => {
            processData(data[i], i, () => {
                if (++i < data.length) {
                    loop(data, i, processData, done);
                } else {
                    done();
                }
            });
        };
        loop(data, 0, processData, done);
    } else {
        done();
    }
}

// Process the critical path CSS one at a time
function processCriticalCSS(element, i, callback) {
    const criticalSrc = `${config.pkg.paths.url}/${element.url}`;
    const criticalDest = `${taskConfig.critical.dist}/${element.template}.css`;

    criticalCss
        .generate({
            src: criticalSrc,
            dest: criticalDest,
            base: config.pkg.paths.webroot,
            minify: true,
            width: 1200,
            height: 1000,
        })
        .then(() => {
            callback();
        });
}

// Compile CSS files
gulp.task('styles', () => {
    return gulp
        .src(taskConfig.src)
        .pipe(tasks[config.productionMode ? 'production' : 'development']());
});

gulp.task('styles:critical', cb => {
    if (config.productionMode) {
        doSynchronousLoop(taskConfig.critical.files, processCriticalCSS, () => {
            cb();
        });
    } else {
        cb();
    }
});
