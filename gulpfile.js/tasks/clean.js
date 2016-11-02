"use strict";

const del = require('del');
const gulp = require('gulp');
const path = require('path');

const config = require('../config');

gulp.task('clean', (cb) => {
    const files = [path.join(config.paths.src, 'rev-manifest.json')];

    for (const key of Object.keys(config.tasks)) {
        const task = config.tasks[key];
        if (typeof task.dist !== 'undefined' && typeof task.extensions !== 'undefined' && !task.noclean) {
            const filePattern = path.join(task.dist, `**/*.{${task.extensions.join(',')},map}`);
            files.push(filePattern);
        }
    }

    del(files).then(() => {
        cb();
    });
});
