const ECIES = require('bsv/ecies');
const { PrivateKey, PublicKey } = require('bsv');

module.exports.filterAddress = (addresses) => {
  return function(req, res, next) {
    if (addresses.indexOf(req.tx.out[0].s2)>=0) { 
    	next();
    }
  }
}
module.exports.decrypt = (privateKey, publicKey) => {
  return function(req, res, next) {
    const CID = new ECIES({noKey: true})
      .publicKey(PublicKey(publicKey))
      .privateKey(PrivateKey.fromWIF(privateKey));

    const encrypted = CID.encrypt('quickfix'); // Doesn't matter what's encrypted here, it sets the _ivkEkM prop 
    let decrypted;
    try {
      decrypted = CID.decrypt(Buffer.from(req.tx.out[0].b3, 'base64')).toString();
    } catch(e) {
      console.log(e)
      return;
    }

    req.message = decrypted;
    req.caller = req.tx.in[0].e.a;

    next();
  }
}
module.exports.encrypt = (privateKey, publicKey, message) => {
  const CID = new ECIES({noKey: true})
    .publicKey(PublicKey(publicKey))
    .privateKey(PrivateKey.fromWIF(privateKey));

  let encrypted;
  try {
    encrypted = CID.encrypt(message);
  } catch(e) {
    console.log(e)
    return "";
  }
  return encrypted;
}



