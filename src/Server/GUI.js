var clientPath = require('path').resolve(__dirname, '..', 'Client')
  , options = { formats: { '.styl': require('glagol-stylus')() } }
  , app = require('glagol')(clientPath, options)
  , handler = module.exports = function (req, res) {
      try {
        $.Bundler.core.bundle(app, req, res)
      } catch (e) {
        $.Log.Error('Error bundling client-side code:')
        $,Log.Error(e.stack)
      }
    }

handler.tracked = app;
