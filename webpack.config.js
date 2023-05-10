"use strict";

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CreateFileWebpack = require('create-file-webpack');

const ROOT_DIR = path.resolve(__dirname);
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const DIST_SERVER_DIR = path.resolve(DIST_DIR);
const PACKAGE = require(path.join(__dirname, 'package.json'));

module.exports = {
  entry: {
    index: path.resolve(ROOT_DIR, './src/index.ts')
  },
  mode: 'development',
  watch: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: 'tsconfig.json'
          }
        }
      }
    ]
  },
  output: {
    path: DIST_DIR,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  target: 'node',
  optimization: {
    minimize: false
  },
  node: {
    __dirname: false
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(ROOT_DIR, './src/data/movies.json'),
          to: path.resolve(DIST_DIR, 'data')
        },
        path.join(ROOT_DIR, './swagger.yaml'),
        './node_modules/swagger-ui-dist/swagger-ui.css',
        './node_modules/swagger-ui-dist/swagger-ui-bundle.js',
        './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
        './node_modules/swagger-ui-dist/favicon-16x16.png',
        './node_modules/swagger-ui-dist/favicon-32x32.png'
      ]
    }),
    new CreateFileWebpack({
      path: DIST_DIR,
      fileName: 'package.json',
      content: JSON.stringify({
        name: PACKAGE.name,
        version: PACKAGE.version,
        description: PACKAGE.description,
        scripts: {
            start: 'node index.js'
        }
      }, null, 4)
    })
  ]
};