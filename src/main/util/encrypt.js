'use restrict'
/**
 * Configurations of cryptography.
 */

// Nodejs encryption with CTR
const crypto = require('crypto');

function encrypt(text) {
  var mykey = crypto.createCipher('aes-128-cbc', '123abc@');
  var mystr = mykey.update(text, 'utf8', 'hex')
  return mystr += mykey.final('hex');
}

function decrypt(text) {
  var mykey = crypto.createDecipher('aes-128-cbc', '123abc@');
  var mystr = mykey.update(text, 'hex', 'utf8')
  return mystr += mykey.final('utf8');
}
module.exports = {
  'encrypt': encrypt,
  'decrypt': decrypt
};