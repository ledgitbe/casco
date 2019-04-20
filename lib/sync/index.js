const Validator = require("fastest-validator");
const CircularBuffer = require('circular-buffer');
const Queue = require('queue');
const adapter = require('./adapters/bitdb');

// const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

function debug(str) {
  if (process.env.DEBUG) {
    console.log(str);
  }
}

const validator = new Validator();
const schemas = {
  bitDbResponseSchema: {
    tx: "object",
    in: "array",
    out: "array",
    blk: { type: "object", optional: true }
  }
};
const isValidBitDbResponse = validator.compile(schemas.bitDbResponseSchema);

module.exports = async function() {
  var self = this;
  let syncing = true;

  // This will hold seen txid, to prevent any double dispatches when we switch from syncing mode(bitquery) to running mode (bitsocket)
  const seen = new CircularBuffer(25);

  // This paused queue will hold all tx's that are received during syncing(bitquery), after the bitquery txs are processed,
  // this queue will be put into autostart mode
  const queue = Queue({ concurrency: 1, autostart: false});

  const bitsocket = adapter.socket(this.address);
  bitsocket.onmessage = (message) => {
    if (message.type === 'open' || message.type === 'block') {
      return;
    }
    let data;
    try {
      data = JSON.parse(message.data);
    } catch(e) {
      console.error(e);
      return;
    }

    if (data.type !== 'u') {
      return;
    }

    let bitDbResponse = data.data[0];
    let isValid = isValidBitDbResponse(bitDbResponse);
    if (isValid !== true) {
      console.error("Invalid BitDB response");
      return;
    }

    if (syncing) {
      debug("tx while syncing! adding to queue");
    }

    queue.push(function(cb) {
      const isAlreadySeen = seen.toarray().indexOf(bitDbResponse.tx.h) >= 0;
      if (isAlreadySeen) {
        debug("TX", bitDbResponse.tx.h, "already seen! Doing nothing");
        cb();
      }
      debug("Now processing tx in the queue");
      dispatch(bitDbResponse);
      cb();
    });
  }

  const txs = await adapter.findAllContractTxs(this.address, this.from);

  // Replay all transactions
  for (let i = 0; i < txs.length; i++) {
    let bitDbResponse = txs[i];
    let isValid = isValidBitDbResponse(bitDbResponse);
    if (isValid !== true) {
      console.error("Invalid BitDB response");
      return;
    }
    dispatch(bitDbResponse);
    seen.enq(bitDbResponse.tx.h);
  }

  // process all transactions that came in while syncing from bitdb query
  queue.start(function(err) {
    if (err) { 
      console.error("queue start error", err); 
      process.exit();
    }
    queue.autostart = true;
    if (syncing) {
      console.log("Syncing complete");
      syncing=false;
    }
  });

  function dispatch(bitDbResponse) {
    let req = {};
    let res = {};

    req.tx = bitDbResponse;
    req.isSyncing = syncing;

    // Send through umr
    self.handle(req, {}, () => {});
  }

  return;
}
