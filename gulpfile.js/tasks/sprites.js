'use strict';

const browserSync = require('browser-sync');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const size = require('gulp-size');
const svgSprite = require('gulp-svg-sprite');
const config = require('../lib/config');

const taskConfig = config.pkg.tasks.sprites;

// Buld SVG Sprites
gulp.task('sprites', () => {
    gulp.src(taskConfig.src)
        .pipe(plumber(config.errorHandler))
        .pipe(svgSprite({
            shape: {
                id: {
                    generator: 's-%s',
                },
                transform: [{
                    svgo: {
                        plugins: config.svgoConfig,
                    },
                }],
            },
            mode: {
                symbol: {
                    dest: './',
                    sprite: 'sprites.svg',
                },
            },
        }))
        .pipe(gulp.dest(taskConfig.dist))
        .pipe(size(config.output.size))
        .pipe(browserSync.stream());
});
