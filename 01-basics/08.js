var fs = require('fs');

var lines = fs.readFileSync('./data/8.txt').toString().split('\n');

function chunk(start, line){
  var result = [];
  for (var i = start; i < line.length; i += 16){
    result.push(line.slice(i, i + 16));
  }
  return result;
}

function check(line, chunks){
  var count = 0;
  for (var i = 0; i < chunks.length; i++){
     count += getCount(chunks, chunks[i]);
  }
  return count;
}

function getCount(chunks, chunk){
  var count = 0;
  for (var i = 0; i < chunks.length; i++){
    if (chunk && chunks[i].equals(chunk)) count++;
  }
  return count;
}

var results = [];
for (var line = 0; line < lines.length; line++){
  var current = Buffer.from(lines[line], 'hex');
  for (var i = 0; i < current.length; i++){
    var chunks = chunk(i, current);
    var duplicates = check(current, chunks);
    if (duplicates !== 0)
      results.push({ line: line + 1, reps: duplicates, index: i, ciphertext: current.toString('hex') });
  }
}

results = results.sort(function(a, b){
  return a.reps - b.reps;
}).pop();

console.log(results.ciphertext);
