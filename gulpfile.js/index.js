"use strict";

/**
 * Each task is a separate file under /gulpfile.js/tasks.
 * This script includes them all.
 */
require('require-dir')('./tasks', { recurse: true });
