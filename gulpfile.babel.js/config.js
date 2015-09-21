import path from 'path';
import yargs from 'yargs';
import pngquant from 'imagemin-pngquant';
import errorHandler from './lib/errorHandler';

const paths = {
    url: 'http://frontend.dev',
    src: './src',
    dist: './dist/public_html/assets',
    webroot: './dist/public_html',
    vendor: './src/vendor'
};

const config = {
    mode: yargs.argv.production ? 'production' : 'development',

    paths: paths,

    output: {
        size: {
            gzip: true,
            showFiles: true
        }
    },

    browserSync: {
        open: 'external',
        xip: true,

        // Uncomment the following line to test static files without a local server
        server: { baseDir: paths.webroot }
        // ----- OR -----
        // Uncomment the following line when running a local server
        // proxy: paths.url
    },

    plumber: {
        errorHandler: errorHandler
    },

    tasks: {
        styles: {
            src: path.join(paths.src, 'sass'),
            dist: path.join(paths.dist, 'styles'),
            extensions: ['css', 'scss', 'sass'],
            dependencies: [],
            autoprefixer: {
                browsers: [
                    'last 2 versions',
                    '> 1%',
                    'ie >= 8',
                    'android >= 4'
                ]
            }
        },

        scripts: {
            src: path.join(paths.src, 'js'),
            dist: path.join(paths.dist, 'scripts'),
            extensions: ['js', 'js'],
            entries: {
                main: {
                    filename: 'main.js',
                    src: path.join(paths.src, 'js/main'),
                    dependencies: [
                        path.join(paths.vendor, 'respimage/respimage.js')
                    ]
                },
                header: {
                    src: path.join(paths.src, 'js/header'),
                    filename: 'header.js',
                    dependencies: []
                },
                ie8: {
                    src: path.join(paths.src, 'js/ie8'),
                    filename: 'ie8.js',
                    dependencies: [
                        path.join(paths.vendor, 'respondJs/src/respond.js')
                    ]
                }
            }
        },

        jquery: {
            dist: path.join(paths.dist, 'scripts'),
            extensions: ['js'],
            flags: [
                '-deprecated',
                '-core/ready',
                '-css',
                '-effects',
                '-event-alias'
            ]
        },

        templates: {
            src: path.join(paths.src, 'templates'),
            dist: paths.webroot,
            extensions: ['html', 'php', 'twig'],
            dataFile: 'data/global.json',
            excludeFolders: []
        },

        images: {
            src: path.join(paths.src, 'images'),
            dist: path.join(paths.dist, 'images'),
            extensions: ['jpg', 'png', 'svg', 'gif'],
            optimization: {
                progressive: true,
                interlaced: true,
                multipass: true,
                use: [
                    pngquant({ quality: '65-80' })
                ]
            }
        },

        fonts: {
            src: path.join(paths.src, 'fonts'),
            dist: path.join(paths.dist, 'fonts'),
            extensions: ['woff2', 'woff', 'eot', 'ttf', 'svg']
        },

        sprites: {
            src: path.join(paths.src, 'sprites'),
            dist: path.join(paths.dist, 'images'),
            extensions: ['svg']
        }
    }
};
export default config;
