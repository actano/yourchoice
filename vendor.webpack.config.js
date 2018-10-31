var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    vendor: [
      'react',
      'react-bootstrap',
      'react-dom',
      'react-redux',
    ],
  },
  output: {
    filename: 'vendor.bundle.js',
    path: path.join(__dirname, 'dist/'),
    library: 'vendor_lib',
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
  },
  plugins: [
    new webpack.DllPlugin({
      name: 'vendor_lib',
      path: 'dist/vendor-manifest.json',
    }),
  ],
}
