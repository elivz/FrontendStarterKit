import config from '../config';

import browserSync from 'browser-sync';
import cached from 'gulp-cached';
import gulpif from 'gulp-if';
import fs from 'fs';
import gulp from 'gulp';
import modify from 'gulp-modify';
import path from 'path';


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
                Object.keys(manifest).forEach((originalFile) => {
                    const newFile = manifest[originalFile];
                    contents = contents.replace(originalFile, newFile);
                });
                return contents;
            },
        })))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('templates-watch', ['templates'], () => {
    return browserSync.reload();
});
