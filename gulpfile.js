'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
        pattern: 'gulp{-,.}*',
        replaceString: /gulp(\-|\.)/
    });
var del = require('del');
var pagespeed = require('psi');
var reload = require('gulp-livereload');
var pngquant = require('imagemin-pngquant');

// File paths
var srcPath  = 'assets/src/',
    distPath = 'assets/dist/';

// Compile Sass
gulp.task('styles', function() {
    return gulp.src(srcPath+'css/*.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            errLogToConsole: true
        }))
        .pipe($.sourcemaps.write())
        .pipe($.autoprefixer({ browsers: ['last 2 versions', "> 1%", "ie 8", "ie 9"] }))
        .pipe(gulp.dest(distPath+'css'))
        .pipe($.csso())
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(distPath+'css'))
        .pipe($.livereload({auto: false}))
        .pipe($.size({title: 'styles'}));
});

// Compile CoffeeScript down to JS
gulp.task('coffee', function() {
    return gulp.src(srcPath+'coffee/**/*.coffee')
        .pipe(gulp.dest(srcPath+'js/'))
});

// Concatenate & Minify JS
gulp.task('scripts', ['coffee'], function() {
    // Compile main site scripts
    gulp.src([
            srcPath+'components/fitvids/jquery.fitvids.js',
            srcPath+'js/*/*',
            srcPath+'js/*',
            '!'+srcPath+'js/compatibility{,/**}'
        ])
        .pipe($.sourcemaps.init())
        .pipe($.concat('scripts.js'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(distPath+'js'))
        .pipe($.uglify())
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(distPath+'js'))
        .pipe($.livereload({auto: false}))
        .pipe($.size({title: 'scripts'}));

    // Compile compatibility scripts that should load in the head
    gulp.src([
            srcPath+'js/compatibility/*',
            srcPath+'components/picturefill/src/picturefill.js'
        ])
        .pipe($.concat('compatibility.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(distPath+'js'))
        .pipe($.livereload({auto: false}));

    // Compile IE8 compatibility scripts that should load in the head
    gulp.src([
            srcPath+'components/selectivizr/selectivizr.js',
            srcPath+'components/respondJs/src/respond.js'
        ])
        .pipe($.concat('compatibility-ie8.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(distPath+'js'))
        .pipe($.livereload({auto: false}));

    // Copy jQuery to the dist path
    gulp.src(srcPath+'components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest(distPath+'js'));
});

// Generate a custom Modernizr build
gulp.task('modernizr', ['styles', 'scripts'], function() {
    gulp.src([
            distPath+'js/scripts.js',
            distPath+'css/site.css'
        ])
        .pipe($.modernizr('modernizr.min.js', {
            "options" : [
                "setClasses",
                "addTest",
                "html5printshiv",
                "testProp",
                "fnBind",
                "prefixed",
                "testMediaQuery"
            ],
            excludeTests: [
                'hidden'
            ]
        }))
        .pipe(gulp.dest(srcPath+'js/compatibility'));
});

// Generate Sprites
gulp.task('sprites', function(cb) {
    // SVG Sprites
    gulp.src(srcPath+'sprites/*.svg')
        .pipe($.svgmin())
        .pipe($.svgSprites({
            svg: {
                sprite: srcPath+'images/svg-sprites.svg'
            },
            cssFile: srcPath+'css/generated/_svg_sprites.scss',
            svgPath: '../images/svg-sprites.svg',
            pngPath: '../images/svg-sprites.png',
            common: 'svg',
            padding: 10,
            baseSize: 16,
            preview: false
        }))
        .pipe(gulp.dest('')) // Write the sprite-sheet + CSS + Preview
        .pipe($.filter('**/*.svg'))  // Filter out everything except the SVG file
        .pipe(gulp.dest(''));

    // PNG Sprites
    var spriteData = gulp.src(srcPath+'sprites/*.png')
        .pipe($.spritesmith({
            imgName: 'sprites.png',
            cssName: '_sprites.scss',
            cssFormat: 'scss',
            imgPath: '../images/sprites.png',
            algorithm: 'binary-tree',
            padding: 10,
            cssVarMap: function (sprite) {
                sprite.name = 'sprite-' + sprite.name;
            },
            cssOpts: {
                cssClass: function (item) {
                    return '.sprite-' + item.name;
                }
            }
        }));

    spriteData.css.pipe(gulp.dest(srcPath+'css/generated'));
    return spriteData.img.pipe(gulp.dest(srcPath+'images'));
});

// Optimize Images
gulp.task('images', ['sprites'], function () {
    return gulp.src(srcPath+'images/**/*')
        .pipe($.imagemin({
            progressive: true,
            interlaced: true,
            use: [pngquant({ quality: '65-80' })]
        }))
        .pipe(gulp.dest(distPath+'images'))
        .pipe($.livereload({auto: false}))
        .pipe($.size({title: 'images'}));
});

// Optimize SVGs & generate fallback PNGs
gulp.task('svg', ['sprites'], function() {
    return gulp.src(srcPath+'images/*.svg')
        .pipe($.svgmin())
        .pipe(gulp.dest(distPath+'images'))
        .pipe($.svg2png())
        .pipe(pngquant({ quality: '65-80' }))
        .pipe(gulp.dest(distPath+'images'));
});

// Watch Files For Changes & Reload
gulp.task('watch', function () {
    $.livereload.listen();

    // gulp.watch(['**/*.php'], reload);
    gulp.watch([srcPath+'css/**/*.scss'], ['styles']);
    gulp.watch([srcPath+'coffee/**/*.coffee'], ['coffee']);
    gulp.watch([srcPath+'js/**/*.js'], ['scripts']);
    gulp.watch([srcPath+'sprites/**/*'], ['sprites']);
    gulp.watch([srcPath+'images/**/*.png'], ['images']);
    gulp.watch([srcPath+'images/**/*.jpg'], ['images']);
    gulp.watch([srcPath+'images/**/*.svg'], ['svg']);
});

// Clean distribution directories
gulp.task('clean', function(cb) {
    del([
        distPath+'css',
        distPath+'js',
        distPath+'images'
    ], cb);
});

// Default Task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images', 'svg');
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', function(cb) {
    pagespeed({
        key: 'AIzaSyAA9firvfB61E4-8jdVfY6MfZQz_8ndfhU',
        url: 'http://xyz.com',
        strategy: 'mobile'
    }, cb);
});