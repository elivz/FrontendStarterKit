"use strict";

const browserSync = require('browser-sync');
const cached = require('gulp-cached');
const gulpif = require('gulp-if');
const fs = require('fs');
const gulp = require('gulp');
const modify = require('gulp-modify');
const path = require('path');

const config = require('../config');

const paths = {
    src: path.join(config.tasks.templates.src, `/**/*.{${config.tasks.templates.extensions}}`),
    dist: config.tasks.templates.dist,
    manifest: path.join(config.paths.src, 'rev-manifest.json'),
};

// Copy web html to dist
gulp.task('templates', () => {
    let manifest = {};
    try {
        manifest = JSON.parse(fs.readFileSync(paths.manifest, 'utf8'));
    } catch (e) {}

    gulp.src(paths.src)
        .pipe(cached('templates'))
        .pipe(gulpif(config.mode === 'production', modify({
            fileModifier: (file, contents) => {
                let template = contents;
                Object.keys(manifest).forEach((originalFile) => {
                    const newFile = manifest[originalFile];
                    template = template.replace(originalFile, newFile);
                });
                return template;
            },
        })))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('templates-watch', ['templates'], browserSync.reload);
