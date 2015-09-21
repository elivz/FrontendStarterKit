/**
 * Each task is a separate file under /gulpfile.babel.js/tasks.
 * This script includes them all.
 */

import requireDir from 'require-dir';

// Require all tasks in gulp/tasks, including subfolders
requireDir('./tasks', { recurse: true });
