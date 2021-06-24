const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ImageminMozjpeg = require('imagemin-mozjpeg');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const glob = require('glob');
const PATHS = {
  src: path.join(__dirname, 'src'),
};

module.exports = {
  mode: 'production',

  entry: ['./src/index.js'],

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/main.js',
  },

  performance: {
    maxEntrypointSize: 270000,
    maxAssetSize: 700000,
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
              importLoaders: 1,
              url: false,
            },
          },
          'postcss-loader',
        ],
      },

      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },

      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              pretty: true,
            },
          },
        ],
      },
    ],
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    open: true, //起動時にブラウザを開く
    overlay: true, //エラーをオーバーレイ表示
  },

  plugins: [
    new CleanWebpackPlugin({ verbose: true }),

    new MiniCssExtractPlugin({
      filename: 'css/style.css',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/img', to: 'img' },
        // { from: "./src/favicon.png", to: "favicon.png" },
        // { from: "./src/favicon.svg", to: "favicon.svg" },
      ],
    }),

    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: {
        quality: '70-80',
      },
      gifsicle: {
        interlaced: false,
        optimizationLevel: 10,
        colors: 256,
      },
      svgo: {},
      plugins: [
        ImageminMozjpeg({
          quality: 85,
          progressive: true,
        }),
      ],
    }),

    // Pug
    new HtmlWebpackPlugin({
      template: './src/pug/index.pug', //変換元のPugファイルの指定
      filename: 'index.html', //出力するHTMLのファイル名
      inject: false, //バンドルしたjsファイルを読み込むscriptタグを自動出力しない
      minify: false, //minifyしない
    }),

    // new HtmlWebpackPlugin({
    //   template: './src/pug/sub.pug',
    //   filename: 'sub.html',
    //   inject: false,
    //   minify: false,
    // }),

    new StyleLintPlugin({
      configFile: '.stylelintrc',
      fix: true, //自動修正可能なものは修正
    }),

    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),

    // ライブリロード
    new LiveReloadPlugin(),
  ],
  // リロード高速化
  cache: true,
};
