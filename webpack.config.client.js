const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodemonEnv = require('./nodemon.json');

const isProduction = () => {
  if (process.env.NODE_ENV === 'production') {
    return new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true,
      },
      compress: {
        screw_ie8: true,
      },
      comments: false,
    });
  }
  return false;
};

module.exports = {
  target: 'web',
  entry: './app/app.jsx',
  output: {
    path: `${__dirname}/public/`,
    filename: 'app.bundle.js',
  },
  module: {
    loaders: [{
      test: [/\.js$/, /\.jsx$/],
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        plugins: ['transform-decorators-legacy', 'syntax-dynamic-import'],
        presets: ['react', 'es2015', 'stage-1'],
      },
    },
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader' }),
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      request$: 'xhr',
    },
  },
  plugins: [
    new ExtractTextPlugin('main.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || nodemonEnv.env.NODE_ENV),
      'process.env.FB_APIKEY': JSON.stringify(process.env.FB_APIKEY || nodemonEnv.env.FB_APIKEY),
      'process.env.FB_AUTHDOM': JSON.stringify(process.env.FB_AUTHDOM || nodemonEnv.env.FB_AUTHDOM),
      'process.env.FB_DATAURL': JSON.stringify(process.env.FB_DATAURL || nodemonEnv.env.FB_DATAURL),
      'process.env.FB_STORAGE': JSON.stringify(process.env.FB_STORAGE || nodemonEnv.env.FB_STORAGE),
      'process.env.FB_MESS_SENDERID': JSON.stringify(process.env.FB_MESS_SENDERID || nodemonEnv.env.FB_MESS_SENDERID),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'meta', chunks: ['vendor'], filename: 'meta.js' }),
    new webpack.NamedModulesPlugin(),
    isProduction,
  ],
};
