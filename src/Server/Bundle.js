module.exports = function (app, cb) {

  var bundlerOptions = client.options.bundler || {}
    , result         = { formats: client.options.formats }
    , currently      = '';

  try {

    currently = 'freezing app source';
    result.ice = freeze(app)

    currently = 'freezing app dependencies';
    result.deps = deps(app);

    currently = 'bundling client code';
    var br = require('browserify')({ cache: {} });
    require('browserify-incremental-plugin')(br);
    br.require('glagol', { expose: 'glagol' });
    ['plaintext', 'javascript'].forEach((format) => {
      format = 'glagol/formats/' + format + '.js';
      br.require(format, { expose: 'format' }); })
    Object.keys(result.deps.ids).forEach(function (module) {
      br.require(module, { expose: result.deps.ids[module] }) })
    br.bundle(cb);

  } catch (error) {

    cb(error, null);

  }

}
