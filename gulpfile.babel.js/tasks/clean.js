import config from '../config';
import del from 'del';
import gulp from 'gulp';
import path from 'path';

gulp.task('clean', (cb) => {
    const files = [path.join(config.paths.src, 'rev-manifest.json')];

    for (const key of Object.keys(config.tasks)) {
        const task = config.tasks[key];
        const filePattern = path.join(task.dist, '**/*.{' + task.extensions.join(',') + ',map}');
        files.push(filePattern);
    }

    del(files).then(() => {
        cb();
    });
});
