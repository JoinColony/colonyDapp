const webpack = require('webpack');
const path = require('path');

const webpackBaseConfig = require('./webpack.base');

module.exports = () => ({
  ...webpackBaseConfig,
  /*
   * Add the rest of the DEVELOPMENT environment required configs here
   */
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: [path.resolve(__dirname, '..', 'colonyNetwork', 'build')],
    hotOnly: true,
  },
  output: {
    filename: 'dev-[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      ...webpackBaseConfig.module.rules,
      /*
       * Add the rest of the DEVELOPMENT environment required modules here
       */
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...webpackBaseConfig.plugins,
    /*
     * Add the rest of the DEVELOPMENT environment required plugins here
     */
    new webpack.WatchIgnorePlugin([
      /css\.d\.ts$/
    ]),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
