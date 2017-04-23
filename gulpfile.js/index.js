require('./lib/main');

const tasks = require('../package.json').build.tasks;

/**
 * Each task is a separate file under /gulpfile.js/tasks.
 * This script includes them all.
 */
Object.keys(tasks).forEach(taskName => {
    require(`./tasks/${taskName}`);
});
