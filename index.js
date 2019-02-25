const BitSocket = require('./BitSocket.js');
const BitQuery = require('./BitQuery.js');
const createStore = require('redux').createStore;
const Validator = require("fastest-validator");

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
      "sort": { "blk.t": -1 }
    },
    "r": {
      "f": "[.[] | { type: .out[0].s2, payload: .out[0].s3, caller: .in[0].e.a, tx: .tx.h}]"
    }
  };
  let syncing = true;
  let syncBackLog = [];

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
      syncBackLog.push(data);
    } else {
      transformAndDispatch(data);
    }
  }

  const txs = await BitQuery(syncQuery);

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

  console.info("Starting sync from height", vision.from);
  for (let i = txs.c.length -1; i >= 0; i--) {
    transformAndDispatch(txs.c[i]);
  }
  for (let i = 0; i < txs.u.length; i++) {
    transformAndDispatch(txs.u[i]);
  }
  syncing = false;
  if (syncBackLog.length > 0) {
    for (let i = syncBackLog.length -1; i>= 0; i--) {
      transformAndDispatch(syncBackLog[i]);
    }
  }
  syncBackLog = [];
  console.info("Syncing complete");

  return {
    getState: store.getState
  };
}
