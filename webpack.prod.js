const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const webpackBaseConfig = require('./webpack.base');

module.exports = () => ({
  ...webpackBaseConfig,
  /*
   * Add the rest of the PRODUCTION environment required configs here
   */
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  optimization: {
    minimizer: [new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        lib: {
          test: /[\\/]src\/lib[\\/]/,
          name: 'libs',
          chunks: 'all',
        }
      }
    }
  },
  module: {
    rules: [
      ...webpackBaseConfig.module.rules,
      /*
       * Add the rest of the PRODUCTION environment required modules here
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
     * Add the rest of the PRODUCTION environment required plugins here
     */
    new CleanWebpackPlugin(),
    /**
     * Ignore the colonyNetwork imports from the final bundle
     */
    new webpack.IgnorePlugin({
      resourceRegExp: /^(.*)\.json$/,
      contextRegExp: /colonyNetwork\/build\/contracts$/
    }),
  ],
});
