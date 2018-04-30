let mix = require('laravel-mix');
let CopyWebpackPlugin = require('copy-webpack-plugin');

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
     * @param  {*} ...params
     * @return {void}
     *
     */
    register(from, to) {
        this.config = { from, to };
    }

    /*
     * Plugins to be merged with the master webpack config.
     *
     * @return {Array|Object}
     */
    webpackPlugins() {
        return new CopyWebpackPlugin([
            {
                from: Mix.paths.root(this.config.from),
                to: Mix.paths.root(this.config.to),
            },
        ]);
    }
}

mix.extend('sync', new Sync());
