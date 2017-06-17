const path = require('path');

module.exports = {
    static: true,
    images: true,
    svgSprite: false,
    fonts: true,

    clean: {
        patterns: [
            path.resolve(process.env.PWD, 'dist/public_html'),
            path.resolve(process.env.PWD, 'dist/cms/templates'),
        ],
    },

    html: {
        extensions: ['html', 'php', 'twig', 'json', 'svg'],
        htmlmin: {
            collapseWhitespace: true,
        },
        alternateTask: require('./tasks/html'),
    },

    stylesheets: {
        sass: {
            includePaths: ['./node_modules'],
        },
        extensions: ['sass', 'scss', 'css'],
        alternateTask: require('./tasks/stylesheets'),
    },

    javascripts: {
        entry: {
            initial: ['./initial.js'],
            main: ['./main.js'],
        },
        publicPath: '/assets/scripts',
    },

    browserSync: {
        proxy: 'http://localhost:8080',
        open: 'external',
        xip: true,
    },

    production: {
        rev: true,
    },

    additionalTasks: {
        initialize(gulp, PATH_CONFIG, TASK_CONFIG) {
            gulp.task('lint-js', require('./tasks/lint.js'));
        },
        development: {
            prebuild: [
                'lint-js',
            ],
        },
    },
};