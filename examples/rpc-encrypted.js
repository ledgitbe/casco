const brisk = require('..');
const rpcRouter = require('../lib/middleware/rpc-router');
const rpcLogger = require('../lib/middleware/rpc-logger');
const rpcResponder = require('../lib/middleware/rpc-responder');
const rpcDecrypt = require('../lib/middleware/rpc-decrypt');

require('dotenv').config();

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
app.use(rpcDecrypt(process.env.PRIVATE_KEY));
app.use(rpcRouter);

// Log rpc transactions every time
app.use(rpcLogger);
app.use((req, res, next) => {
  next();
  console.log(state);
});

app.use('init', (req, res) => {
  if (!state.initialized) {
    state.participants = state.participants.concat(req.caller);
    state.initialized = true;
  }
});

app.use('invite', requiresInit, mustBeParticipant, (req, res) => {
  state.participants = state.participants.concat(req.args[0]);
});

app.use('set', mustBeParticipant, mustHaveArguments(2), (req, res) => {
  let [key, value] = req.args;
  state.db[key] = value;
});

app.use('del', requiresInit, mustBeParticipant, mustHaveArguments(1), (req, res) => {
  let [key] = req.args;
  delete state.db[key];
});

app.listen(`bit://${process.env.ADDRESS}`, 570000);
