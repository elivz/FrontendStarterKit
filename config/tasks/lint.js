if (global.production) return

const gulp = require('gulp');
const path = require('path');
const eslint = require('gulp-eslint');

module.exports = () => {
    return gulp
        .src(path.resolve(
            process.env.PWD,
            PATH_CONFIG.src,
            PATH_CONFIG.javascripts.src,
            '**/*.js'
        ))
        .pipe(eslint())
        .pipe(eslint.format());
};
