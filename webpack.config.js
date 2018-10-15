/* eslint-disable flowtype/require-valid-file-annotation */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const utils = require('./scripts/utils');

/*
 * Wrapper method to generate aliases for all the dapp's modules
 *
 * @NOTE It's declared here instead of `utils` so you can *get* it's purpouse
 * at a glance when reading the webpack config
 */
const generateModulesAliases = () => {
  let modulesAliases = {};
  const foundDappModules = utils.getDappModules();
  foundDappModules.map(dappModule => {
    modulesAliases = Object.assign(
      {},
      modulesAliases,
      utils.generateWebpackAlias(dappModule),
    );
  });
  return modulesAliases;
};

const config = {
  entry: './src/index.js',
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    alias: Object.assign(
      {},
      {
        '~context': path.resolve(__dirname, 'src/context'),
        '~routes': path.resolve(__dirname, 'src/routes'),
        '~utils': path.resolve(__dirname, 'src/utils/'),
        '~styles': path.resolve(__dirname, 'src/styles/shared'),
        '~types': path.resolve(__dirname, 'src/types/'),
        // https://github.com/jquense/yup/issues/273
        '@babel/runtime/helpers/builtin': path.resolve(
          __dirname,
          'node_modules/@babel/runtime/helpers',
        ),
      },
      generateModulesAliases(),
    ),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src', 'modules'),
          path.resolve(__dirname, 'src', 'styles'),
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              importLoaders: 1,
              localIdentName: '[name]_[local]_[hash:base64:8]',
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(woff|woff2|png|jpg|gif)$/,
        use: 'file-loader',
      },
      {
        test: /\.svg$/,
        exclude: path.resolve(__dirname, 'src', 'img', 'icons'),
        use: ['@svgr/webpack'],
      },
      /*
      * We are only parsing images inside `src/client/img/icons`. Doing so allows us to bundle the commonly-used icons.
      * This loader also runs the images through a svg optimizer. See: https://github.com/svg/svgo#what-it-can-do
      */
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, 'src', 'img', 'icons'),
        use: [
          {
            loader: 'svg-sprite-loader',
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false },
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/templates/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: [path.resolve(__dirname, '..', 'colonyNetwork', 'build')],
    hotOnly: true,
  },
  /*
   * Fix for the XMLHttpRequest compile-time bug.
   *
   * See for more details:
   * https://github.com/webpack/webpack-dev-server/issues/66
   */
  externals:[{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}',
  }],
};

module.exports = () => config;
