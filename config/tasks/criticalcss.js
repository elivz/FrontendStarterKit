const criticalCss = require('critical');

module.exports = (gulp, PATH_CONFIG, TASK_CONFIG) => () => {
    // Process data in an array synchronously, moving onto the n+1 item only after the nth item callback
    function doSynchronousLoop(data, processData, done) {
        if (data.length > 0) {
            const loop = (data, i, processData, done) => {
                processData(data[i], i, () => {
                    if (++i < data.length) {
                        loop(data, i, processData, done);
                    } else {
                        done();
                    }
                });
            };
            loop(data, 0, processData, done);
        } else {
            done();
        }
    }

    // Process the critical path CSS one at a time
    function processCriticalCSS(element, i, callback) {
        const criticalSrc = `${config.pkg.paths.url}/${element.url}`;
        const criticalDest = `${taskConfig.critical.dist}/${element.template}.css`;

        criticalCss
            .generate({
                src: criticalSrc,
                dest: criticalDest,
                base: config.pkg.paths.webroot,
                minify: true,
                width: 1200,
                height: 1000,
            })
            .then(() => {
                callback();
            });
    }

    gulp.task('styles:critical', cb => {
        if (config.productionMode) {
            doSynchronousLoop(
                taskConfig.critical.files,
                processCriticalCSS,
                () => {
                    cb();
                }
            );
        } else {
            cb();
        }
    });
};
