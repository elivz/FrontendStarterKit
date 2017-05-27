const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const cssAssets = require('postcss-assets');
const cssnano = require('gulp-cssnano');
const gulpif = require('gulp-if');
const notify = require('gulp-notify');
const path = require('path');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

module.exports = (gulp, PATH_CONFIG, TASK_CONFIG) => () => {
    const paths = {
        src: [
            path.resolve(
                process.env.PWD,
                PATH_CONFIG.src,
                PATH_CONFIG.stylesheets.src,
                '**/*.{' + TASK_CONFIG.stylesheets.extensions + '}'
            ),
        ],
        dest: path.resolve(
            process.env.PWD,
            PATH_CONFIG.dest,
            PATH_CONFIG.stylesheets.dest
        ),
    };

    if (
        TASK_CONFIG.stylesheets.sass &&
        TASK_CONFIG.stylesheets.sass.includePaths
    ) {
        TASK_CONFIG.stylesheets.sass.includePaths = TASK_CONFIG.stylesheets.sass.includePaths.map(
            includePath => path.resolve(process.env.PWD, includePath)
        );
    }

    const cssnanoConfig = TASK_CONFIG.stylesheets.cssnano || {};
    cssnanoConfig.autoprefixer = false; // this should always be false, since we're autoprefixing separately

    return gulp
        .src(paths.src)
        .pipe(sourcemaps.init())
        .pipe(sass(TASK_CONFIG.stylesheets.sass))
        .on('error', function handleError(errorObject, callback) {
            notify
                .onError(errorObject.toString().split(': ').join(':\n'))
                .apply(this, arguments);
            // Keep gulp from hanging on this task
            if (typeof this.emit === 'function') this.emit('end');
        })
        .pipe(
            postcss([
                cssAssets({
                    loadPaths: ['assets/images'],
                    basePath: PATH_CONFIG.webroot,
                }),
                autoprefixer(TASK_CONFIG.stylesheets.autoprefixer),
            ])
        )
        .pipe(gulpif(global.production, cssnano(cssnanoConfig)))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.stream());
};
