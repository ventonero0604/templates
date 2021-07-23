const webpack = require('webpack');
const path = require('path');
const metadata = require('./meta.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ImageminMozjpeg = require('imagemin-mozjpeg');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BeautifyHtmlWebpackPlugin = require('beautify-html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
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

      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-html-info-loader',
            options: {
              data: {
                globalConf: metadata['global'],
                localConf: metadata['local'],
              }, // set of data to pass to the pug render.
              basePath: path.resolve(__dirname, 'src'),
              // base folder path for local variables.
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
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),

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

    // new ImageminPlugin({
    //   test: /\.(jpe?g|png|gif|svg)$/i,
    //   pngquant: {
    //     quality: '70-80',
    //   },
    //   gifsicle: {
    //     interlaced: false,
    //     optimizationLevel: 10,
    //     colors: 256,
    //   },
    //   svgo: {},
    //   plugins: [
    //     ImageminMozjpeg({
    //       quality: 85,
    //       progressive: true,
    //     }),
    //   ],
    // }),

    // Pug
    new HtmlWebpackPlugin({
      template: './src/pug/index.pug',
      filename: 'index.html',
      inject: false,
      minify: false,
    }),

    new BeautifyHtmlWebpackPlugin({
      indent_size: 2,
      indent_char: ' ',
      indent_with_tabs: false,
      editorconfig: false,
      eol: '\n',
      end_with_newline: false,
      indent_level: 0,
      preserve_newlines: true,
      max_preserve_newlines: 2,
      space_in_paren: false,
      space_in_empty_paren: false,
      jslint_happy: false,
      space_after_anon_function: false,
      space_after_named_function: false,
      brace_style: 'collapse',
      unindent_chained_methods: false,
      break_chained_methods: false,
      keep_array_indentation: false,
      unescape_strings: false,
      wrap_line_length: 0,
      e4x: false,
      comma_first: false,
      operator_position: 'before-newline',
      indent_empty_lines: false,
      templating: ['auto'],
    }),

    new StyleLintPlugin({
      configFile: '.stylelintrc',
      fix: true, //自動修正可能なものは修正
    }),

    // new PurgecssPlugin({
    //   paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    // }),
  ],
};
