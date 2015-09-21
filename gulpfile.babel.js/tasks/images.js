import config from '../config';

import browserSync from 'browser-sync';
import cached from 'gulp-cached';
import filter from 'gulp-filter';
import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import path from 'path';
import plumber from 'gulp-plumber';
import size from 'gulp-size';
import svg2png from 'gulp-svg2png';
import unretina from 'gulp-unretina';

const paths = {
    src: path.join(config.tasks.images.src, '/*.{' + config.tasks.images.extensions + '}'),
    dist: config.tasks.images.dist
};

// Optimize Images
gulp.task('images', function() {
    var retinaFilter = filter(['**/*@2x.png'], {restore: true});

    return gulp.src(paths.src)
        .pipe(plumber(config.plumber))
        .pipe(cached('images'))
        .pipe(imagemin(config.tasks.images.optimization))
        .pipe(gulp.dest(paths.dist))
        .pipe(size(config.output.size))

        // Deretinaize any images with the suffix '@2x'
        .pipe(retinaFilter)
        .pipe(unretina())
        .pipe(imagemin(config.tasks.images.optimization))
        .pipe(gulp.dest(paths.dist))
        .pipe(retinaFilter.restore)

        // Convert SVGs to PNG format for IE8 fallback
        .pipe(filter(['*.svg']))
        .pipe(svg2png())
        .pipe(imagemin(config.tasks.images.optimization))
        .pipe(gulp.dest(paths.dist))

        // Reload
        .pipe(browserSync.stream());
});
