var path = require('path')
  , fs   = require('fs');

var datastore = module.exports =
  { location:
      path.resolve(__dirname, '..', 'data')
  , get(type, id) {
      return datastore.data.get(type).get(id).value; }
  , set(type, id, value, cb) {
      var location = path.resolve(datastore.location, type, id);
      fs.writeFile(location, JSON.stringify(data), 'utf8',
        (err) => { if (err) throw err; else cb() ); } };
      // TODO plaintext versioning hehehehehe

datastore.data = require('glagol')(datastore.location, {});
