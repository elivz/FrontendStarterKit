var gulp = require('gulp'),
    changed = require('gulp-changed'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    spritesmith = require("gulp.spritesmith"),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');

// Compile Our Sass
gulp.task('styles', function() {
    return gulp.src('assets/css/src/*.scss')
        .pipe(sass({
            sourcemap: true,
            style: 'compact',
            require: 'susy' ,
            precision: 7
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest('assets/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(csso())
        .pipe(gulp.dest('assets/css'));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('assets/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('assets/js/src/**/*.js')
        .pipe(concat('site.js'))
        .pipe(gulp.dest('assets/js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('assets/js'));
});

// Sprites
gulp.task('sprites', function() {
    var spriteData = gulp.src('assets/images/sprites/*.png').pipe(spritesmith({
            imgName: 'sprites.png',
            cssName: '_sprites.scss',
            imgPath: '../images/sprites.png',
            algorithm: 'binary-tree',
            padding: 10
        }));
        spriteData.img.pipe(gulp.dest('assets/images/src/'));
        spriteData.css.pipe(gulp.dest('assets/css/src/utilities/'));
});

// Images
gulp.task('images', function() {
    return gulp.src('assets/images/src/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('assets/images'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    var server = livereload();
    gulp.watch('assets/js/src/**/*.js', ['lint', 'scripts']).on('change', function(file) {
        server.changed(file.path);
    });
    gulp.watch('assets/css/src/**/*.scss', ['styles']).on('change', function(file) {
        server.changed(file.path);
    });
    gulp.watch(['assets/images/src/**/*', 'assets/images/sprites/**/*'], ['images']).on('change', function(file) {
        server.changed(file.path);
    });
});

// Default Task
gulp.task('default', ['lint', 'styles', 'scripts', 'sprites', 'images']);