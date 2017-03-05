'use strict';

const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const criticalCss = require('critical');
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
                    cachebuster: true,
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
    const criticalSrc = config.pkg.paths.url + '/' + element.url;
    const criticalDest = taskConfig.critical.dist + '/' + element.template + '.css';

    criticalCss.generate({
        src: criticalSrc,
        dest: criticalDest,
        base: config.pkg.paths.webroot,
        minify: true,
        width: 1200,
        height: 1000
    }).then((output) => {
        callback();
    }).error(config.errorHandler);
}

// Compile CSS files
gulp.task('styles', () => {
    return gulp.src(taskConfig.src).pipe(tasks[config.mode]());
});

gulp.task('styles:critical', ['styles', 'templates'], (cb) => {
    if (config.mode == 'production') {
        doSynchronousLoop(taskConfig.critical.files, processCriticalCSS, () => {
            cb();
        });
    } else {
        cb();
    }
})
