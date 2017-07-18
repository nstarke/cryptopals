var fs = require('fs');
fs.readFile('./data/4.txt',{ 'encoding': 'utf8' }, function(err, file){
  var lines = file.toString().split('\n');
  var scores = [];
  for (var line = 0; line < lines.length; line++){
    var ciphertext = Buffer.from(lines[line], "hex");
    for (var i = 32; i <128; i++){
      var result = new Buffer(ciphertext.length);
      var score = 0;
      for (var j = 0; j < result.length; j++){
        result[j] = ciphertext[j] ^ i;
        if ((result[j] >=65 && result[j] < 91) || (result[j] >=97 && result[j] < 123)){
          score++;
        }
      }
      scores.push({char: i, score: score , result: result.toString('ascii'), ciphertext: lines[line]});
    }
  }

  var max = { score: 0 };

  scores.forEach(function(score){
    if (score.score > max.score) max = score;
    if (score.score > 23) console.log(score);
  });

  //console.log(max);
});

//  { char: 53,
//    score: 24,
//    result: 'Now that the party is jumping\n',
//    ciphertext: '7b5a4215415d544115415d5015455447414c155c46155f4058455c5b523f'
//  }
