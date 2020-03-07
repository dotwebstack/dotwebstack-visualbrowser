const path = require('path');

module.exports = {
  mode: 'development', //Set to 'production' for production
  entry: './src/index.js',
  devtool: 'inline-source-map', //Only for debugging
  devServer: {
    contentBase: './build'
  },
  output: {
    filename: 'dwsviz-lib.js',
    path: path.resolve(__dirname, 'build'),
    libraryTarget: 'var',
    library: 'RDFViz'
  }
};
