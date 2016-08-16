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

  function listening () { $.log("listening on 0.0.0.0:1617") }
  function respond (req, res) { _.urls(req.url, req, res) }
  function connect () { _.socket(App, arguments[0]) }

  function reload (node) {
    $.log('Restarting server...');
    if (App.Http) {
      App.Http.removeListener('listening', listening);
      App.Http.removeListener('request',   respond); }
    if (App.Socket) App.Socket.removeListener('connection', connection);
    try {
      node()(App);
    } catch (e) {
      $.log.error('Error reloading /server/main');
      $.log.error(e); } } }
