"use strict";

const browserSync = require('browser-sync');
const gulp = require('gulp');
const path = require('path');
const plumber = require('gulp-plumber');
const size = require('gulp-size');
const svgSprite = require('gulp-svg-sprite');

const config = require('../config');

const paths = {
    src: path.join(config.tasks.sprites.src, `/**/*.{${config.tasks.sprites.extensions}}`),
    dist: config.tasks.sprites.dist,
};

// Buld SVG Sprites
gulp.task('sprites', () => {
    gulp.src(paths.src)
        .pipe(plumber(config.plumber))
        .pipe(svgSprite({
            shape: {
                id: {
                    generator: 's-%s',
                },
                transform: [{
                    svgo: {
                        plugins: config.tasks.sprites.svgoConfig,
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
        .pipe(gulp.dest(paths.dist))
        .pipe(size(config.output.size))
        .pipe(browserSync.stream());
});
