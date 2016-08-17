var clientPath = require('path').resolve(__dirname, '..', 'Client')
  , options = { formats: { '.styl': require('glagol-stylus')() } }
  , app = require('glagol')(clientPath, options)

module.exports = (req, res) => {
  var error = $.Bundler.core.error.bind(null, req, res);
  try {
    $.Bundler.core.bundle(app, null, null, (err, data) => {
      if (err) error(err, 'Bundling error');
      else require('send-data')(req, res, data); }) }
  catch (e) {
    $.Log.Error('Error bundling client-side code:')
    $.Log.Error(e.stack) } }

module.exports.tracked = app;
