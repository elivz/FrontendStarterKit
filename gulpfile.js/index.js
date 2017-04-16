'use strict';

require('./lib/main');

/**
 * Each task is a separate file under /gulpfile.js/tasks.
 * This script includes them all.
 */
const tasks = require('../package.json').build.tasks;
Object.keys(tasks).forEach(taskName => {
    require(`./tasks/${taskName}`);
});
