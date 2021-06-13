import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// import ChromeExtensionReloader from 'webpack-chrome-extension-reloader'
import CopyPlugin from 'copy-webpack-plugin'
import path from 'path'

const { NODE_ENV = 'development' } = process.env

const base = {
  context: __dirname,
  entry: {
    background: './src/background/index.ts',
    'content-script': './src/content-scripts/index.ts',
    popup: './src/popup/index.ts',
    options: './src/options/index.ts'
  },
  resolve: {
    extensions: ['.ts']
    /*
    alias: {
      styles: path.resolve(__dirname, './src/styles/')
    }
    */
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          /*
          {
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'sass-loader' // compiles Sass to CSS
          }
          */
        ]
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './src/manifest.json', to: './manifest.json' },
        { from: './src/images', to: 'images' },
        { from: './src/popup/index.css', to: './popup.css' },
      ]
    }),
    new HtmlWebpackPlugin({
      template: './src/popup/template.html',
      chunks: ['popup'],
      filename: 'popup.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/options/template.html',
      chunks: ['options'],
      filename: 'options.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV)
      }
    })
  ]
}

const development = {
  ...base,
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    ...base.module
  },
  plugins: [
    ...base.plugins,
    new webpack.HotModuleReplacementPlugin()
  ]
}

const production = {
  ...base,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  mode: 'production',
  devtool: 'source-map',

  plugins: [
    ...base.plugins,
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ]
}

if (NODE_ENV === 'development') {
  module.exports = development
} else {
  module.exports = production
}
