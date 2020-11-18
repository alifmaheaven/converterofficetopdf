var multer = require('multer');
var randomstring = require("randomstring");
// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
 let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
 let iv = Buffer.from(text.iv, 'hex');
 let encryptedText = Buffer.from(text.encryptedData, 'hex');
 let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}

var extention
var extentiontrue
var storage 
var encryptname

module.exports.destination = (destination) => {
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, destination)
        },
        filename: function (req, file, cb) {
            extention = file.originalname.split(".")
            extentiontrue = extention[extention.length - 1]
            encryptname = encrypt(file.originalname+new Date().getTime()+randomstring.generate(8))
            // console.log(encryptname);
          cb(null, encryptname.encryptedData+'_'+new Date().getTime() + '.' + extentiontrue)
        }
      })

    return multer({
        storage: storage,
    })
}