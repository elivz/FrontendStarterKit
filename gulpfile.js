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

// File paths
var srcPath  = 'assets/src/',
    distPath = 'assets/dist/';

// Compile Sass
gulp.task('styles', ['sprites', 'svg'], function() {
    return gulp.src(srcPath+'css/*.scss')
        .pipe($.sass({
            errLogToConsole: true
        }))
        .pipe($.autoprefixer('last 2 versions', "> 1%", "ie 8", "ie 9"))
        .pipe($.combineMediaQueries())
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
gulp.task('scripts', function() {
    gulp.src([
            srcPath+'components/parsleyjs/parsley.js',
            srcPath+'js/*/*',
            srcPath+'js/*'
        ])
        .pipe($.if(/\.coffee$/,
            $.coffee({bare: true}).on('error', function(err) {}))
        )
        .pipe($.concat('scripts.js'))
        .pipe(gulp.dest(distPath+'js'))
        .pipe($.uglify())
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(distPath+'js'))
        .pipe($.livereload({auto: false}))
        .pipe($.size({title: 'scripts'}));
});

// Build and minify standalone JS libraries
gulp.task('script-libs', ['scripts', 'styles'], function() {
    // Generate a custom Modernizr.js + RespondJS
    return gulp.src([
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
                "prefixed"
            ],
            excludeTests: [
                'hidden'
            ]
        }))
        .pipe($.addSrc([
            srcPath+'components/jquery/dist/jquery.min.js',
            srcPath+'components/respondJs/dest/respond.min.js'
        ]))
        // .pipe($.concat('compatibility.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(distPath+'js'));
});

// Generate Sprites
gulp.task('sprites', function() {
    // PNG Sprites
    var spriteData = gulp.src(srcPath+'sprites/*.png')
        .pipe($.spritesmith({
            imgName: 'sprites.png',
            cssName: '_sprites.scss',
            cssFormat: 'scss_maps',
            imgPath: '../images/sprites.png',
            algorithm: 'binary-tree',
            padding: 20,
            cssVarMap: function (sprite) {
                sprite.name = 'sprite-' + sprite.name;
            },
            cssOpts: {
                cssClass: function (item) {
                    return '.sprite-' + item.name;
                }
            }
        }));
    spriteData.img.pipe(gulp.dest(distPath+'images'));
    spriteData.css.pipe(gulp.dest(srcPath+'css/utilities'));

    // SVG Sprites
    return gulp.src(srcPath+'sprites/*.svg')
        .pipe($.svgmin())
        .pipe($.svgSprites({
            svg: {
                sprite: 'dist/images/svg-sprites.svg'
            },
            cssFile: 'src/css/utilities/_svg_sprites.scss',
            svgPath: '../images/svg-sprites.svg',
            pngPath: '../images/svg-sprites.png',
            common: 'svg',
            preview: false
        }))
        .pipe(gulp.dest('assets')) // Write the sprite-sheet + CSS + Preview
        .pipe($.filter('**/*.svg'))  // Filter out everything except the SVG file
        .pipe($.svg2png())           // Create a PNG
        .pipe(gulp.dest('assets'));
});

// Optimize Images
gulp.task('images', ['sprites'], function () {
    return gulp.src(srcPath+'images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(distPath+'images'))
        .pipe($.livereload({auto: false}))
        .pipe($.size({title: 'images'}));
});

// Optimize and combine SVGs & generate fallback PNGs
gulp.task('svg', function() {
    return gulp.src(srcPath+'images/*.svg')
        .pipe($.svgmin())
        .pipe(gulp.dest(distPath+'images'))
        .pipe($.svg2png())
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
    gulp.watch([srcPath+'images/**/*'], ['images']);
});

// Clean distribution directories
gulp.task('clean', del.bind(null, distPath));

// Default Task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'script-libs', 'images', 'svg');
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