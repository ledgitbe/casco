const adapter = require('./adapters/bitdb');
const createStore = require('redux').createStore;
const Validator = require("fastest-validator");
const CircularBuffer = require('circular-buffer');
const Queue = require('queue');

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

function debug(str) {
  if (process.env.DEBUG) {
    console.log(str);
  }
}

const validator = new Validator();
const schemas = {
  actionSchema: {
    type: "string",
    payload: "array",
    caller: "string",
    tx: "object"
  },
  bitDbResponseSchema: {
    r: "string",
    c: "string",
    tx: "object"
  }
};
const isValidAction = validator.compile(schemas.actionSchema);
const isValidBitDbResponse = validator.compile(schemas.bitDbResponseSchema);



module.exports = async function(vision, onAction) {
  const store = createStore(vision.reducer);

  let syncing = true;

  // This will hold seen txid, to prevent any double dispatches when we switch from syncing mode(bitquery) to running mode (bitsocket)
  const seen = new CircularBuffer(25);

  // This paused queue will hold all tx's that are received during syncing(bitquery), after the bitquery txs are processed,
  // this queue will be put into autostart mode
  const queue = Queue({ concurrency: 1, autostart: false});

  const bitsocket = adapter.socket(vision.address);
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

    let bitDbResponse = data.data;
    let isValid = isValidBitDbResponse(bitDbResponse);
    if (!isValid) {
      console.error("Invalid BitDB response, possibly invalid OP_RETURN data");
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
      transformAndDispatch(bitDbResponse);
      cb();
    });
  }

  const txs = await adapter.findAllContractTxs(vision.address, vision.from);

  // Replay all transactions
  for (let i = 0; i < txs.length; i++) {
    let bitDbResponse = txs[i];
    let isValid = isValidBitDbResponse(bitDbResponse);
    if (!isValid) {
      console.error("Invalid BitDB response, possibly invalid OP_RETURN data");
      console.error(isValid);
      return;
    }
    transformAndDispatch(bitDbResponse);
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

  // go from {f, a, c, tx } to { type, payload, caller, tx }
  function transformAndDispatch(data) {
    try {
      data.a = JSON.parse(data.a);

      let action = {
        type: data.f,
        payload: data.a,
        caller: data.c,
        tx: data.tx
      }

      let isValid = isValidAction(action);
      if (!isValid) {
        throw new Error(isValid);
      }

      store.dispatch(action);
      onAction(syncing, data, store.getState());
    } catch(e) {
      console.error("Invalid rpc message:", e.message, data);
      return;
    }
  }

  return {
    getState: store.getState
  };
}
