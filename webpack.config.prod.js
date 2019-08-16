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
 * Remove ts-loader since it's just for watching (babel-loader does the build)
 */
webpackProdConfig.module.rules.splice(0, 1, {
  test: /\.(js|tsx?)$/,
  exclude: /node_modules/,
  use: [
    { loader: 'babel-loader' },
  ],
});
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
