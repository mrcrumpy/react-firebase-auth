
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './server/app.jsx',
  output: {
    path: `${__dirname}/public/`,
    filename: 'server.bundle.js',
  },
  module: {
    // preLoaders: [
    //   {
    //     test: [/\.js$/, /\.jsx$/],
    //     exclude: /node_modules/,
    //     loader: 'eslint-loader',
    //   },
    // ],
    rules: [
      {
        test: [/\.js$/, /\.jsx$/],
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: ['transform-decorators-legacy'],
          presets: ['react', 'es2015', 'stage-1'],
        },
      },
    ],
  },
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: 'source-map',
};
