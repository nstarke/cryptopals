var input = process.env.input;
// var input = "YELLOW SUBMARINE";

function pad(input, length){
  input = Buffer.from(input);
  if (input.length % length === 0){
    return input;
  }

  var padLength = length - (input.length % length);
  console.log(padLength);
  var result = Buffer.alloc(input.length + padLength);
  result.fill(padLength);
  input.copy(result);
  return result;
}

var padding = pad(input, 16);
console.log(padding,input.length, padding.length);
