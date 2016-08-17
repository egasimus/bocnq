module.exports = function () {
  if (!process.versions.electron) return;
  log('running in electron.');
  var electron = require('electron')
    , w;
  electron.app.on('ready', function () {
    log('electron ready, opening window');
    w = new electron.BrowserWindow({ frame: false })
    w.loadURL('http://localhost:1666');
    w.on('closed', () => { w = null }) }); }
