import browserSync from 'browser-sync';
import gulp from 'gulp';
import path from 'path';
import plumber from 'gulp-plumber';
import size from 'gulp-size';
import svgSprite from 'gulp-svg-sprite';

import config from '../config';

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
