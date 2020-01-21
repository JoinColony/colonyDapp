const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpackBaseConfig = require('./webpack.config');

/*
 * Get the base config object, so we can modify it.
 */
const webpackProdConfig = webpackBaseConfig();
webpackProdConfig.output = {
  filename: '[name].[contenthash].js',
  path: path.resolve(__dirname, 'dist'),
  publicPath: '/',
};
/*
 * Remove the HMR plugin since we won't need it in production
 */
webpackProdConfig.plugins.pop();
/*
 *
 */
webpackProdConfig.plugins.push(
  new CleanWebpackPlugin(),
);
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
