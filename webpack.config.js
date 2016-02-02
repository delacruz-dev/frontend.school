var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var merge = require('webpack-merge');
var autoprefixer = require('autoprefixer');

var APP_PATH = path.join(__dirname, '/src');
var TARGET = process.env.npm_lifecycle_event;

var common = {
  context: APP_PATH,
  entry: './',
  postcss: function () {
      return [autoprefixer({ browsers: ['last 10 versions'] })];
  },
  module: { loaders: [] },
  plugins: []
};

if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    output: {
      filename: 'bundle.js',
      publicPath: 'http://localhost:3000/dist/assets'
    },
    devServer: {
      port: 3000,
      stats: { colors: true },
      inline: true,
      publicPath: '/dist/assets'
    },
    module: {
      loaders: [{
        test: /\.s?css$/,
        loaders: [ 'style-loader', 'css-loader', 'sass-loader', 'postcss-loader' ],
        include: APP_PATH
      }]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}

if(TARGET === 'build') {
  module.exports = merge(common, {
    output: {
      path: path.join(__dirname, 'dist/assets'),
      filename: 'bundle.js'
    },
    module: {
      loaders: [{
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'sass-loader', 'postcss-loader'),
        include: APP_PATH
      }]
    },
    plugins: [
      new ExtractTextPlugin('[name].css', { 
        allChunks: true 
      })
      , new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}