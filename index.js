const BitSocket = require('./BitSocket.js');
const BitQuery = require('./BitQuery.js');
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

module.exports = async function(vision, onAction) {
  const validator = new Validator();
  const actionSchema = {
    type: "string",
    payload: "array",
    caller: "string",
    tx: "string"
  };
  const isValidAction = validator.compile(actionSchema);

  const store = createStore(vision.reducer);
  const socketQuery = {
    v: 3,
    q: {
      find: { "out.s1" : vision.address },
    },
    r: {
      f: ".[] | { type: .out[0].s2, payload: .out[0].s3, caller: .in[0].e.a, tx: .tx.h}"
    }
  };
  const syncQuery = {
    "v": 3,
    "q": {
      "find": { "out.s1": vision.address, "$or": [ { "blk.i" : {"$gt": vision.from }}, { "blk.i": { "$exists" : false } } ] },
      "sort": { "blk.t": 1 }
    },
    "r": {
      "f": "[.[] | { type: .out[0].s2, payload: .out[0].s3, caller: .in[0].e.a, tx: .tx.h}]"
    }
  };
  let syncing = true;
  // This will hold seen txid, to prevent any double dispatches when we switch from syncing mode(bitquery) to running mode (bitsocket)
  const seen = new CircularBuffer(25);
  // This paused queue will hold all tx's that are received during syncing(bitquery), after the bitquery txs are processed,
  // this queue will be put into autostart mode
  const queue = Queue({ concurrency: 1, autostart: false});

  const bitsocket = BitSocket(socketQuery);

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

    data = data.data;

    if (syncing) {
      debug("tx while syncing! adding to queue");
    }

    queue.push(function(cb) {
      const isAlreadySeen = seen.toarray().indexOf(data.tx) >= 0;
      if (isAlreadySeen) {
        debug("TX", data.tx, "already seen! Doing nothing");
        cb();
      }
      debug("Now processing tx in the queue");
      transformAndDispatch(data);
      cb();
    });
  }

  const txs = await BitQuery(syncQuery);



  console.info("Starting sync from height", vision.from);
  for (let i = 0; i < txs.c.length; i++) {
    transformAndDispatch(txs.c[i]);
    seen.enq(txs.c[i].tx);
  }
  for (let i = 0; i < txs.u.length; i++) {
    transformAndDispatch(txs.u[i]);
    seen.enq(txs.u[i].tx);
  }
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

  function transformAndDispatch(data) {
    try {
      data.payload = JSON.parse(data.payload);
      let isValid = isValidAction(data);

      if (!isValid) {
        throw new Error(isValid);
      }

      store.dispatch(data);
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
