var fs = require('fs');
var file = fs.readFileSync('./data/6.txt');
var b64 = file.toString().split('\n').join('');
var ciphertext = Buffer.from(b64, 'base64');

function calculateHammingDistanceInteger(a, b){
  var result = a ^ b;
  var dist = 0;

  while (result !== 0){
    dist++;
    result &= result - 1;
  }
  return dist;
}

function calculateHammingDistanceString(a, b){
  var result = 0;
  for (var i = 0; i < a.length; i++){
    result += calculateHammingDistanceInteger(a.charCodeAt(i), b.charCodeAt(i));
  }
  return result;
}

function calculateHammingDistanceBuffer(a, b){
  var result = 0;
  for (var i = 0; i < a.length; i++){
    result += calculateHammingDistanceInteger(a[i], b[i]);
  }
  return result;
}

function findDistance(keySize){
  var first = ciphertext.slice(0, keySize);
  var second = ciphertext.slice(keySize, keySize * 2);
  var third = ciphertext.slice(keySize * 2, keySize * 3);
  var fourth = ciphertext.slice(keySize * 3, keySize * 4);
  var distance = calculateHammingDistanceBuffer(first, second) / keySize;
  var distance2 = calculateHammingDistanceBuffer(third, fourth) / keySize;
  var distance3 = calculateHammingDistanceBuffer(second, third) / keySize;
  var distance4 = calculateHammingDistanceBuffer(first, third) / keySize;
  var distance5 = calculateHammingDistanceBuffer(first, fourth) / keySize;
  var distance6 = calculateHammingDistanceBuffer(second, fourth) / keySize;

  return (distance + distance2 + distance3 + distance4 + distance5 + distance6) / 6;
}

function transpose(a) {
  return Object.keys(a[0]).map(function(c) {
    return a.map(function(r) { return r[c]; });
  });
}
var results = [];
for (var i = 2; i <= 40; i++){
  results.push({ keysize: i, distance: findDistance(i) });
}

var optimalDistance = results.sort(function(a,b){
  return b.distance - a.distance;
}).pop();

results = [];

for (i = 0; i < ciphertext.length; i += optimalDistance.keysize){
  results.push(ciphertext.slice(i, i + optimalDistance.keysize));
}

var transposed = transpose(results);

var key = "";
for (i = 0; i < transposed.length; i++){
  var block = transposed[i];
  var scores = [];
  for (var j = 32; j <127;j++){
    var score = 0;
    var result = new Buffer(block.length);
    for (var b = 0; b<block.length; b++){
      result[b] = block[b] ^ j;
      if ((result[b] >= 65 && result[b] < 91) || (result[b] >= 97 && result[b] < 123) || result[b] == 32) score++;
    }
    scores.push({char: j, score: score });
  }

  var highScore = scores.sort(function(a,b){
    return a.score - b.score;
  }).pop();

  key += String.fromCharCode(highScore.char);
}

key = Buffer.from(key, 'ascii');
console.log('-----KEY-----');
console.log(key.toString());
console.log('-------------');
console.log('\n');

var final = new Buffer(ciphertext.length);
for (var i = 0; i < ciphertext.length; i++){
  final[i] = ciphertext[i] ^ key[i % key.length];
}

console.log('-----PLAINTEXT-----');
console.log(final.toString());
console.log('-------------------');
