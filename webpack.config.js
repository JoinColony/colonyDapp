const path = require('path');
const express = require('express');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const shared = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
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
        include: [path.resolve(__dirname, 'src', 'modules'), path.resolve(__dirname, 'src', 'styles', 'shared')],
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
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    new HtmlWebpackPlugin({
      template: 'templates/index.html',
    }),
  ],
  devServer: {
    historyApiFallback: true,
    before(app) {
      app.use(
        '/contracts/',
        express.static(path.join(__dirname, 'colonyNetwork', 'build', 'contracts')),
      );
    },
  },
};

// TODO: Plugins for production
// new webpack.DefinePlugin({
// 'process.env': {
//   'NODE_ENV': JSON.stringify('production')
// }
// }),
// new webpack.optimize.DedupePlugin(), //dedupe similar code
// new webpack.optimize.UglifyJsPlugin(), //minify everything
// new webpack.optimize.AggressiveMergingPlugin()//Merge chunks
// ],

const dev = shared;
const prod = shared;

// TODO: Define own logic on what config to assume for which environment
module.exports = (env) => {
  if (env === 'prod') {
    return prod;
  }
  return dev;
};
