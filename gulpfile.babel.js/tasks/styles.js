import config from '../config';

import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import cssAssets from 'postcss-assets';
import cssnano from 'cssnano';
import gulp from 'gulp';
import lazypipe from 'lazypipe';
import path from 'path';
import postcss from 'gulp-postcss';
import rev from 'gulp-rev';
import sass from 'gulp-sass';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';

const paths = {
    src: config.tasks.styles.dependencies
        .concat(path.join(config.tasks.styles.src, `/**/*.{${config.tasks.styles.extensions}}`)),
    dist: config.tasks.styles.dist,
    manifest: path.join(config.paths.src, 'rev-manifest.json'),
};

const tasks = {
    development: (lazypipe()
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
        .pipe(browserSync.stream, { match: '**/*.css' })
        .pipe(size, config.output.size)
    )(),
    production: (lazypipe()
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
        .pipe(gulp.dest, config.paths.src)
    )(),
};

gulp.task('styles', () => {
    return gulp.src(paths.src)
        .pipe(tasks[config.mode]);
});
