module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: [
        'mocha',
        'sinon-chai',
        'chai'
    ],
    files: [
        'test/*.coffee',
        'src/index.coffee'
    ],
    preprocessors: {
        'test/*.coffee': ['webpack'],
        'src/*.coffee': ['webpack']
    },
    reporters: ['progress'],
    webpack: {
      module: {
        loaders: [
          { test: /\.coffee$/, loader: 'coffee-loader' }
        ]
      },
      resolve: {
        extensions: [
            '',
            '.coffee'
        ]
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,
    plugins: [
        'karma-*'
    ]
  })
}
