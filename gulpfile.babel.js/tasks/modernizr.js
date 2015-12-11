import config from '../config';

import fs from 'fs';
import gulp from 'gulp';
import modernizr from 'modernizr';
import path from 'path';

gulp.task('modernizr', (cb) => {
    const dist = path.join(config.tasks.scripts.src, 'plugins/modernizr.js');
    modernizr.build(config.tasks.modernizr.config, (code) => {
        fs.writeFile(config.tasks.modernizr.dist, code, cb);
    });
});
