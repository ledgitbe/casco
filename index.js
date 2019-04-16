require('dotenv').config()
const BitSocket = require('./BitSocket.js');
const BitQuery = require('./BitQuery.js');
const createStore = require('redux').createStore;
const Validator = require("fastest-validator");
const CircularBuffer = require('circular-buffer');
const Queue = require('queue');
const { messages: {Request, Response} } = require("./messages.js");
const Protobuf = require('protobufjs/minimal');
const ECEIS = require('bsv/ecies');
const { PrivateKey, PublicKey } = require('bsv');


const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));


function debug(str) {
  if (process.env.DEBUG) {
    console.log(str);
  }
}

module.exports = exports = async function (vision, onAction) {
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

  const store = createStore(vision.reducer);
  const socketQuery = {
    v: 3,
    q: {
      find: { "out.s1" : vision.address },
    },
    r: {
      f: ".[] | { r: .out[0].b2, c: .in[0].e.a, tx: . }"
    }
  };
  const syncQuery = {
    "v": 3,
    "q": {
      "find": { "out.s1": vision.address, "$or": [ { "blk.i" : {"$gt": vision.from }}, { "blk.i": { "$exists" : false } } ] },
      "sort": { "blk.t": 1 }
    },
    "r": {
      "f": "[.[] | { r: .out[0].b2, c: .in[0].e.a, tx: . }]"
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

  const txs = await BitQuery(syncQuery);



  console.info("Starting sync from height", vision.from);
  for (let i = 0; i < txs.c.length; i++) {
    // TODO REFACTOR
    let bitDbResponse = txs.c[i];
    let isValid = isValidBitDbResponse(bitDbResponse);
    if (!isValid) {
      console.error("Invalid BitDB response, possibly invalid OP_RETURN data");
      console.error(isValid);
      return;
    }
    transformAndDispatch(bitDbResponse);
    seen.enq(bitDbResponse.tx.h);
  }
  for (let i = 0; i < txs.u.length; i++) {
    let bitDbResponse = txs.u[i];
    let isValid = isValidBitDbResponse(bitDbResponse);
    if (!isValid) {
      console.error("Invalid BitDB response, possibly invalid OP_RETURN data");
      console.error(isValid);
      return;
    }
    transformAndDispatch(bitDbResponse);
    seen.enq(bitDbResponse.tx.h);
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

  // go from {r, c, tx } to { type, payload, caller, tx }
  function transformAndDispatch(data) {
    // is already valid bitdbresponse
    try {
      // 0. Decrypt
      const CID = ECEIS()
        .privateKey(PrivateKey.fromWIF(process.env.privateKey))
        .publicKey(PublicKey(data.tx.in[0].h1)); // h1 = pubKey
      const decrypted = CID.decrypt(Buffer.from(data.r, 'base64'));
      //
      // 1. protobuf decode r
      let decodedRequestMessage = Request.decode(decrypted);
      // 2. turn message into object
      let requestObject = Request.toObject(decodedRequestMessage, {
        arrays: true,   // populates empty arrays (repeated fields) even if defaults=false
      });
      // 3. verify object schema
      let err = Request.verify(requestObject);
      if (err)
        throw Error(err);

      // 4. Tranform into a redux action
      let action = { 
        type: requestObject.func,
        payload: requestObject.args,
        caller: data.c,
        tx: data.tx
      }


      // TODO: maybe this is a bit too much?
      let isValid = isValidAction(action);
      if (!isValid) {
        throw new Error("Valid protobuf Request message transformed into invalid Redux action");
      }

      store.dispatch(action);
      // Callback when action happens
      onAction({ isSyncing: syncing, action, tx, state: store.getState()});
    } catch(e) {
      // TODO: improve
      if (e instanceof Protobuf.util.ProtocolError) {
        // e.instance holds the so far decoded message with missing required fields
      } else {
        // wire format is invalid
      }
      console.error("Invalid protobuf:", e.message, data.r);
      return;
    }
  }

  return {
    getState: store.getState
  };
}

exports.Request = Request;
