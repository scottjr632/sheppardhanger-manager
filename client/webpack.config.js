const HtmlWebpackPlugin = require('html-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
const path = require('path');
const Visualizer = require('webpack-visualizer-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')


module.exports = {
  mode: 'production',
  entry: [
    'babel-polyfill',
    './src/index.js'
  ],
  output: {
    path: path.resolve('../app/client/'),
    filename: 'bundle.js'
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react']
            }
          }
        ]
      },
      {
        test: /\.(s*)css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader:'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'sass-loader',
          }
        ]
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      // filename: 'css/[name].css',
      // chunkFilename: "[id].css"
    }),
    new DashboardPlugin(),
    new Visualizer({
      filename: './statistics.html'
    })
  ]
}
