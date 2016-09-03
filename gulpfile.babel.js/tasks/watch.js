import gulp from 'gulp';
import path from 'path';

import config from '../config';

gulp.task('watch', ['browserSync'], () => {
    const watchableTasks = [
        'styles',
        'scripts',
        'templates-watch',
        'fonts',
        'images',
        'sprites',
        'rootfiles',
    ];

    watchableTasks.forEach((taskName) => {
        const task = config.tasks[taskName.replace('-watch', '')];
        if (task) {
            const filePattern = path.join(task.src, `**/*.{${task.extensions.join(',')}}`);
            gulp.watch(filePattern, () => {
                gulp.start(taskName);
            });
        }
    });
});
