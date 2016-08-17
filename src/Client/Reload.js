module.exports = function (reason) {
  return function () {
    console.log(reason + ', reloading');
    window.location.reload()
  }
}
