import config from  '../config';

import gulp from  'gulp';
import path from  'path';

gulp.task('watch', ['browserSync'], () => {
    const watchableTasks = [
        'styles',
        'templates-watch',
        'fonts',
        'images',
        'sprites',
    ];

    watchableTasks.forEach((taskName) => {
        const task = config.tasks[taskName.replace('-watch', '')];
        if (task) {
            const filePattern = path.join(task.src, '**/*.{' + task.extensions.join(',') + '}');
            gulp.watch(filePattern, () => {
                gulp.start(taskName);
            });
        }
    });

    const scriptTasks = [
        'main',
        'header',
        'ie8',
    ];

    scriptTasks.forEach((taskName) => {
        const task = config.tasks.scripts.entries[taskName];
        if (task) {
            const filePattern = path.join(task.src, '**/*.{' + config.tasks.scripts.extensions.join(',') + '}');
            gulp.watch(filePattern, () => {
                gulp.start('scripts:' + taskName);
            });
        }
    });
});
