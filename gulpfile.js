'use strict';

var baseUrl = 'http://frontend.dev';

// File paths
var basePath   = 'public/';
var srcPath    = basePath+'assets/src/';
var distPath   = basePath+'assets/dist/';
var vendorPath = srcPath+'vendor/';

var src = {
    fonts:   srcPath+'fonts/',
    images:  srcPath+'images/',
    scripts: srcPath+'js/',
    sprites: srcPath+'sprites/',
    styles:  srcPath+'sass/'
};
var dist = {
    fonts:   distPath+'fonts/',
    images:  distPath+'images/',
    scripts: distPath+'js/',
    sprites: distPath+'images/',
    styles:  distPath+'css/'
};

// Uncomment to test static files without a local server
// var browserSyncConfig = { server: { baseDir: './'+basePath, open: 'external', xip: true } };
// ----- OR -----
// Uncomment when running a local server, and enter the test domain
var browserSyncConfig = { proxy: baseUrl, open: 'external', xip: true };

// Options for AutoPrefixer
var autoprefixerOpts = ['last 2 versions', "> 1%", "ie 8", "ie 9"];

// Additional CSS files to include (outside of the src/css folder)
var cssComponents = [
];

// Additional Javascript files to include (outside of the src/js folder)
var jsComponents = [
];

// Additional Javascript files to load in the head
// (outside of the src/js/compatibility folder)
var jsCompatibilityComponents = [
    vendorPath+'respondJs/src/respond.js',
    vendorPath+'picturefill/src/picturefill.js'
];

// Acceptible range of quality for PNG compressions
var pngQuality = '65-80';

// ----------------------------------------------------------------------------

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
        pattern: 'gulp{-,.}*',
        replaceString: /gulp(\-|\.)/
    });
var del = require('del');
var pngquant = require('imagemin-pngquant');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Compile Sass
gulp.task('styles', function() {
    return gulp.src(cssComponents.concat([
            src.styles+'*.scss'
        ]))
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            errLogToConsole: true,
            precision: 4
        }))
        .pipe($.autoprefixer({ browsers: autoprefixerOpts }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(dist.styles))
        .pipe(reload({stream: true}))
        .pipe($.csso())
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(dist.styles))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    // Compile main site scripts
    return gulp.src(jsComponents.concat([
            src.scripts+'*/**/*.js',
            src.scripts+'*.js',
            '!'+src.scripts+'compatibility{,/**}'
        ]))
        .pipe($.plumber())
        .pipe($.babel())
        .pipe($.sourcemaps.init())
        .pipe($.concat('scripts.js'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(dist.scripts))
        .pipe(reload({stream: true}))
        .pipe($.uglify())
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(dist.scripts))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }));
});

// Compile compatibility scripts that should load in the head
gulp.task('compatibilityScripts', function() {
    return gulp.src([
            src.scripts+'compatibility/*',
        ].concat(jsCompatibilityComponents))
        .pipe($.concat('compatibility.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(dist.scripts))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }));
});

// Get the most recent 1.x version of jQuery
gulp.task('jquery', function () {
    $.jquery.src({ release: 1 })
        .pipe($.uglify())
        .pipe($.rename('jquery.min.js'))
        .pipe(gulp.dest(dist.scripts));
});

// Generate a custom Modernizr build
gulp.task('modernizr', ['styles', 'scripts'], function() {
    gulp.src([
            dist.scripts+'scripts.js',
            dist.styles+'site.css'
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
        .pipe(gulp.dest(src.scripts+'compatibility'));
});

// Copy Web Fonts To Dist
gulp.task('fonts', function () {
    return gulp.src(src.fonts)
        .pipe(gulp.dest(dist.fonts))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }));
});

// Buld SVG Sprites
gulp.task('svgSprites', function(cb) {
    return gulp.src(srcPath+'sprites/*.svg')
        .pipe($.plumber())
        .pipe($.svgmin())
        .pipe($.svgSprite({
            mode: {
                css: {
                    dest: "./",
                    layout: "vertical",
                    sprite: "images/sprites.svg",
                    bust: false,
                    render: {
                        scss: {
                            dest: "sass/settings/_sprites.scss",
                            template: srcPath+"build/sprites-template.scss"
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest(srcPath));
});

// Optimize SVGs & generate fallback PNGs
gulp.task('svg', ['svgSprites'], function() {
    return gulp.src(src.images+'*.svg')
        .pipe($.svgmin())
        .pipe(gulp.dest(dist.images))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }))
        .pipe($.svg2png())
        .pipe($.imagemin({
            progressive: true,
            interlaced: true,
            use: [pngquant({ quality: pngQuality })]
        }))
        .pipe(gulp.dest(dist.images))
        .pipe(reload({stream: true}));
});

// Build PNG Sprites
gulp.task('pngSprites', function(cb) {
    var spriteData = gulp.src(src.sprites+'*.png')
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

    spriteData.css.pipe(gulp.dest(src.styles+'generated'));
    return spriteData.img.pipe(gulp.dest(src.images));
});

// Optimize Images
gulp.task('images', ['pngSprites'], function () {
    return gulp.src(src.images+'**/*.{jpg,jpeg,png,gif}')
        .pipe($.imagemin({
            progressive: true,
            interlaced: true,
            use: [pngquant({ quality: pngQuality })]
        }))
        .pipe(gulp.dest(dist.images))
        .pipe(reload({stream: true}))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }));
});

// Watch Files For Changes & Reload
gulp.task('watch', function () {
    browserSync(browserSyncConfig);

    gulp.watch([basePath+'/**/*.html'], reload);
    gulp.watch([src.styles+'**/*.scss'], ['styles']);
    gulp.watch([src.scripts+'**/*.js'], ['scripts']);
    gulp.watch([src.fonts+'*'], ['fonts']);
    gulp.watch([src.sprites+'**/*.svg'], ['svgSprites']);
    gulp.watch([src.sprites+'**/*.png'], ['pngSprites']);
    gulp.watch([src.images+'**/*.{jpg,jpeg,png,gif}'], ['images']);
    gulp.watch([src.images+'**/*.svg'], ['svg']);
});

// Clean distribution directories
gulp.task('clean', del.bind(null, [distPath], {dot: true}));

// Default Task
gulp.task('default', ['clean'], function() {
    gulp.start(
        'styles',
        'scripts',
        'compatibilityScripts',
        'jquery',
        'fonts',
        'svg',
        'images'
    );
});