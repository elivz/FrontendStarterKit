var gulp = require('gulp');
var changed = require('gulp-changed');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('assets/js/src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('styles', function() {
    return gulp.src('assets/sass/*.scss')
        .pipe(sass({ style:'expanded' }))
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(gulp.dest('assets/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(['assets/js/*.js'])
        .pipe(changed('assets/js'))
        .pipe(concat('site.js'))
        .pipe(gulp.dest('assets/js'))
        .pipe(rename('site.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    var server = livereload();
    gulp.watch('assets/js/src/**/*.js', ['lint', 'scripts']).on('change', function(file) {
        server.changed(file.path);
    });
    gulp.watch('assets/sass/**/*.scss', ['styles']).on('change', function(file) {
        server.changed(file.path);
    });
});

// Default Task
gulp.task('default', ['lint', 'styles', 'scripts', 'watch']);