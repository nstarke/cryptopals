var crypto = require('crypto');

var INPUT = "the quick brown fox jumped over the lazy dog | abcdefghijklmnopqrstuvwxyz | aaaaaaaaaaaaaaaaaaaaaaaaa";

var DEBUG = true;

function generateCipherText(input){
  var key = crypto.randomBytes(16);
  var iv = crypto.randomBytes(16);

  if (DEBUG) console.log('KEY: ' + key.toString('base64') + ' | IV: ' + iv.toString('base64'));

  var cbc = crypto.createCipheriv('aes-128-cbc', key, iv);
  var ecb = crypto.createCipheriv('aes-128-ecb', key, '');
  cbc.setAutoPadding(false);
  ecb.setAutoPadding(false);

  var plaintext = [];
  plaintext.push(randomCount());
  plaintext.push(Buffer.from(input));
  plaintext.push(randomCount());

  input = pad(Buffer.concat(plaintext), 16);

  if (DEBUG) console.log('PLAINTEXT: ' + input.toString('base64'));

  var result = [];

  if (randomBool()) {
    if (DEBUG) console.log('MODE: CBC');
    result.push(cbc.update(input));
    result.push(cbc.final());
     //result += cbc.final();
  } else {
    if (DEBUG) console.log('MODE: ECB');
    result.push(ecb.update(input));
    result.push(ecb.final());
    //result += ecb.final();
  }

  return Buffer.concat(result);
}

function randomCount(){
  var count = (crypto.randomBytes(1)[0] % 5) + 5;
  return crypto.randomBytes(count);
}

function pad(input, length){
  if (input.length % length === 0){
    return input;
  }

  var padLength = length - (input.length % length);
  var result = Buffer.alloc(input.length + padLength);
  result.fill(padLength);
  input.copy(result);
  return result;
}

function randomBool(){
  var random = crypto.randomBytes(1);
  return random[0] > 0x80;
}

for (var i = 0; i < 10; i++){
  var ciphertext = generateCipherText(INPUT).toString('base64');
  console.log('CIPHERTEXT: ' + ciphertext);
  console.log('\n----------------------------------------\n');
}

