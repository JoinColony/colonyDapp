const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const shared = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      $utils: path.resolve(__dirname, 'src/utils/'),
      $types: path.resolve(__dirname, 'src/types/'),
      $styles: path.resolve(__dirname, 'src/styles/shared/'),
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
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    new HtmlWebpackPlugin({
      template: 'templates/index.html',
    }),
  ],
  devServer: {
    historyApiFallback: true,
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
