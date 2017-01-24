var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/app.jsx',
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
