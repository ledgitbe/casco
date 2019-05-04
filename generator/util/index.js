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
  try {
    var bestBlockHash = await bitindex.chaininfo.bestBlockHash();
    var bestBlock = await bitindex.block.getByBlockHash(bestBlockHash.bestblockhash);
    if (!bestBlock.height) {
      throw Error("Couldn't get block height");
    }
    return bestBlock.height;
  } catch (e) {
    console.error("Could not connect to BitIndex, we'll use a default sync height from block 500000");
    console.log("Error message: "+ e);
    return 500000;
  }

}
