import config from '../config';

import fs from 'fs';
import gulp from 'gulp';
import modernizr from 'modernizr';

gulp.task('modernizr', (cb) => {
    modernizr.build(config.tasks.modernizr.config, (code) => {
        fs.writeFile(config.tasks.modernizr.dist, code, cb);
    });
});
