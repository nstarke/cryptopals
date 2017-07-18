var ciphertext = Buffer.from("1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736", "hex");
var scores = [];
for (var i = 32; i <128; i++){
  var result = new Buffer(ciphertext.length);
  var score = 0;
  for (var j = 0; j < result.length; j++){
    result[j] = ciphertext[j] ^ i;
    if ((result[j] >=65 && result[j] < 91) || (result[j] >=97 && result[j] < 123)){
      score++;
    }
  }
  scores.push({char: i, score: score , result: result.toString('ascii')});
  // console.log(i, result.toString('ascii'), score);
}

var max = { score: 0 };

scores.forEach(function(score){
  if (score.score > max.score) max = score;
});

console.log(max);
