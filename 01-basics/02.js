var source = Buffer.from("1c0111001f010100061a024b53535009181c", "hex");
var key = Buffer.from("686974207468652062756c6c277320657965", "hex");
var result = new Buffer(key.length);
for (var i = 0; i < source.length; i++){
  result[i] = source[i] ^ key[i];
}
console.log(result.toString("hex") === "746865206b696420646f6e277420706c6179");
