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

module.exports = async function(app, socketQuery, dbQuery) {
  let crawling = true;

  // This will hold seen txid, to prevent any double dispatches when we switch from crawling mode(bitquery) to running mode (bitsocket)
  const seen = new CircularBuffer(25);

  // This paused queue will hold all tx's that are received during crawling(bitquery), after the bitquery txs are processed,
  // this queue will be put into autostart mode
  const queue = Queue({ concurrency: 1, autostart: false});

  const listenHandler = function(bitDbResponse) {
    if (crawling) {
      debug("tx while crawling! adding to queue");
    }
    queue.push(function(cb) {
      const isAlreadySeen = seen.toarray().indexOf(bitDbResponse.tx.h) >= 0;
      if (isAlreadySeen) {
        debug("TX", bitDbResponse.tx.h, "already seen! Doing nothing");
        cb();
      }
      debug("Now processing tx in the queue");
      dispatch(bitDbResponse, 'mempool');
      cb();
    });
  }

  const crawlHandler = (bitDbResponse) => {
    dispatch(bitDbResponse, 'block');
    seen.enq(bitDbResponse.tx.h);
  }

  adapter.listen(socketQuery, listenHandler);
  await adapter.crawl(dbQuery, crawlHandler);

  // process all transactions that came in while crawling from bitdb query
  queue.start(function(err) {
    if (err) { 
      console.error("queue start error", err); 
      process.exit();
    }
    queue.autostart = true;
    if (crawling) {
      console.log("Syncing complete");
      crawling=false;
    }
  });

  function dispatch(bitDbResponse, method) {
    let req = {};
    let res = {};

    req.tx = bitDbResponse;
    req.method = method;
    req.isCrawling = crawling;
    req.url = '/';

    // Send through umr
    app.handle(req, {}, () => {});
  }

  return;
}
