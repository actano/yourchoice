var path = require('path')
var webpack = require('webpack')

const coreModules = [
  'es6.symbol',
  'es6.array.from',
  'es6.array.iterator',
  'es6.object.assign',
  'es7.array.includes',
]

module.exports = {
  entry: [...coreModules.map(m => `core-js/modules/${m}`), './src/app.jsx'],
  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: 'dist',
    filename: 'app.bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loaders: ['react-hot-loader', 'babel-loader?presets[]=react,presets[]=es2015'],
        exclude: /node_modules/,
      },
    ],
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require('./dist/vendor-manifest.json'),
    }),
  ],
  devtool: 'source-map',
}
