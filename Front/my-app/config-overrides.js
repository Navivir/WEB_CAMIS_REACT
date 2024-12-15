const webpack = require('webpack');

module.exports = {
  webpack: function (config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      process: require.resolve('process/browser') 
    };

    config.plugins = [
      ...config.plugins,
      new webpack.ProvidePlugin({
        process: 'process/browser', // Proporciona el polyfill de `process`
      }),
    ];

    return config;
  },
};