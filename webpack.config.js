const path = require('path');
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
    ],
  },
  plugins: [
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
