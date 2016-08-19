module.exports = require('riko-route')(
  [ [ /^\/$/,        serveIndex ]
  , [ /^\/libs.js$/, serveLibs  ]
  , [ /^\/app.js$/,  serveApp   ]
  , [ /^\/api.?/,    serveAPI   ] ]);

module.exports.catchall = function (route, args) {
  require('send-data/html')(args[0], args[1],
    { body: 'Not found', statusCode: 404 }); }

// GUI

var clientPath = require('path').resolve(__dirname, '..', 'Client')
  , options    = { formats: { '.styl': require('glagol-stylus')() } }
  , clientCode = require('glagol')(clientPath, options)

module.exports._track   = clientCode;
module.exports._bundler = $.Bundle(clientCode);

function serveIndex (route, req, res) {
  var indexPath = require('path').resolve(__dirname, '..', 'index.html')
    , indexData = require('fs').readFileSync(indexPath, 'utf-8');
  require('send-data/html')(req, res, indexData); }

function serveLibs (route, req, res) {
  try {
    module.exports._bundler.buildLibs((err, data) => {
      if (err) serveError(err, 'Error when bundling dependencies:', req, res);
      else require('send-data')(req, res, { body: data }); }) }
  catch (e) {
    $.Log.Error('Error preparing client-side libraries:')
    $.Log.Error(e.stack) } }

function serveApp (route, req, res) {
  try {
    module.exports._bundler.buildApp((err, data) => {
      if (err) serveError(err, 'Error when bundling app code:', req, res);
      else require('send-data')(req, res, { body: JSON.stringify(data) }); }) }
  catch (e) {
    $.Log.Error('Error preparing client-side app source:')
    $.Log.Error(e.stack) } }

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

// errors

function serveError (e, msg, req, res) {
  $.Log.Error(msg, '\n ' + e.stack);
  if (!req) return;
  if (req.headers.accept && req.headers.accept.indexOf('text/html') > -1) {
    require('send-data/html')(req, res, { statusCode: 500, body:
      "<head><meta charset=\"utf-8\"></head>" +
      "<body><pre><strong>" + e.message +
      "</strong>\n\n" + e.stack + "</pre></body>" })
  } else {
    require('send-data/error')(req, res, { body: e, serializeStack: true })
  }
}
