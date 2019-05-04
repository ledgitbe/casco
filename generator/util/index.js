const bsv = require('bsv');
const bitindex = require('bitindex-sdk').instance();

module.exports.createKey = () => {
  let privateKey = new bsv.PrivateKey();
  let address = privateKey.toAddress();
  let pubKey = privateKey.toPublicKey();

  return {
    ADDRESS: address.toString(),
    PUBLIC_KEY: pubKey.toString(),
    PRIVATE_KEY: privateKey.toWIF(),
  };

}

module.exports.getBlockHeight = async () => {
  var bestBlockHash = await bitindex.chaininfo.bestBlockHash();
  var bestBlock = await bitindex.block.getByBlockHash(bestBlockHash.bestblockhash);
  return bestBlock.height;
}
