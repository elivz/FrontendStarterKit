'use strict';

const browserSync = require('browser-sync');
const cached = require('gulp-cached');
const gulpif = require('gulp-if');
const fs = require('fs');
const gulp = require('gulp');
const modify = require('gulp-modify');
const config = require('../lib/config');

const taskConfig = config.pkg.tasks.templates;

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Copy web html to dist
gulp.task('templates-build', () => {
    let manifest = {};
    try {
        manifest = JSON.parse(
            fs.readFileSync(config.pkg.manifest.file, 'utf8')
        );
    } catch (e) {}

    return gulp
        .src(taskConfig.src)
        .pipe(cached('templates'))
        .pipe(
            gulpif(
                config.mode === 'production',
                modify({
                    fileModifier: (file, contents) => {
                        let template = contents;
                        Object.keys(manifest).forEach(originalFile => {
                            const regexp = new RegExp(
                                escapeRegExp(originalFile),
                                'g'
                            );
                            const newFile = manifest[originalFile];
                            template = template.replace(regexp, newFile);
                        });
                        return template;
                    },
                })
            )
        )
        .pipe(gulp.dest(taskConfig.dist));
});

gulp.task('templates', ['templates-build'], cb => {
    browserSync.reload();
    cb();
});
