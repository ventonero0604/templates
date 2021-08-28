const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TailwindCss = require('tailwindcss');
const Autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, args) => {
  {
    const { mode } = args;
    const sourceMap = mode === 'development';
    return {
      entry: ['./src/index.js'],

      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/main.js',
      },

      cache: {
        type: 'filesystem',
      },

      module: {
        rules: [
          {
            enforce: 'pre',
            test: /\.(js|ts)$/,
            exclude: /node_modules/,
            loader: 'eslint-loader',
            options: {
              fix: true, //autofixモードの有効化
              failOnError: true, //エラー検出時にビルド中断
            },
          },

          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
          },

          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  sourceMap,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [TailwindCss, Autoprefixer],
                  },
                },
              },
            ],
          },
        ],
      },

      devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        open: true, //起動時にブラウザを開く
      },

      plugins: [
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery',
        }),

        new CleanWebpackPlugin({ verbose: true }),

        new MiniCssExtractPlugin({
          filename: './css/style.css',
        }),
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: './index.html',
        }),
        new CopyPlugin({
          patterns: [
            { from: 'src/img', to: 'img' },
            // { from: "./src/favicon.png", to: "favicon.png" },
            // { from: "./src/favicon.svg", to: "favicon.svg" },
          ],
        }),
      ],
    };
  }
};
