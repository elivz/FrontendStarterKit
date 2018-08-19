const mix = require('laravel-mix');

class Sync {
  /**
   * All dependencies that should be installed by Mix.
   *
   * @return {Array}
   */
  dependencies() {
    return ['copy-webpack-plugin'];
  }

  /**
   * Register the component.
   * @param  {string} from
   * @param  {string} to
   * @return {void}
   *
   */
  register(from, to) {
    this.paths = this.paths || [];
    this.paths.push({ from, to });
  }

  /*
   * Plugins to be merged with the master webpack config.
   *
   * @return {Array|Object}
   */
  webpackPlugins() {
    const CopyWebpackPlugin = require('copy-webpack-plugin');
    const patterns = this.paths.map(path => ({
      from: Mix.paths.root(path.from),
      to: Mix.paths.root(path.to),
    }));
    return new CopyWebpackPlugin(patterns);
  }
}

mix.extend('sync', new Sync());
