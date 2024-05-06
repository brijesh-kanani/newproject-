const path = require('path');
const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      timers: require.resolve('timers'),
    },
  },

  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};
