'use strict';

var app = {
  pow: function (base, exponent) {
    var result = base;

    if (exponent === 0) {
      result = base * exponent;

      return result;
    } else {
      if(exponent < 0) {
        exponent = Math.abs(exponent);

        for (var i = 1; i < exponent; i++) {
          result *= base;
        }
        result = +((1 /result).toFixed(10));

        return result;
      } else {
        for (var i = 1; i < exponent; i++) {
          result *= base;
        }

        return result;
      }
    }
  }
};

module.exports = app;
