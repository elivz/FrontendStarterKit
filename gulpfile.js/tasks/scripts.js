const browserSync = require('browser-sync');
const cached = require('gulp-cached');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const lazypipe = require('lazypipe');
const rev = require('gulp-rev');
const named = require('vinyl-named');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const config = require('../lib/config');

const taskConfig = config.pkg.tasks.scripts;

gulp.task('scripts:lint', () => {
    if (config.productionMode) return true;

    return gulp
        .src(taskConfig.lint)
        .pipe(cached('esLint'))
        .pipe(eslint())
        .pipe(eslint.format());
});

const tasks = {
    development: (() =>
        lazypipe()
            .pipe(named)
            .pipe(
                webpackStream,
                {
                    devtool: 'cheap-module-source-map',
                    module: {
                        rules: [
                            {
                                test: /\.js$/,
                                exclude: /node_modules/,
                                loader: 'babel-loader',
                            },
                        ],
                    },
                },
                webpack
            )
            .pipe(gulp.dest, taskConfig.dist)
            .pipe(browserSync.stream, { match: '**/*.js' }))(),
    production: (() =>
        lazypipe()
            .pipe(named)
            .pipe(
                webpackStream,
                {
                    module: {
                        rules: [
                            {
                                test: /\.js$/,
                                exclude: /node_modules/,
                                loader: 'babel-loader',
                            },
                        ],
                    },
                    plugins: [
                        new webpack.LoaderOptionsPlugin({
                            minimize: true,
                            debug: false,
                        }),
                        new webpack.optimize.UglifyJsPlugin({
                            beautify: false,
                            mangle: {
                                screw_ie8: true,
                                keep_fnames: true,
                            },
                            compress: {
                                screw_ie8: true,
                            },
                            comments: false,
                        }),
                    ],
                },
                webpack
            )
            .pipe(rev)
            .pipe(gulp.dest, taskConfig.dist)
            .pipe(rev.manifest, config.pkg.manifest.file, {
                base: config.pkg.manifest.path,
                merge: true,
            })
            .pipe(gulp.dest, config.pkg.manifest.path))(),
};

gulp.task('scripts', ['scripts:lint'], () =>
    gulp
        .src(taskConfig.src)
        .pipe(tasks[config.productionMode ? 'production' : 'development']())
);
