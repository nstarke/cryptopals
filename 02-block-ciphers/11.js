var crypto = require('crypto');

var INPUT = process.env.INPUT || "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf";
var DEBUG = process.env.DEBUG;
var BLOCK_SIZE = 16;

function generateCipherText(input){
  var key = crypto.randomBytes(16);
  var iv = crypto.randomBytes(16);

  if (DEBUG) console.log('KEY: ' + key.toString('base64') + ' | IV: ' + iv.toString('base64'));

  var cbc = crypto.createCipheriv('aes-128-cbc', key, iv);
  var ecb = crypto.createCipheriv('aes-128-ecb', key, '');

  var plaintext = [];
  plaintext.push(randomCount());
  plaintext.push(Buffer.from(input));
  plaintext.push(randomCount());

  input = Buffer.concat(plaintext);

  if (DEBUG) console.log('PLAINTEXT: ' + input.toString('base64'));

  var result = [];
  if (randomBool()) {
    if (DEBUG) console.log('MODE: CBC');
    result.push(cbc.update(input));
    result.push(cbc.final());
  } else {
    if (DEBUG) console.log('MODE: ECB');
    result.push(ecb.update(input));
    result.push(ecb.final());
  }

  var output = Buffer.concat(result);
  return output;
}

function randomCount(){
  var count = (crypto.randomBytes(1)[0] % 5) + 5;
  return crypto.randomBytes(count);
}

function chunk(start, line){
  var result = [];
  for (var i = start; i < (line.length + start); i += BLOCK_SIZE){
    result.push(line.slice(i % line.length, (i + BLOCK_SIZE) % line.length));
  }
  return result;
}

function check(chunks){
  var count = 0;
  for (var i = 0; i < chunks.length; i++){
    for (var j = 0; j < chunks.length; j++){
      if (i !== j && chunks[i].equals(chunks[j])) count++;
    }
  }

  return count;
}

function randomBool(){
  var random = crypto.randomBytes(1);
  return random[0] > 0x80;
}

function analyze(ciphertext){
  if (DEBUG) console.log('CIPHERTEXT: ' + ciphertext.toString('base64'));
  var total = 0;
  for (var j = 0; j < ciphertext.length; j++){
    var chunks = chunk(j, ciphertext);
    var count = check(chunks);
    if (count > 0) total++;
  }

  if (total > 0){
    console.log('ecb mode');
  } else {
    console.log('cbc mode');
  }
}

for (var i = 0; i < 10; i++){
  var ciphertextECB = generateCipherText(INPUT);
  analyze(ciphertextECB);
}

