const ECIES = require('bsv/ecies');
const { PrivateKey, PublicKey } = require('bsv');

/* TODO:
/ This assumes the encrypted data is inside s2
/ It also assumes the plaintext is a JSON encoded array:
/ [ func, arg1, arg2, arg3, ... ]
/
/ The problem is that this does not currently match the way rpc-router
/ interprets s2 and s3
/ 
/ Also, this decryption middleware is taking on router responsibilities,
/ which isn't really a nice thing designwise.
/
/ It would be nice is we could have interchangable layers
/ for both cases:
/
/ case 1 (encryption)       case 2 (encryption layer omitted)
/ ===================       =================================
/ plaintext                 plaintext
/ json                      json
/ encrypt                   s2
/ s2
/
/ Also, json here doesnt *have* to be json, it could be protobufs or any
/ other data serialization format.
/
/ In the end, client and server just need to agree on something.
/ Standard middleware should just provide a sane starter kit.
*/

function createCryptoRouter(privateKey, _publicKey) {
  return function(req, res, next) {
    let publicKey = _publicKey || req.tx.in[0].h1;

    const CID = ECIES()
      .privateKey(PrivateKey.fromWIF(privateKey))
      .publicKey(publicKey);

    let decrypted = CID.decrypt(Buffer.from(req.tx.out[0].s2, 'base64')).toString();

    decrypted = JSON.parse(decrypted);

    req.route = decrypted[0];
    req.args = decrypted.slice(1);
    req.caller = req.tx.in[0].e.a;

    next();
  }
}

module.exports = exports = createResponder;
