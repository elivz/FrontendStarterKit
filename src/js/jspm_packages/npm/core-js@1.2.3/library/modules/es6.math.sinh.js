/* */ 
var $def = require('./$.def'),
    expm1 = require('./$.expm1'),
    exp = Math.exp;
$def($def.S + $def.F * require('./$.fails')(function() {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {sinh: function sinh(x) {
    return Math.abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }});
