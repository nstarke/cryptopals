var input = process.env.input;
// var input = "YELLOW SUBMARINE";

function pad(input, length){
  input = Buffer.from(input);
  if (input.length === length){
    return input;
  }
  var padLength = length % input.length;
  var result = new Buffer(input.length + padLength);
  result.fill(padLength);
  input.copy(result);
  return result;
}

var padding = pad(input, 24);
console.log(padding.toString());
