function pow(base, exponent) {
  var result = base;

  for (var i = 1; i < exponent; i++) {
    result *= base;
  }

  return result;
}

var base = prompt("Какое число возводим в степень?", '');
var exponent = prompt("В какую степень возводим число?", '');

if (exponent < 1) {
  alert('Степень ' + exponent +
  ' недопустимое значение, введите степень большую чем 0');
} else {
  console.log( pow(base, exponent) );
}
