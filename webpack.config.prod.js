const webpackBaseConfig = require('./webpack.config');

/*
 * Get the base config object, so we can modify it.
 */
const webpackProdConfig = webpackBaseConfig();
/*
 * Remove the HMR plugins since we won't be needing it
 */
webpackProdConfig.plugins.pop();
/*
 * Remove the dev server since we won't be needing it
 */
delete webpackProdConfig.devServer;
/*
 * Add chunk splitting optimization
 * This is not employing any code splitting or tree shaking ...yet
 * This was necessary to avoid a `node` memmory leak
 * See: https://github.com/webpack/webpack-dev-server/issues/1433#issuecomment-473342612
 */
webpackProdConfig.optimization = {
  minimize: false, // @TODO Work out how to remove this and reenable Uglify
  splitChunks: {
    chunks: 'all'
  },
};

module.exports = () => webpackProdConfig;
