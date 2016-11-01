import path from 'path';
import yargs from 'yargs';
import imagemin from 'gulp-imagemin';
import errorHandler from './lib/errorHandler';

const paths = {
    url: 'http://localhost:8080',
    src: './src',
    dist: './dist/public_html/assets',
    webroot: './dist/public_html',
};

const svgoConfig = [
    { removeDimensions: true },
    { convertPathData: { floatPrecision: 1 } },
    { cleanupNumericValues: { floatPrecision: 1 } },
    { sortAttrs: true },
    { cleanupIDs: false },
];

export default {
    mode: yargs.argv.production ? 'production' : 'development',

    paths,

    output: {
        size: {
            gzip: true,
            showFiles: true,
        },
    },

    browserSync: {
        open: 'external',
        xip: true,

        // Uncomment the following line to test static files without a local server
        server: { baseDir: paths.webroot },
        // ----- OR -----
        // Uncomment the following line when running a local server
        // proxy: paths.url,
    },

    plumber: {
        errorHandler,
    },

    tasks: {
        styles: {
            src: path.join(paths.src, 'sass'),
            dist: path.join(paths.dist, 'styles'),
            extensions: ['css', 'scss', 'sass'],
            dependencies: [],
        },

        scripts: {
            src: path.join(paths.src, 'js'),
            dist: path.join(paths.dist, 'scripts'),
            files: ['main.js', 'compatibility.js'],
            extensions: ['js', null],
        },

        templates: {
            src: path.join(paths.src, 'templates'),
            dist: paths.webroot,
            extensions: ['html', 'php', 'twig'],
        },

        images: {
            src: path.join(paths.src, 'images'),
            dist: path.join(paths.dist, 'images'),
            extensions: ['svg', 'png', 'jpg', 'jpeg', 'gif'],
            optimization: [
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.gifsicle({ interlaced: true }),
                imagemin.svgo({ plugins: svgoConfig }),
            ],
        },

        fonts: {
            src: path.join(paths.src, 'fonts'),
            dist: path.join(paths.dist, 'fonts'),
            extensions: ['woff2', 'woff', 'eot', 'ttf', 'svg'],
        },

        sprites: {
            src: path.join(paths.src, 'sprites'),
            dist: path.join(paths.dist, 'images'),
            extensions: ['svg', null],
            svgoConfig,
        },

        rootfiles: {
            src: path.join(paths.src, 'rootfiles'),
            dist: paths.webroot,
            extensions: ['*', null],
            noclean: true,
        },
    },
};
