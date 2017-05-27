module.exports = {
    static: true,
    images: true,
    svgSprite: false,
    fonts: true,

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
        production: {
            devtool: 'cheap-source-map',
        },
    },

    browserSync: {
        server: {
            // Update this to match your development URL
            proxy: 'localhost:8080',
            files: ['craft/templates/**/*'],
        },
    },

    production: {
        rev: true,
    },
};
