module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: [
        'mocha',
        'chai'
    ],
    files: [
        'test/*.js',
    ],
    preprocessors: {
        'test/*.js': ['webpack'],
        'src/*.js': ['webpack'],
    },
    reporters: ['spec'],
    webpack: {
      module: {
        noParse: [
            /node_modules\/sinon\//,
        ],
        loaders: [
          {
            test: /\.js/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
              presets: ['es2015']
            }
          }
        ]
      },
      resolve: {
        extensions: [
            '',
            '.js'
        ],
        alias: {
            sinon: 'sinon/pkg/sinon'
        }
      }
    },
    webpackMiddleware: {
      noInfo: true
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Firefox'],
    singleRun: true,
    plugins: [
        'karma-*'
    ]
  })
}
