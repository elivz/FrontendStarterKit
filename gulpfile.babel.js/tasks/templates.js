import config from '../config';

import browserSync from 'browser-sync';
import cached from 'gulp-cached';
import fs from 'fs';
import gulp from 'gulp';
import lazypipe from 'lazypipe';
import modify from 'gulp-modify';
import path from 'path';


const paths = {
    src: path.join(config.tasks.templates.src, '/*.{' + config.tasks.templates.extensions + '}'),
    dist: config.tasks.templates.dist,
    manifest: path.join(config.paths.src, 'rev-manifest.json')
};

const tasks = {
    development: () => {
        return lazypipe()
            .pipe(cached, 'templates')
            .pipe(gulp.dest, paths.dist);
    }(),
    production: () => {
        const manifest = JSON.parse(fs.readFileSync(paths.manifest, 'utf8'));

        return lazypipe()
            .pipe(modify, { fileModifier: (file, contents) => {
                for (let originalFile in manifest) {
                    const newFile = manifest[originalFile];
                    contents = contents.replace(originalFile, newFile);
                }
                return contents;
            }})
            .pipe(gulp.dest, paths.dist);
    }()
};

// Copy web html to dist
gulp.task('templates', () => {
    gulp.src(paths.src).pipe(tasks[config.mode]());
});

gulp.task('templates-watch', ['templates'], () => {
    return browserSync.reload();
});
