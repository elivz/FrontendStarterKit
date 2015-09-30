import config from '../../config';

import browserSync from 'browser-sync';
import filter from 'gulp-filter';
import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import path from 'path';
import plumber from 'gulp-plumber';
import size from 'gulp-size';
import svg2png from 'gulp-svg2png';
import svgSprite from 'gulp-svg-sprite';

const paths = {
    src: path.join(config.tasks.sprites.src, '/*.svg'),
    dist: config.tasks.sprites.dist,
};

// Buld SVG Sprites
gulp.task('sprites', function() {
    return gulp.src(paths.src)
        .pipe(plumber(config.plumber))
        .pipe(svgSprite({
            mode: {
                css: {
                    dest: './',
                    layout: 'vertical',
                    sprite: 'sprites.svg',
                    render: {
                        scss: {
                            dest: path.resolve('../../../../', config.tasks.styles.src, 'generated/_sprites.scss'),
                            template: path.resolve(__dirname, 'template.sass'),
                        },
                    },
                },
            },
        }))
        .pipe(imagemin(config.tasks.images.optimization))
        .pipe(gulp.dest(paths.dist))
        .pipe(size(config.output.size))
        .pipe(filter(['*.svg']))
        .pipe(svg2png())
        .pipe(imagemin(config.tasks.images.optimization))
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});
