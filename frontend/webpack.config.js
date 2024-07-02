const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = (env) => {

  const isProduction = env.development === 'false';
  // const envFile = isProduction ? '.env.prod' : '.env.dev';
  // const envPath = path.resolve(__dirname, envFile);
  // const envVars = require('dotenv').config({ path: envPath }).parsed || {};

  return {
    mode: 'development',
    entry: "./src/index.js",
    devServer: {
      static: [
        // { directory: path.join(__dirname, 'public') },
        // { directory: path.join(__dirname, 'dist') }
        {
          directory: path.join(__dirname, 'src', 'assets'),
          publicPath: '/assets',
        }
      ],
      hot: true,
      historyApiFallback: true,
    },
    stats: {
      children: false
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: "bundle.js",
      clean: true,
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ]
        },
        {
          test: /\.yaml$/,
          use: "yaml-loader",
       },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.css'
      }),
    ]
  }
}