const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

const utils = require('./scripts/utils');

const mode = process.env.NODE_ENV || 'development';

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
  entry: './src/index.ts',
  mode,
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    pathinfo: false,
  },
  resolve: {
    alias: Object.assign(
      {},
      {
        '~constants': path.resolve(__dirname, 'src/modules/constants'),
        '~context': path.resolve(__dirname, 'src/context'),
        '~lib': path.resolve(__dirname, 'src/lib'),
        '~data': path.resolve(__dirname, 'src/data'),
        '~redux': path.resolve(__dirname, 'src/redux'),
        '~routes': path.resolve(__dirname, 'src/routes'),
        '~utils': path.resolve(__dirname, 'src/utils'),
        '~styles': path.resolve(__dirname, 'src/styles/shared'),
        '~types': path.resolve(__dirname, 'src/types'),
        '~immutable': path.resolve(__dirname, 'src/immutable'),
      },
      generateModulesAliases(),
    ),
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  module: {
    rules: [
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
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src', 'modules'),
          path.resolve(__dirname, 'src', 'styles'),
        ],
        use: [
          'style-loader',
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: true,
              namedExport: true,
              camelCase: true,
              importLoaders: 1,
              localIdentName: '[name]_[local]_[hash:base64:8]',
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        include: [path.resolve('node_modules', 'draft-js')],
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|png|jpe?g|gif)$/,
        use: 'file-loader',
        include: [
          path.resolve('src'),
          path.resolve('node_modules', 'eth-contract-metadata', 'images'),
        ],
      },
      /*
       * To load company logo and token icons to import
       */
      {
        test: /\.svg$/,
        exclude: path.resolve(__dirname, 'src', 'img', 'icons'),
        use: ['@svgr/webpack'],
      },
      /*
       * We are only parsing images inside `src/client/img/icons`. Doing so allows us to bundle the commonly-used icons.
       * This loader also runs the images through a svg optimizer. See: https://github.com/svg/svgo#what-it-can-do
       * To use with Icon component
       */
      {
        test: /\.svg$/,
        include: [
          path.resolve(__dirname, 'src', 'img', 'icons'),
        ],
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
      /*
       * Only parse svg images from the `eth-contract-metadata` package.
       */
      {
        test: /\.svg$/,
        include: [
          path.resolve(__dirname, 'node_modules', 'eth-contract-metadata', 'images'),
          path.resolve(__dirname, 'src', 'img', 'tokens'),
        ],
        use: [
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false },
                { removeViewBox: false },
                { removeDimensions: true }
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // For packages that still rely on babel 6 stuff, e.g. ledger: https://github.com/JoinColony/purser/issues/184
    new webpack.ProvidePlugin({
      regeneratorRuntime: '@babel/runtime/regenerator',
    }),
    new webpack.WatchIgnorePlugin([
      /css\.d\.ts$/
    ]),
    new Dotenv({
      systemvars: !!process.env.CI,
    }),
    new HtmlWebpackPlugin({
      template: 'src/templates/index.html',
      favicon: 'src/img/favicon.png',
    }),
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      useTypescriptIncrementalApi: true,
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
  externals: [
    {
      xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}',
    },
  ],
};

module.exports = () => config;
