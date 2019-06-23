const path = require('path');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const merge = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
    watchContentBase: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    compress: true,
    port: 8080,
    hot: true,
  },
});
