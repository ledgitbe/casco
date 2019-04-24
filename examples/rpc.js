const brisk = require('..');
const rpcRouter = require('../lib/middleware/rpc-router');
const rpcLogger = require('../lib/middleware/rpc-logger');
const rpcResponder = require('../lib/middleware/rpc-responder');

const state = {
  db: {},
  participants: [],
  initialized: false,
};

function mustBeParticipant(req, res, next) {
  if (state.participants.indexOf(req.caller) >= 0) {
    next();
  } else {
    console.log("Received call for " + req.fn + " but caller is not participant");
  }
}

function mustHaveArguments(howmany) {
  return function(req, res, next) {
    if (req.args.length === howmany) {
      next();
    } else {
      console.log(`Received call for '${req.fn}' with incorrect number of args. Expected ${howmany}, but only ${req.args.length} given`);
    }
  }
}

function requiresInit(req, res, next) {
  if (state.initialized) {
    next();
  }
}

const app = brisk();

// rpcRouter implements the following protocol:
// txOutput 0: OP_RETURN <BITCOM_ID> <ROUTE> <JSON ENCODED ARGUMENTS ARRAY>
// Fills req.route, req.args, req.caller
app.use(rpcRouter);

// Log rpc transactions every time
app.use(rpcLogger);
app.use((req, res, next) => { next(); console.log(state); });

// Attach req.send if we're not syncing
app.use(rpcResponder('L4PkQg1y39F1QfdmVJVZrb2DrEqxhSTzXtQ2gSJChmuoE5uRVqWo', (err, txid) => {console.log(err, txid)}));


app.use('init', (req, res) => {
  if (!state.initialized) {
    state.participants = state.participants.concat(req.caller);
    state.initialized = true;
  }
});

app.use('invite', requiresInit, mustBeParticipant, (req, res) => {
  state.participants = state.participants.concat(req.args[0]);
});

app.use('set', requiresInit, mustBeParticipant, mustHaveArguments(2), (req, res) => {
  let [key, value] = req.args;
  state.db[key] = value;
  res.send(['14yDSfMug1RxTRfAKC1mrfD1LqoBGSXUWc', 'confirm', JSON.stringify([req.tx.tx.h])]);
});

app.use('del', requiresInit, mustBeParticipant, mustHaveArguments(1), (req, res) => {
  let [key] = req.args;
  delete state.db[key];
});

app.use('confirm', (req, res) => {
  if (req.caller === '14yDSfMug1RxTRfAKC1mrfD1LqoBGSXUWc') {
    console.log('We confirmed transaction ' + req.args[0]);
  }
});

app.listen('bit://14yDSfMug1RxTRfAKC1mrfD1LqoBGSXUWc', 570000);
