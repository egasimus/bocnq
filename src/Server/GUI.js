var clientPath = require('path').resolve(__dirname, '..', 'Client')
  , options = { formats: { '.styl': require('glagol-stylus')() } }
  , app = module.exports = _.Bundler.app(options, clientPath);
