const path = require('path');

module.exports = {
  mode: 'development',
  entry: './script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname),
    libraryTarget: 'var',
    library: 'webfunc'
  }
};
