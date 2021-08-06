const ExtensionReloader  = require('webpack-extension-reloader');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const contentScripts = {
  content: './content/index.ts'
}
const extensionPages = {
  options: './options/index.ts',
  popup: './popup/index.ts'
}
const pageScripts = {
  page: './page/index.ts'
}
const devtoolsScripts = {
  devtools: './devtools/index.ts',
  panel: './devtools/panel.ts'
}

let config = {
  mode: process.env.NODE_ENV,
  context: __dirname + '/src'
};

let ExtensionConfig = Object.assign({}, config, {
    entry: {
      background: './background/index.ts',
      ...contentScripts,
      ...extensionPages,
      ...pageScripts,
      ...devtoolsScripts
    },
    resolve: {
      extensions: ['.ts']
    },
    output: {
      path: __dirname + '/extension/dist/',
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        }
      ]
    },
    plugins: [
      new ExtensionReloader({
        port: 9090,
        reloadPage: true,
        entries: {
          contentScript: Object.keys(contentScripts),
          extensionPage: Object.keys(extensionPages),
          background: 'background'
        }
      }),
      new CopyPlugin([
        {
          from: './fonts/*',
          to: __dirname + '/extension/dist/',
        },
        {
          from: './icons/*',
          to: __dirname + '/extension/dist/',
        },
        {
          from: './images/*',
          to: __dirname + '/extension/dist/',
        },
        {
          from: './devtools/index.css',
          to: __dirname + '/extension/dist/devtools.css',
        },
        {
          from: './devtools/index.html',
          to: __dirname + '/extension/dist/devtools.html',
        },
        {
          from: './devtools/panel.html',
          to: __dirname + '/extension/dist/panel.html',
        },
        {
          from: './popup/index.html',
          to: __dirname + '/extension/dist/popup.html',
        },
        {
          from: './popup/index.css',
          to: __dirname + '/extension/dist/popup.css',
        },
        {
          from: './options/index.html',
          to: __dirname + '/extension/dist/options.html',
        },
        {
          from: './options/index.css',
          to: __dirname + '/extension/dist/options.css',
        },
        {
          from: './content/index.css',
          to: __dirname + '/extension/dist/content.css',
        },
      ]),
    ]
});

module.exports = [
    ExtensionConfig,
];
