const ECIES = require('bsv/ecies');
const { PrivateKey, PublicKey } = require('bsv');

/*
/ This assumes the encrypted data is inside s2
/ It also assumes the plaintext is a JSON encoded array:
/ [ func, arg1, arg2, arg3, ... ]
/
/ Also, this decryption middleware is taking on router responsibilities,
/ which isn't really a nice thing designwise.
/
/ Also, json here doesnt *have* to be json, it could be protobufs or any
/ other data serialization format.
/
/ In the end, client and server just need to agree on something.
/ Standard middleware should just provide a sane starter kit.
*/

function createCryptoRouter(privateKey) {
  return function(req, res, next) {
    //    let publicKey = req.tx.in[0].h1;

    const CID = ECIES()
      .privateKey(PrivateKey.fromWIF(privateKey))
    //  .publicKey(PublicKey(publicKey));

    let decrypted;
    try {
      decrypted = CID.decrypt(Buffer.from(req.tx.out[0].b2, 'base64')).toString();
      decrypted = JSON.parse(decrypted);
    } catch(e) {
      console.log(e)
      return;
    }

    req.route = decrypted[0];
    req.args = decrypted.slice(1);
    req.caller = req.tx.in[0].e.a;

    next();
  }
}

module.exports = exports = createCryptoRouter;
