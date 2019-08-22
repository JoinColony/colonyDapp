const TerserPlugin = require('terser-webpack-plugin');

const webpackBaseConfig = require('./webpack.config');

/*
 * Get the base config object, so we can modify it.
 */
const webpackProdConfig = webpackBaseConfig();
/*
 * Remove the TS checker and HMR plugins since we won't be needing them
 */
webpackProdConfig.plugins.pop();
webpackProdConfig.plugins.pop();
/*
 * Remove the dev server since we won't be needing it
 */
delete webpackProdConfig.devServer;
/*
 * Add babel-loader to the ts/tsx files
 */
webpackProdConfig.module.rules[0].use.push( { loader: 'babel-loader' } );
/*
 * Add chunk splitting optimization
 * This is not employing any code splitting or tree shaking ...yet
 * This was necessary to avoid a `node` memmory leak
 * See: https://github.com/webpack/webpack-dev-server/issues/1433#issuecomment-473342612
 */
webpackProdConfig.optimization = {
  minimizer: [new TerserPlugin()],
  splitChunks: {
    chunks: 'all'
  },
};

module.exports = () => webpackProdConfig;
