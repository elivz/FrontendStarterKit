const mix = require('laravel-mix');
const path = require('path');
require('./config/build/sync-component');

// Base paths
const srcPath = 'src';
const publicPath = 'dist/public_html';
const distPath = path.join(publicPath, 'assets');

// Mix configuration
mix
  .setPublicPath(distPath)
  .setResourceRoot('/assets/')
  .sourceMaps(true, 'source-map')
  .version()
  .browserSync({
    proxy: 'localhost',
    files: ['dist/templates/**/*', path.join(distPath, 'styles/*.css')],
    open: false,
    xip: true,
    reloadOnRestart: false,
  });

// Replace default image loader
Mix.listen('configReady', require('./config/build/image-loader'));

// Build everything
mix
  .js(path.join(srcPath, 'scripts/initial.js'), 'scripts')
  .js(path.join(srcPath, 'scripts/main.js'), 'scripts')
  .js(path.join(srcPath, 'scripts/directory.js'), 'scripts')
  .copy(
    ['./node_modules/picturefill/dist/picturefill.min.js'],
    path.join(distPath, 'scripts')
  )
  .sass(path.join(srcPath, 'styles/main.scss'), 'styles')
  .sync(path.join(srcPath, 'templates'), 'dist/templates')
  .copy(path.join(srcPath, 'images'), path.join(distPath, 'images'))
  .copy(path.join(srcPath, 'icons'), path.join(distPath, 'icons'));
