module.exports = function (App) {

  // reload when this file changes
  Glagol.events.once('changed', reload);

  // this tries to persist across reloads
  var App = App || {};

  // add http and websocket servers
  App.Http = App.Http || new (require('http').Server)();
  App.Http.on("listening", listening);
  App.Http.on("request", respond);
  App.Ws = App.Ws || new (require('ws').Server)({ server: App.Http });
  App.Ws.on("connection", connect);

  // start
  App.Http.listen(1666);

  return App;

  function listening () { $.Log("listening on 0.0.0.0:1666") }
  function respond (req, res) {
    try {
      _.HTTP(req.url, req, res)
    } catch (e) {
      $.Log.Error('Error when trying to respond to HTTP request:', '\n ', e.stack);
    }
  }
  function connect () { _.WS(App, arguments[0]) }

  function reload (node) {
    $.Log('Restarting server...');
    if (App.Http) {
      App.Http.removeListener('listening', listening);
      App.Http.removeListener('request',   respond); }
    if (App.Ws) App.Ws.removeListener('connection', connection);
    try {
      node()(App);
    } catch (e) {
      $.Log.Error('Error reloading /server/main');
      $.Log.Error(e); } } }
