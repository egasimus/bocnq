var colors = require('colors/safe')
  , ital   = colors.italic
  , gray   = colors.gray
  , dim    = colors.dim;

module.exports = makeLogger('core');

module.exports.as = makeLogger;

function makeLogger (as) {

  var log   = _log.bind(null, function(x){return x})
  log.warn  = _log.bind(null, colors.yellow)
  log.error = _log.bind(null, colors.red);

  return log;

  function _log (level) {
    var red  = level ? colors.red : function (arg) { return arg }
      , len  = ( ' bocnq   ' + as + '  ' ).length
      , tag  = [ level(ital(' bocnq '))
               , as ? level(' ' + ital(' ' + as + ' '))
                    : (level === colors.red)    ? ' error '
                    : (level === colors.yellow) ? ' warning '
                    : ''].join('')
      , args = Array.prototype.slice.call(arguments, 1).map(pad);
    args.unshift(tag);
    // TODO in centralized log receiver/printer
    //args.unshift(tag === console._lastTag
      //? ' '.repeat(len - 1)
      //: console._lastTag = tag)
    console.log.apply(console, args);

    function pad (arg) {
      var padding = "\n" + ' '.repeat(len - 2) + red('┇') + ' ';
      return String(arg).split("\n").join(padding)
    }
  }
}
