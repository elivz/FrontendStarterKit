module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                options: {
                    compass: true,
                    require: 'susy'
                },
                files: {
                    'css/production.css': 'sass/styles.scss'
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 3 version', 'ie 8', 'ie 9']
            },
            dist: {
                files: {
                    'css/production.css': 'css/production.css'
                }
            }
        },

        csso: {
            dist: {
                files: {
                    'css/production.min.css': ['css/production.css']
                }
            }
        },

        concat: {
            main: {
                src: [
                    'js/src/vendor/*.js',
                    'js/src/plugins/*.js',
                    'js/src/site.js'
                ],
                dest: 'js/production.js',
            }
        },

        uglify: {
            dist: {
                files: {
                    'js/production.min.js': ['js/production.js']
                }
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'images/'
                }]
            }
        },

        watch: {
            css: {
                files: ['sass/**/*.scss'],
                tasks: ['sass', 'autoprefixer', 'csso'],
                options: {
                    spawn: false,
                }
            },
            scripts: {
                files: ['js/src/**/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            },
            livereload: {
                // Here we watch the files the sass task will compile to
                options: { livereload: true },
                files: ['css/*.css', 'js/*.js'],
            },
        }
    });

    // Load tasks
    require('load-grunt-tasks')(grunt);

    // Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['sass', 'autoprefixer', 'csso', 'concat', 'uglify', 'imagemin']);

};