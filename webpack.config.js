import { dirname, resolve } from 'path'

import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('webpack').Configuration} */
export default {
  entry: './src/index.js',

  // exclude: [
  //   '**/*.stories.*'
  // ],
  module: {
    rules: [
      { test: /\.css$/, use: 'raw-loader' },
      {
        test: /\.svg$/,
        type: 'asset',
        loader: 'svgo-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules|\.stories\.|storybook-static/,
        use: ['babel-loader']
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules|\.stories\.|storybook-static/,
        options: { configFile: 'tsconfig.webpack.json' }
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"]
    },
    fallback: {
      path: 'path-browserify',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
    }
  },
  experiments: {
    outputModule: true
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'module',
    path: resolve(__dirname, 'dist')
  }
}
