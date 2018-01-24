const browserSync = require('browser-sync');
const handleErrors = require('blendid/gulpfile.js/lib/handleErrors');
const path = require('path');

module.exports = (gulp, PATH_CONFIG, TASK_CONFIG) => () => {
    const exclude =
        '!' +
        path.resolve(
            process.env.PWD,
            PATH_CONFIG.src,
            PATH_CONFIG.html.src,
            '**/{' + TASK_CONFIG.html.excludeFolders.join(',') + '}/**'
        );

    const paths = {
        src: [
            path.resolve(
                process.env.PWD,
                PATH_CONFIG.src,
                PATH_CONFIG.html.src,
                '**/*.{' + TASK_CONFIG.html.extensions + '}'
            ),
            exclude,
        ],
        dest: path.resolve(
            process.env.PWD,
            PATH_CONFIG.dest,
            PATH_CONFIG.html.dest
        ),
    };

    return gulp
        .src(paths.src)
        .on('error', handleErrors)
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.stream());
};
