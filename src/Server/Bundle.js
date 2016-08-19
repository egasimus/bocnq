var path      = require('path')
  , File      = require('glagol/core/file')
  , Directory = require('glagol/core/directory')
  , Error     = require('glagol/core/error')

module.exports = function makeBundler (app) {

  var bundler =
    { app:        app
    , browserify: require('browserify')({ cache: {} })
    , buildApp:   buildApp
    , buildLibs:  buildLibs };

  require('browserify-incremental-plugin')(bundler.browserify);
  return bundler;

  function buildLibs (cb) {
    var bundlerOptions = app.options.bundler || {}
      , result         = { formats: app.options.formats }
      , currently      = '';
    try {
      currently = 'determining app dependencies';
        result.deps = deps(app);
      currently = 'bundling client code';
        bundler.browserify.require('glagol', { expose: 'glagol' });
        ['plaintext', 'javascript'].forEach((format) => {
          format = 'glagol/formats/' + format + '.js';
          bundler.browserify.require(format, { expose: 'format' }) })
        Object.keys(result.deps.ids).forEach(function (module) {
          bundler.browserify.require(module, { expose: result.deps.ids[module] }) })
        bundler.browserify.bundle(cb);
    } catch (error) {
      cb(error, null);
    }
  }

  function buildApp (cb) {
    try {
      cb(null, freeze(app));
    } catch (e) {
      cb(e, null)
    }
  }
}

function freeze (node, parent) {
  if (File.is(node)) {
    if (node._mountTarget) return freeze(node._mountTarget);
    return node.compiled || "";
  } else if (Directory.is(node)) {
    var ice = {};
    Object.keys(node.nodes).forEach((name) => {
      ice[name] = freeze(node.nodes[name], node); })
    return ice;
  } else {
    throw Error.FOREIGN_BODY(node, parent);
  }
}

function deps (rootNode) {
  var result = { ids: {}, deps: {} }
  detect(rootNode);
  return result;

  function detect (node, link) {
    if (node.nodes) {
      Object.keys(node.nodes).map(
        (n) => { detect(
          node.nodes[n], (node._glagol.link ? node.path : null) || link);
        })
    } else if (node.compiled) {
      var opts   = { filename: node._sourcePath || "" }
        , key    = (link || '') + '/' + path.relative(rootNode.path, node.path)
        , myDeps = result.deps[key] = {};
      try {
        require('detective')(node.compiled).forEach((d) => {
          var resolved = require('browser-resolve').sync(d, opts);
          myDeps[d] = result.ids[resolved] =
            result.ids[resolved] || require('shortid').generate(); })
      } catch (e) {
        e.sourceNode = node.path;
        throw e;
      }
    }
  }
}
