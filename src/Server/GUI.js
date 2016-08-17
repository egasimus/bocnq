var clientPath = require('path').resolve(__dirname, '..', 'client')
  , options = { formats: { '.styl': require('glagol-stylus')() } };
  , app = module.exports = _.lib.bundler.app(options, clientPath;
