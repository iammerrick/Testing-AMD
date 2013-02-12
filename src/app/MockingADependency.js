define(function(require) {
  var ADependency = require('app/ADependency');

  return {
    sum: function(a, b) {
      return 'A friendly sum: '+ADependency.sum(a, b);
    }
  }
});