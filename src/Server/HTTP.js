module.exports = require('riko-route')(
  [ [ /^\/$/,            serveIndex    ]
  , [ /^\/required.js$/, serveRequired ]
  , [ /^\/app.js$/,      serveApp      ]
  , [ /^\/api.?/,        serveAPI      ] ]);

// GUI

var clientPath = require('path').resolve(__dirname, '..', 'Client')
  , options    = { formats: { '.styl': require('glagol-stylus')() } }
  , clientCode = require('glagol')(clientPath, options)

module.exports._track = clientCode

function serveIndex (route, req, res) {
  var indexPath = require('path').resolve(__dirname, '..', 'index.html')
    , indexData = require('fs').readFileSync(indexPath, 'utf-8');
  require('send-data/html')(req, res, indexData); }

function serveRequired (route, req, res) {
  var error = $.Bundler.core.error.bind(null, req, res);
  try {
    $.Bundler.core.bundle(clientCode, null, null, (err, data) => {
      if (err) error(err, 'Bundling error');
      else require('send-data')(req, res, { body: data }); }) }
  catch (e) {
    $.Log.Error('Error bundling client-side code:')
    $.Log.Error(e.stack) } }

function serveApp (route, req, res) {
}

// API

function serveAPI (route, req, res) {
  var id    = _.Auth.check(req)
    , model = $.plugins.Workspace.model.Users.get(id) || (function(){})
    , api   = $.api(model(), respond)
    , url   = require('url').parse(req.url)
    , cmd   = url.pathname.split('/').slice(2).join('/')
  if (cmd.length === 0) {
    respond(JSON.stringify(Object.keys(api)));
  } else {
    var args = JSON.parse(decodeURIComponent(require('url').parse(req.url).query));
    api[cmd].apply(null, args); }

  function respond (data) {
    require('send-data')(req, res, { body: data }); } }
