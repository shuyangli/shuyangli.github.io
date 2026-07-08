var _obfuscate_email = function (clear) {
  // caesar shift by 3 chars
  var obfuscated = "";
  var c;
  for (c = 0; c < clear.length; c++) {
    obfuscated += String.fromCharCode(clear.charCodeAt(c) + 3);
  }
  return obfuscated;
}

var _deobfuscate_email = function (obfuscated) {
  // caesar shift by 3 chars
  var clear = "";
  var c;
  for (c = 0; c < obfuscated.length; c++) {
    clear += String.fromCharCode(obfuscated.charCodeAt(c) - 3);
  }
  return clear;
}

window._obfuscate_email = _obfuscate_email;
window._deobfuscate_email = _deobfuscate_email;
