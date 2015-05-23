/**
 *
 * Frontend Starter Kit
 * Copyright 2015 Eli Van Zoeren
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

'use strict';

/************************************************
 * CONFIGURATION
 ************************************************/

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
// var browserSyncConfig = {
//     server: {
//         baseDir: './'+basePath,
//         open: 'external',
//         xip: true
//     }
// };
// ----- OR -----
// Uncomment when running a local server, and enter the test domain
var browserSyncConfig = {
    proxy: baseUrl,
    open: 'external',
    xip: true
};

// Options for AutoPrefixer
var autoprefixerOpts = [
    'last 2 versions',
    '> 1%',
    'ie >= 8',
    'android >= 4'
];

// Additional CSS files to include (outside of the src/css folder)
var cssComponents = [
];

// Additional Javascript files to include (outside of the src/js folder)
var jsComponents = [
];

// Additional Javascript files to load in the head
// (outside of the src/js/compatibility folder)
var jsHeaderComponents = [
    vendorPath+'svg4everybody/svg4everybody.ie8.js',
    vendorPath+'picturefill/dist/picturefill.js'
];

// Javascript that is only needed for IE8 and below
var jsIE8Components = [
    vendorPath+'htmlshiv/dist/html5shiv.js',
    vendorPath+'respondJs/dest/respond.src.js'
];

// Acceptible range of quality for PNG compressions
var pngQuality = '65-80';

//***********************************************
// SET UP GULP
//***********************************************

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

// Error handler for Plumber
var handleError = function(error) {
    $.notify.onError({
        title: "Gulp Error",
        message: "<%= error.message %>",
        sound: "Beep"
    })(error);

    this.emit('end');
};

//***********************************************
// STYLES
//***********************************************

// Compile Sass
gulp.task('styles', function() {
    return gulp.src(cssComponents.concat([
            src.styles+'*.scss'
        ]))
        .pipe($.plumber({ errorHandler: handleError }))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 4
        }))
        .pipe($.autoprefixer({ browsers: autoprefixerOpts }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(dist.styles))
        .pipe($.filter(['*.css']))
        .pipe(reload({stream: true}))
        .pipe($.csso())
        .pipe($.rename({suffix: '.min'}))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(dist.styles))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }));
});

//***********************************************
// JAVASCRIPT
//***********************************************

// Concatenate & Minify JS
gulp.task('scripts', [
    'scripts:lint',
    'scripts:compile'
]);

// Lint our Javascript
gulp.task('scripts:lint', function() {
    return gulp.src([
            src.scripts+'*/**/*.js',
            '!'+src.scripts+'header{,/**}'
        ])
        .pipe($.cached('esLint'))
        .pipe($.eslint())
        .pipe($.eslint.format());
});

gulp.task('scripts:compile', function() {
    // Compile main site scripts
    return gulp.src(jsComponents.concat([
            src.scripts+'*/**/*.js',
            src.scripts+'*.js',
            '!'+src.scripts+'header{,/**}'
        ]))
        .pipe($.plumber({ errorHandler: handleError }))
        .pipe($.sourcemaps.init())
        .pipe($.concat('scripts.js'))
        .pipe($.babel())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(dist.scripts))
        .pipe($.filter(['*.js']))
        .pipe($.uglify())
        .pipe($.rename({suffix: '.min'}))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(dist.scripts))
        .pipe(reload({stream: true}))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }));
});

// Compile IE8 compatibility scripts that should load in the head
gulp.task('scripts:ie8', function() {
    return gulp.src(jsIE8Components)
        .pipe($.sourcemaps.init())
        .pipe($.concat('ie8.min.js'))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(dist.scripts));
});

// Compile general-purpose compatibility scripts that should load in the head
gulp.task('scripts:compatibility', function() {
    return gulp.src([
            src.scripts+'header/*',
        ].concat(jsHeaderComponents))
        .pipe($.sourcemaps.init())
        .pipe($.concat('compatibility.min.js'))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(dist.scripts))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }));
});

// Get the most recent 1.x version of jQuery
gulp.task('scripts:jquery', function () {
    $.jquery.src({ release: 1 })
        .pipe($.uglify())
        .pipe($.rename('jquery.min.js'))
        .pipe(gulp.dest(dist.scripts));
});

//***********************************************
// WEBFONTS
//***********************************************

// Copy Web Fonts To Dist
gulp.task('fonts', function () {
    return gulp.src(src.fonts)
        .pipe(gulp.dest(dist.fonts))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }));
});

//***********************************************
// IMAGES
//***********************************************

gulp.task('images', [
    'images:sprites',
    'images:svg',
    'images:raster'
]);

var imageminOpts = {
    progressive: true,
    interlaced: true,
    use: [
        pngquant({ quality: pngQuality })
    ]
};

// Optimize Images
gulp.task('images:raster', function () {
    return gulp.src(src.images+'**/*.{jpg,jpeg,png,gif}')
        .pipe($.plumber({ errorHandler: handleError }))
        .pipe($.cached('images'))
        .pipe($.imagemin(imageminOpts))
        .pipe(gulp.dest(dist.images))
        .pipe(reload({stream: true}))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }));
});

// Optimize SVGs & generate fallback PNGs
gulp.task('images:svg', function() {
    return gulp.src(src.images+'**/*.svg')
        .pipe($.plumber({ errorHandler: handleError }))
        .pipe($.cached('svgs'))
        .pipe($.svgmin())
        .pipe(gulp.dest(dist.images))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }))
        .pipe($.svg2png())
        .pipe($.imagemin(imageminOpts))
        .pipe(gulp.dest(dist.images))
        .pipe(reload({stream: true}));
});

// Buld SVG Sprites
gulp.task('images:sprites', function() {
    return gulp.src(src.sprites+'*.svg')
        .pipe($.plumber({ errorHandler: handleError }))
        .pipe($.svgmin())
        .pipe($.svgSprite({
            mode: {
                css: {
                    dest: "./",
                    layout: "vertical",
                    sprite: "sprites.svg",
                    bust: false,
                    render: {
                        scss: {
                            dest: "../../src/sass/generated/_sprites.scss",
                            template: srcPath+"build/sprites-template.scss"
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest(dist.sprites))
        .pipe($.filter(['*.svg']))
        .pipe($.svg2png())
        .pipe($.imagemin(imageminOpts))
        .pipe(gulp.dest(dist.sprites))
});

//***********************************************
// WATCH FOR CHANGES
//***********************************************

// Watch Files For Changes & Reload
gulp.task('watch', function () {
    browserSync(browserSyncConfig);

    gulp.watch([basePath+'/**/*.html'], reload);
    gulp.watch([src.styles+'**/*.scss'], ['styles']);
    gulp.watch([src.scripts+'**/*.js'], ['scripts']);
    gulp.watch([src.fonts+'*'], ['fonts']);
    gulp.watch([src.sprites+'**/*.svg'], ['images:svgs:sprites']);
    gulp.watch([src.images+'**/*.svg'], ['svgs']);
    gulp.watch([src.sprites+'**/*.png'], ['images:sprites']);
    gulp.watch([src.images+'**/*.{jpg,jpeg,png,gif}'], ['images:copy']);
});

// Clean distribution directories
gulp.task('clean', del.bind(null, [distPath], {dot: true}));

// Default Task
gulp.task('default', ['clean'], function() {
    gulp.start(
        'styles',
        'scripts',
        'scripts:ie8',
        'scripts:compatibility',
        'scripts:jquery',
        'fonts',
        'images'
    );
});
