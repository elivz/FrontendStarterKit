const mix = require('laravel-mix');
const path = require('path');
require('./config/build/sync-component');

// Base paths
const srcPath = 'src';
const publicPath = 'dist/public_html';
const distPath = path.join(publicPath, 'assets');

mix.setPublicPath(distPath);
mix.setResourceRoot('/assets/');

// Replace default image loader
Mix.listen('configReady', require('./config/build/image-loader'));

// Enable sourcemaps
mix.sourceMaps(true);

// Build everything
mix
  .js(path.join(srcPath, 'scripts/initial.js'), 'scripts')
  .js(path.join(srcPath, 'scripts/main.js'), 'scripts')
  .copy(
    ['./node_modules/picturefill/dist/picturefill.min.js'],
    path.join(distPath, 'scripts')
  )
  .sass(path.join(srcPath, 'styles/site.scss'), 'styles')
  .sync(path.join(srcPath, 'templates'), 'dist/templates')
  .copy(path.join(srcPath, 'images'), path.join(distPath, 'images'))
  .copy(path.join(srcPath, 'fonts'), path.join(distPath, 'fonts'))
  .copy(path.join(srcPath, 'static'), publicPath)
  .version();

// BrowserSync
mix.browserSync({
  proxy: 'http://localhost',
  files: ['dist/templates/**/*', path.join(distPath, 'styles/*.css')],
  open: false,
  xip: true,
});
