/* eslint-disable flowtype/require-valid-file-annotation */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let mode = 'development';

if (process.env.NODE_ENV === 'production') {
  mode = 'production';
}

const config = {
  entry: './src/index.js',
  mode,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      '~utils': path.resolve(__dirname, 'src/utils/'),
      '~types': path.resolve(__dirname, 'src/types/'),
      '~styles': path.resolve(__dirname, 'src/styles/shared'),
      '@colony': path.resolve(__dirname, 'src/lib/colony-js/packages'),
      'colony-wallet': path.resolve(__dirname, 'src/lib/colony-wallet/lib'),
    },
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
          path.resolve(__dirname, 'src', 'styles', 'shared'),
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
        test: /\.svg$/,
        include: path.resolve(__dirname, 'src', 'img'),
        exclude: path.resolve(__dirname, 'src', 'img', 'icons'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/image.[hash].svg',
            },
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
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: [path.resolve(__dirname, '..', 'colonyNetwork', 'build')],
  },
};

module.exports = () => config;
