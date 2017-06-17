const browserSync = require('browser-sync');
const gulpif = require('gulp-if');
const path = require('path');

module.exports = (gulp, PATH_CONFIG, TASK_CONFIG) => () => {
    const paths = {
        src: [
            path.resolve(
                process.env.PWD,
                PATH_CONFIG.src,
                PATH_CONFIG.html.src,
                '**/*.{' + TASK_CONFIG.html.extensions + '}'
            ),
        ],
        dest: path.resolve(
            process.env.PWD,
            PATH_CONFIG.dest,
            PATH_CONFIG.html.dest
        ),
    };

    return gulp
        .src(paths.src)
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.stream());
};
