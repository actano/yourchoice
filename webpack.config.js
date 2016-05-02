module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'Yourchoice',
    libraryTarget: 'umd'
  },
  externals: {
    'lodash': '_'
  }
}
