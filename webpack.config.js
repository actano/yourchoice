const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'yourchoice.js',
    library: 'Yourchoice',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ },
    ],
  },
  externals: {
    lodash: '_',
  },
}
