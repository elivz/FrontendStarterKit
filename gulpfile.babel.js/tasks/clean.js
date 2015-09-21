import config from '../config';
import del from 'del';
import gulp from 'gulp';
import path from 'path';

gulp.task('clean', (cb) => {
    var files = [path.join(config.paths.dist, 'rev-manifest.json')];

    for (var key in config.tasks) {
        var task = config.tasks[key];
        var filePattern = path.join(task.dist, '**/*.{' + task.extensions.join(',') + ',map}');
        files.push(filePattern);
    }

    del(files).then(() => {
        cb();
    });
});
