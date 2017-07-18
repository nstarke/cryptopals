var fs = require('fs');
var crypto = require('crypto');

var decipher = crypto.createDecipheriv('AES-128-ECB', "YELLOW SUBMARINE", '');

var file = fs.readFileSync('./data/7.txt');
var data = file.toString().split('\n').join('');
var decrypted = decipher.update(data, 'base64', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
