'use strict';

// File paths
var webroot  = 'public/';
var srcPath  = webroot+'assets/src/';
var distPath = webroot+'assets/dist/';

// Uncomment to test static files without a local server
// var browserSyncConfig = { server: { baseDir: './'+webroot, open: 'external', xip: true } };
// Uncomment when running a local server, and enter the test domain
var browserSyncConfig = { proxy: 'http://frontend.dev', open: 'external', xip: true };

// Options for AutoPrefixer
var autoprefixerOpts = ['last 2 versions', "> 1%", "ie 8", "ie 9"];

// Additional CSS files to include (outside of the src/css folder)
var cssComponents = [
];

// Additional Javascript files to include (outside of the src/js folder)
var jsComponents = [
    srcPath+'components/fitvids/jquery.fitvids.js'
];

// Additional Javascript files to load in the head
// (outside of the src/js/compatibility folder)
var jsCompatibilityComponents = [
    srcPath+'components/respondJs/src/respond.js',
    srcPath+'components/fitvids/jquery.fitvids.js'
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
            srcPath+'css/*.scss'
        ]))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 4,
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe($.autoprefixer({ browsers: autoprefixerOpts }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(distPath+'css'))
        .pipe(reload({stream: true}))
        .pipe($.csso())
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(distPath+'css'))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }));
});

// Copy Web Fonts To Dist
gulp.task('fonts', function () {
    return gulp.src(srcPath+'fonts/*')
        .pipe(gulp.dest(distPath+'fonts'))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }));
});

// Compile CoffeeScript down to JS
gulp.task('coffee', function() {
    return gulp.src(srcPath+'coffee/**/*.coffee')
        .pipe(gulp.dest(srcPath+'js/'))
});

// Concatenate & Minify JS
gulp.task('scripts', ['coffee'], function() {
    // Compile main site scripts
    gulp.src(jsComponents.concat([
            srcPath+'js/*/*',
            srcPath+'js/*',
            '!'+srcPath+'js/compatibility{,/**}'
        ]))
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.concat('scripts.js'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(distPath+'js'))
        .pipe(reload({stream: true}))
        .pipe($.uglify())
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(distPath+'js'))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }));

    // Compile compatibility scripts that should load in the head
    gulp.src(jsCompatibilityComponents.concat([
            srcPath+'js/compatibility/*',
        ]))
        .pipe($.concat('compatibility.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(distPath+'js'));

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

// Buld SVG Sprites
gulp.task('svgSprites', function(cb) {
    return gulp.src(srcPath+'sprites/*.svg')
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
});

// Optimize SVGs & generate fallback PNGs
gulp.task('svg', ['svgSprites'], function() {
    return gulp.src(srcPath+'images/*.svg')
        .pipe($.svgmin())
        .pipe(gulp.dest(distPath+'images'))
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
        .pipe(reload({stream: true}))
        .pipe(gulp.dest(distPath+'images'));
});

// Build PNG Sprites
gulp.task('pngSprites', function(cb) {
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
gulp.task('images', ['pngSprites'], function () {
    return gulp.src(srcPath+'images/**/*.{jpg,jpeg,png,gif}')
        .pipe($.imagemin({
            progressive: true,
            interlaced: true,
            use: [pngquant({ quality: pngQuality })]
        }))
        .pipe(gulp.dest(distPath+'images'))
        .pipe(reload({stream: true}))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }));
});

// Watch Files For Changes & Reload
gulp.task('watch', function () {
    browserSync(browserSyncConfig);

    gulp.watch([webroot+'/**/*.html'], reload);
    gulp.watch([srcPath+'css/**/*.scss'], ['styles']);
    gulp.watch([srcPath+'coffee/**/*.coffee'], ['coffee']);
    gulp.watch([srcPath+'js/**/*.js'], ['scripts']);
    gulp.watch([srcPath+'sprites/**/*.svg'], ['svgSprites']);
    gulp.watch([srcPath+'sprites/**/*.png'], ['pngSprites']);
    gulp.watch([srcPath+'images/**/*.{jpg,jpeg,png,gif}'], ['images']);
    gulp.watch([srcPath+'images/**/*.svg'], ['svg']);
});

// Clean distribution directories
gulp.task('clean', del.bind(null, [distPath], {dot: true}));

// Default Task
gulp.task('default', ['clean'], function() {
    gulp.start(
        'styles',
        'scripts',
        'fonts',
        'svg',
        'images'
    );
});