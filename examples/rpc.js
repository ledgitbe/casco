const brisk = require('..');
const rpcRouter = require('../lib/middleware/rpc-router');
const rpcLogger = require('../lib/middleware/rpc-logger');

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

app.address = "14yDSfMug1RxTRfAKC1mrfD1LqoBGSXUWc";
app.from = 571999;

// rpcRouter implements the following protocol:
// txOutput 0: OP_RETURN <BITCOM_ID> <ROUTE> <JSON ENCODED ARGUMENTS ARRAY>
// Fills req.route, req.args, req.caller
app.use(rpcRouter);
// Log them every time
app.use(rpcLogger);

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
});

app.use('del', requiresInit, mustBeParticipant, mustHaveArguments(1), (req, res) => {
  let [key] = req.args;
  delete state.db[key];
});

app.listen();
